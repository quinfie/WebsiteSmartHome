import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi, clearCart, getCartFromStorage } from '../../api/cart';
import { getImagePath, handleImageError } from '../../utils/imageUtils';
import { toast } from 'react-hot-toast';
import { getValidPromotions } from '../../api/khuyenmai';
import { KhuyenMaiDto } from '../../types/khuyenmai';
import { paymentApi } from '../../api/payment';
import { updateDonHang, getDonHangById } from '../../api/donhang';
import { RequestUpdateDonHangDto } from '../../types/donhang';

interface CartItem {
    id: string;
    quantity: number;
    price: number;
    tenSanPham?: string;
    hinhAnh?: string;
    soLuongTon?: number;
    img?: string;
}

interface Cart {
    items: CartItem[];
    totalAmount: number;
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [promotions, setPromotions] = useState<KhuyenMaiDto[]>([]);
    const [selectedPromotion, setSelectedPromotion] = useState<KhuyenMaiDto | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [paymentError, setPaymentError] = useState<string | null>(null);

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (totalPrice > 0) {
            fetchValidPromotions();
        }
    }, [totalPrice]);

    const fetchValidPromotions = async () => {
        try {
            const validPromotions = await getValidPromotions(totalPrice);
            setPromotions(validPromotions);

            // Reset promotion when fetching new promotions
            setSelectedPromotion(null);
            setDiscountAmount(0);
        } catch (err) {
            console.error('Error fetching promotions:', err);
            setPromotions([]);
        }
    };

    const handlePromotionChange = (promotion: KhuyenMaiDto | null) => {
        setSelectedPromotion(promotion);
        if (promotion) {
            // Đảm bảo tính toán với số thực
            const discount = Math.floor((totalPrice * Number(promotion.phanTramGiam)) / 100);
            setDiscountAmount(discount);
        } else {
            setDiscountAmount(0);
        }
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const cart = getCartFromStorage();
            setCartItems(cart.items);
            setTotalPrice(cart.totalAmount);
        } catch (err: any) {
            setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) return;

        try {
            setLoading(true);
            const success = await cartApi.updateQuantity(itemId, quantity);
            if (success) {
                fetchCart();
                toast.success('Đã cập nhật số lượng sản phẩm!');
            } else {
                throw new Error('Không thể cập nhật số lượng');
            }
        } catch (err: any) {
            setError('Không thể cập nhật số lượng. Vui lòng thử lại sau.');
            console.error('Error updating quantity:', err);
            toast.error('Không thể cập nhật số lượng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            setLoading(true);
            const success = await cartApi.removeFromCart(itemId);
            if (success) {
                fetchCart();
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
            } else {
                throw new Error('Không thể xóa sản phẩm');
            }
        } catch (err: any) {
            setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
            console.error('Error removing item:', err);
            toast.error('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        try {
            setLoading(true);
            setPaymentStatus('processing');
            setPaymentError(null);
            const finalPrice = totalPrice - discountAmount;
            const checkoutData = {
                maKhuyenMai: selectedPromotion?.id || null,
                tongTien: totalPrice,
                tongTienSauGiam: Math.max(0, finalPrice),
                phiVanChuyen: 30000,
            };

            // 1. Create the order first
            const orderResponse = await cartApi.checkout(checkoutData);

            if (!orderResponse.success || !orderResponse.data?.id) {
                setPaymentStatus('error');
                setPaymentError(orderResponse.message || 'Không nhận được mã đơn hàng từ server');
                throw new Error(orderResponse.message || 'Không nhận được mã đơn hàng từ server');
            }

            const orderId = orderResponse.data.id;

            // 2. Handle payment based on selected method
            if (paymentMethod === 'vnpay') {
                // Prepare payment information
                const paymentInfo = {
                    orderId: orderId,
                    orderType: 'other',
                    amount: finalPrice + 30000,
                    orderDescription: `Thanh toan don hang ${orderId}`,
                    name: 'Thanh toan VNPAY'
                };

                // Call VNPAY API to create payment URL
                const paymentResponse = await paymentApi.createVNPayPayment(paymentInfo);

                if (paymentResponse.success && paymentResponse.data?.paymentUrl) {
                    setPaymentStatus('success');
                    toast('Đang chuyển hướng đến trang thanh toán VNPAY...', {
                        icon: '🔄',
                        duration: 2000
                    });
                    // Redirect user to VNPAY payment URL
                    window.location.href = paymentResponse.data.paymentUrl;
                } else {
                    setPaymentStatus('error');
                    setPaymentError(paymentResponse.message || 'Không thể tạo URL thanh toán VNPAY.');
                    throw new Error(paymentResponse.message || 'Không thể tạo URL thanh toán VNPAY.');
                }
            } else {
                // Handle COD payment
                try {
                    setLoading(true);

                    // Lấy chi tiết đơn hàng sau khi tạo thành công
                    const orderDetailResponse = await getDonHangById(orderId);
                    if (!orderDetailResponse.success || !orderDetailResponse.data) {
                        throw new Error(orderDetailResponse.message || 'Không thể lấy chi tiết đơn hàng vừa tạo');
                    }

                    // Prepare update data including the fetched order details
                    const updateData: RequestUpdateDonHangDto = {
                        trangThaiDonHang: 'Chờ xác nhận',
                        maKhuyenMai: orderDetailResponse.data.maKhuyenMai || undefined,
                        chiTietDonHangs: orderDetailResponse.data.chiTietDonHangs?.map(item => ({
                            maSanPham: item.maSanPham,
                            soLuongMua: item.soLuong,
                            donGiaMua: item.donGia
                        })) || []
                    };

                    // Update order status with full details
                    const updateResponse = await updateDonHang(orderId, updateData);

                    if (!updateResponse.success) {
                        throw new Error(updateResponse.message || 'Không thể cập nhật trạng thái đơn hàng');
                    }

                    // Clear cart after successful order
                    clearCart();

                    setPaymentStatus('success');
                    toast.success('Đặt hàng COD thành công!');
                    navigate(`/ecommerce/checkout/success?orderId=${orderId}`);
                } catch (updateError: any) {
                    console.error('Error during COD payment:', updateError);
                    setPaymentStatus('error');
                    setPaymentError(updateError.message || 'Đặt hàng thành công nhưng có lỗi khi cập nhật trạng thái.');
                    toast.error(updateError.message || 'Đặt hàng thành công nhưng có lỗi khi cập nhật trạng thái.');
                    navigate('/ecommerce/orders');
                } finally {
                    setLoading(false);
                }
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Đã có lỗi xảy ra trong quá trình thanh toán.';
            setPaymentStatus('error');
            setPaymentError(errorMessage);
            setError(errorMessage);
            console.error('Error during checkout:', err);
            toast.error(errorMessage);
        }
    };

    // Function to render status indicator
    const renderStatusIndicator = (soLuongTon?: number) => {
        if (soLuongTon === undefined) return null;

        let color = 'bg-gray-500';
        let label = 'Không xác định';

        if (soLuongTon > 10) {
            color = 'bg-green-500';
            label = 'Còn hàng';
        } else if (soLuongTon > 0) {
            color = 'bg-yellow-500';
            label = `Còn ${soLuongTon} sản phẩm`;
        } else {
            color = 'bg-red-500';
            label = 'Hết hàng';
        }

        return (
            <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full ${color} mr-2`}></div>
                <span className="text-xs text-gray-300">{label}</span>
            </div>
        );
    };

    // Add new component for payment status
    const renderPaymentStatus = () => {
        switch (paymentStatus) {
            case 'processing':
                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-[#182233] p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-[#243447]">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                                <h3 className="text-xl font-semibold text-white mb-2">Đang xử lý thanh toán</h3>
                                <p className="text-gray-400 text-center">Vui lòng đợi trong giây lát...</p>
                            </div>
                        </div>
                    </div>
                );
            case 'success':
                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-[#182233] p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-[#243447]">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                    <i className="fas fa-check text-2xl text-green-500"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Thanh toán thành công!</h3>
                                <p className="text-gray-400 text-center mb-6">Cảm ơn bạn đã mua hàng.</p>
                                <button
                                    onClick={() => navigate('/ecommerce/orders')}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Xem đơn hàng
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-[#182233] p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-[#243447]">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                    <i className="fas fa-times text-2xl text-red-500"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Thanh toán thất bại</h3>
                                <p className="text-gray-400 text-center mb-6">{paymentError}</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setPaymentStatus('idle');
                                            setPaymentError(null);
                                        }}
                                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Thử lại
                                    </button>
                                    <button
                                        onClick={() => navigate('/ecommerce')}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Về trang chủ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8">
            {renderPaymentStatus()}
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <i className="fas fa-shopping-cart text-blue-400"></i>
                    Giỏ hàng của bạn
                </h1>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 shadow-lg flex items-center gap-2">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="bg-[#182233] rounded-lg shadow-lg p-8 text-center border border-[#243447]">
                        <i className="fas fa-shopping-cart text-gray-500 text-5xl mb-4"></i>
                        <h2 className="text-xl font-medium text-gray-200 mb-2">Giỏ hàng trống</h2>
                        <p className="text-gray-400 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
                        <Link
                            to="/ecommerce"
                            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
                        >
                            <i className="fas fa-shopping-bag mr-2"></i>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-3/4">
                            <div className="bg-[#182233] rounded-2xl shadow-lg overflow-hidden border border-[#243447]">
                                <div className="p-6 border-b border-[#243447] bg-gradient-to-r from-[#1a2942] to-[#182233] flex items-center gap-2">
                                    <i className="fas fa-box-open text-blue-400"></i>
                                    <h2 className="text-xl font-semibold text-white">
                                        Sản phẩm ({cartItems.length})
                                    </h2>
                                </div>
                                <ul className="divide-y divide-[#243447]">
                                    {cartItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[#1b2536] transition"
                                        >
                                            <div className="flex-1 flex flex-col gap-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                                                        {item.tenSanPham || 'Sản phẩm'}
                                                    </h3>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-400 hover:text-red-300 flex items-center px-2 py-1 rounded transition"
                                                        disabled={loading}
                                                        title="Xóa sản phẩm"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                                {renderStatusIndicator(item.soLuongTon)}
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-blue-400 font-bold text-xl">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </span>
                                                    <div className="flex items-center border border-[#243447] rounded-lg bg-[#1b2a3b] overflow-hidden">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                            className="px-3 py-1 text-gray-300 hover:bg-[#243447] text-lg"
                                                            disabled={loading}
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </button>
                                                        <span className="px-4 py-1 text-white font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                            className="px-3 py-1 text-gray-300 hover:bg-[#243447] text-lg"
                                                            disabled={loading || (typeof item.soLuongTon === 'number' && item.quantity >= item.soLuongTon)}
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="lg:w-1/4">
                            <div className="bg-[#182233] rounded-2xl shadow-lg p-6 sticky top-20 border border-[#243447]">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <i className="fas fa-calculator text-blue-400"></i>
                                    Tổng giỏ hàng
                                </h2>
                                <div className="mb-6">
                                    <label className="block text-gray-300 mb-2 font-medium">Chọn khuyến mãi</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-[#1b2a3b] text-white border border-[#243447] rounded-lg py-3 px-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                            onChange={(e) => {
                                                const selected = promotions.find(p => p.id === e.target.value);
                                                handlePromotionChange(selected || null);
                                            }}
                                            value={selectedPromotion?.id || ''}
                                        >
                                            <option value="">Không áp dụng khuyến mãi</option>
                                            {promotions.map((promotion) => (
                                                <option key={promotion.id} value={promotion.id}>
                                                    {promotion.tenKhuyenMai} ({promotion.phanTramGiam}% giảm)
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                            <i className="fas fa-chevron-down"></i>
                                        </div>
                                    </div>
                                    {selectedPromotion && (
                                        <div className="mt-2 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                                            <div className="flex items-center text-green-400">
                                                <i className="fas fa-tag mr-2"></i>
                                                <span>Đã áp dụng khuyến mãi: {selectedPromotion.tenKhuyenMai}</span>
                                            </div>
                                            <div className="text-green-300 text-sm mt-1">
                                                Giảm {selectedPromotion.phanTramGiam}% tổng giá trị đơn hàng
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-[#243447] pb-4">
                                        <span className="text-gray-300">Tạm tính</span>
                                        <span className="text-gray-100 font-medium">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                        </span>
                                    </div>
                                    {selectedPromotion && (
                                        <div className="flex justify-between border-b border-[#243447] pb-4 bg-green-900/20 -mx-6 px-6">
                                            <span className="text-gray-300">Giảm giá ({selectedPromotion.phanTramGiam}%)</span>
                                            <span className="text-green-400 font-medium">
                                                -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount || 0)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-b border-[#243447] pb-4">
                                        <span className="text-gray-300">Phí vận chuyển</span>
                                        <span className="text-gray-100 font-medium">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(30000)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg pt-2">
                                        <span className="text-white">Tổng cộng</span>
                                        <div className="text-right">
                                            <span className="text-blue-400 text-xl">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.max(0, totalPrice - (discountAmount || 0) + 30000))}
                                            </span>
                                            {selectedPromotion && discountAmount > 0 && (
                                                <div className="text-sm text-green-400 mt-1">
                                                    Tiết kiệm: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-[#243447]">
                                        <h3 className="text-lg font-semibold text-white mb-4">Phương thức thanh toán</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="cod"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={paymentMethod === 'cod'}
                                                    onChange={() => setPaymentMethod('cod')}
                                                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="cod" className="ml-2 text-gray-300">
                                                    Thanh toán khi nhận hàng (COD)
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id="vnpay"
                                                    name="paymentMethod"
                                                    value="vnpay"
                                                    checked={paymentMethod === 'vnpay'}
                                                    onChange={() => setPaymentMethod('vnpay')}
                                                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="vnpay" className="ml-2 text-gray-300">
                                                    Thanh toán qua VNPAY
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={loading || cartItems.length === 0}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                                                Đang xử lý...
                                            </div>
                                        ) : (
                                            <>
                                                <i className="fas fa-credit-card"></i>
                                                <span>Thanh toán ngay</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
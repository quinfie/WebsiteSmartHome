import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDonHangById, cancelUserOrder } from '../../api/donhang';
import { getKhuyenMaiById, getAllPromotions } from '../../api/khuyenmai';
import { ViewResponseCreateDonHangDto } from '../../types/donhang';
import { KhuyenMaiDto } from '../../types/khuyenmai';
import { toast } from 'react-toastify';
import { sanPhamService } from '../../api/sanpham';
import { SanPhamResponseDto } from '../../types/sanpham';
import { getImagePath, handleImageError } from '../../utils/imageUtils';
import SuggestedProducts from '../../components/ecommerce/SuggestedProducts';

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<ViewResponseCreateDonHangDto | null>(null);
    const [khuyenMai, setKhuyenMai] = useState<KhuyenMaiDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [suggestedProducts, setSuggestedProducts] = useState<SanPhamResponseDto[]>([]);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
            fetchSuggestedProducts(id);
        } else {
            console.error('OrderDetail: No order ID provided in URL parameters');
            setError('Không tìm thấy mã đơn hàng');
            setLoading(false);
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await getDonHangById(id!);

            if (!data || !data.data) {
                console.error('OrderDetail: No data returned from API for order:', id);
                setError('Đơn hàng không tồn tại');
                setTimeout(() => navigate('/ecommerce/orders'), 3000);
                return;
            }

            setOrder(data.data);

            // Fetch promotion details if exists
            if (data.data.maKhuyenMai) {
                try {
                    const khuyenMaiData = await getKhuyenMaiById(data.data.maKhuyenMai);

                    if (khuyenMaiData && khuyenMaiData.phanTramGiam !== undefined) {
                        setKhuyenMai(khuyenMaiData);
                    } else {
                        console.error('Invalid promotion data:', khuyenMaiData);
                    }
                } catch (err) {
                    console.error('Error fetching promotion details:', err);
                }
            }
        } catch (err: any) {
            console.error('OrderDetail: Error fetching order details:', err);
            setError(err.message || 'Không thể tải thông tin đơn hàng');

            if (err?.response?.status === 404) {
                toast.error('Đơn hàng không tồn tại, bạn sẽ được chuyển về danh sách đơn hàng');
                setTimeout(() => navigate('/ecommerce/orders'), 3000);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestedProducts = async (orderId: string) => {
        try {
            const data = await sanPhamService.getSuggestedProductsByOrder(orderId);
            if (data && data.items) {
                setSuggestedProducts(data.items);
            } else {
                setSuggestedProducts([]);
            }
        } catch (err) {
            console.error('Error fetching suggested products:', err);
            setSuggestedProducts([]);
        }
    };

    const handleCancelOrder = async () => {
        if (!id) return;

        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
            if (!confirmed) return;

            await cancelUserOrder(id);
            toast.success('Hủy đơn hàng thành công');
            fetchOrderDetails(); // Refresh the order details
        } catch (err: any) {
            console.error('Error canceling order:', err);
            toast.error(err.message || 'Không thể hủy đơn hàng. Vui lòng thử lại sau.');
        }
    };

    // Get status badge class and text color based on order status
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'Đã giao hàng':
                return {
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-300',
                    icon: 'fas fa-check-circle text-green-500'
                };
            case 'Đang xử lý':
                return {
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    borderColor: 'border-yellow-300',
                    icon: 'fas fa-spinner fa-spin text-yellow-500'
                };
            case 'Đang vận chuyển':
                return {
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-300',
                    icon: 'fas fa-shipping-fast text-blue-500'
                };
            case 'Đã hủy':
                return {
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800',
                    borderColor: 'border-red-300',
                    icon: 'fas fa-times-circle text-red-500'
                };
            default:
                return {
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-300',
                    icon: 'fas fa-question-circle text-gray-500'
                };
        }
    };

    // Format date to display in a more user-friendly way
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    // Tính tổng tiền trước giảm giá từ chi tiết đơn hàng
    const calculateTotalBeforeDiscount = (order: ViewResponseCreateDonHangDto) => {
        if (!order.chiTietDonHangs || order.chiTietDonHangs.length === 0) {
            return 0;
        }
        return order.chiTietDonHangs.reduce((total, item) => total + item.donGia * item.soLuong, 0);
    };

    // Tính số tiền giảm
    const calculateDiscount = (order: ViewResponseCreateDonHangDto) => {
        if (!khuyenMai || !khuyenMai.phanTramGiam) {
            return 0;
        }

        const totalBeforeDiscount = calculateTotalBeforeDiscount(order);
        const discount = (totalBeforeDiscount * khuyenMai.phanTramGiam) / 100;
        // Làm tròn đến 0 chữ số thập phân cho tiền tệ
        return Math.round(discount);
    };

    // Tính tổng tiền sau giảm
    const calculateTotalAfterDiscount = (order: ViewResponseCreateDonHangDto) => {
        const totalBeforeDiscount = calculateTotalBeforeDiscount(order);
        const discount = calculateDiscount(order);
        return totalBeforeDiscount - discount;
    };

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center mb-8">
                        <button
                            onClick={() => navigate('/ecommerce/orders')}
                            className="text-gray-400 hover:text-white transition-colors mr-4"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h1 className="text-3xl font-bold text-white">Chi tiết đơn hàng</h1>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                            <p className="text-blue-400">Đang tải dữ liệu...</p>
                        </div>
                    ) : !order ? (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg p-10 text-center border border-white/10">
                            <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-exclamation-triangle text-red-400 text-3xl"></i>
                            </div>
                            <h2 className="text-2xl font-medium text-white mb-3">Không tìm thấy đơn hàng</h2>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                            <button
                                onClick={() => navigate('/ecommerce/orders')}
                                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200"
                            >
                                Quay lại danh sách đơn hàng
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Order Header */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/10">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex items-center mb-4 lg:mb-0">
                                            <div className="mr-4 bg-blue-500/20 w-14 h-14 rounded-full flex items-center justify-center">
                                                <i className="fas fa-shopping-bag text-blue-400 text-xl"></i>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-1">
                                                    Đơn hàng #{order?.id?.slice(0, 8).toUpperCase() ?? 'N/A'}
                                                </h2>
                                                <p className="text-gray-400">
                                                    <i className="far fa-calendar-alt mr-1"></i> {formatDate(order.ngayDat)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start lg:items-end">
                                            <div className={`flex items-center px-4 py-2 rounded-full border ${getStatusInfo(order.trangThaiDonHang).bgColor} ${getStatusInfo(order.trangThaiDonHang).textColor} ${getStatusInfo(order.trangThaiDonHang).borderColor} mb-2`}>
                                                <i className={`${getStatusInfo(order.trangThaiDonHang).icon} mr-2`}></i>
                                                <span className="font-medium">{order.trangThaiDonHang}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/10">
                                        <i className="fas fa-user mr-2 text-blue-400"></i> Thông tin đơn hàng
                                    </h3>
                                    <dl className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <dt className="text-gray-400">Người nhận:</dt>
                                            <dd className="text-white font-medium">{order.tenNguoiDung}</dd>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <dt className="text-gray-400">Ngày đặt hàng:</dt>
                                            <dd className="text-white">{formatDate(order.ngayDat)}</dd>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <dt className="text-gray-400">Tên khuyến mãi:</dt>
                                            <dd className="text-white">{order.tenKhuyenMai || 'Không có'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/10">
                                        <i className="fas fa-money-bill-wave mr-2 text-green-400"></i> Thông tin thanh toán
                                    </h3>
                                    <dl className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <dt className="text-gray-400">Tổng tiền trước giảm:</dt>
                                            <dd className="text-white font-medium">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotalBeforeDiscount(order))}
                                            </dd>
                                        </div>
                                        {khuyenMai && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <dt className="text-gray-400">Khuyến mãi áp dụng:</dt>
                                                    <dd className="text-green-400 font-medium">
                                                        {order.tenKhuyenMai} (Giảm {khuyenMai.phanTramGiam}%)
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <dt className="text-gray-400">Số tiền giảm:</dt>
                                                    <dd className="text-green-400 font-medium">
                                                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateDiscount(order))}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <dt className="text-gray-400">Tổng tiền sau giảm:</dt>
                                                    <dd className="text-green-400 font-medium">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotalAfterDiscount(order))}
                                                    </dd>
                                                </div>
                                            </>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <dt className="text-gray-400">Phí vận chuyển:</dt>
                                            <dd className="text-white font-medium">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.phiVanChuyen || 30000)}
                                            </dd>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                                            <dt className="text-gray-400">Tổng thanh toán:</dt>
                                            <dd className="text-blue-400 font-bold">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                    calculateTotalAfterDiscount(order) + (order.phiVanChuyen || 30000)
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Order Products */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 overflow-hidden">
                                <div className="p-6 border-b border-white/10">
                                    <h3 className="text-lg font-semibold text-white">
                                        <i className="fas fa-box mr-2 text-blue-400"></i> Chi tiết sản phẩm
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-full divide-y divide-white/10">
                                        <thead className="bg-white/5">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Đơn giá</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Số lượng</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {order.chiTietDonHangs?.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-white">{item.tenSanPham}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.donGia)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                                                        {item.soLuong}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-400">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.donGia * item.soLuong)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-white/5">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400" colSpan={2}></th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400">Tổng cộng:</th>
                                                <th className="px-6 py-3 text-right text-sm font-bold text-blue-400">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotalBeforeDiscount(order))}
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Suggested Products */}
                            {suggestedProducts.length > 0 && (
                                <SuggestedProducts
                                    title="Sản phẩm gợi ý"
                                    products={suggestedProducts}
                                    icon="gift"
                                />
                            )}

                            {/* Action buttons */}
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => navigate('/ecommerce/orders')}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
                                >
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    Quay lại
                                </button>

                                {order.trangThaiDonHang === 'Chờ xác nhận' && (
                                    <button
                                        onClick={handleCancelOrder}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
                                    >
                                        <i className="fas fa-times mr-2"></i>
                                        Hủy đơn hàng
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
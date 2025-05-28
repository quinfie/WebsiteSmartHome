import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { paymentApi } from '../../api/payment';
import { updateDonHang, getDonHangById } from '../../api/donhang'; // Import necessary donhang API functions
import { ViewResponseCreateDonHangDto } from '../../types/donhang'; // Import the order detail DTO

export default function Checkout() {
    const { id: orderId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
    const [orderDetail, setOrderDetail] = useState<ViewResponseCreateDonHangDto | null>(null);
    const [loadingOrder, setLoadingOrder] = useState(true);

    // Fetch order details when the component mounts or orderId changes
    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!orderId) return;
            setLoadingOrder(true);
            try {
                const response = await getDonHangById(orderId);
                if (response.success && response.data) {
                    setOrderDetail(response.data);
                } else {
                    toast.error(response.message || 'Không thể tải chi tiết đơn hàng.');
                }
            } catch (error: any) {
                console.error('Error fetching order detail:', error);
                toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tải chi tiết đơn hàng.');
            } finally {
                setLoadingOrder(false);
            }
        };
        fetchOrderDetail();
    }, [orderId]);

    const handleVNPayPayment = async () => {
        if (!orderId || !orderDetail) {
            toast.error('Không tìm thấy thông tin đơn hàng.');
            return;
        }

        try {
            // Cập nhật trạng thái đơn hàng trước khi chuyển sang VNPAY
            const updateData = {
                trangThaiDonHang: 'Chờ xác nhận',
                phuongThucThanhToan: 'VNPAY',
                maKhuyenMai: orderDetail.maKhuyenMai,
                chiTietDonHangs: orderDetail.chiTietDonHangs?.map(item => ({
                    maSanPham: item.maSanPham,
                    soLuongMua: item.soLuong,
                    donGiaMua: item.donGia
                })) || []
            };

            // Cập nhật trạng thái đơn hàng
            const updateResponse = await updateDonHang(orderId, updateData);
            if (!updateResponse.success) {
                throw new Error('Không thể cập nhật trạng thái đơn hàng');
            }

            // Tạo URL thanh toán VNPAY
            const response = await paymentApi.createVNPayPayment({
                orderType: "other",
                amount: orderDetail.tongTien,
                orderDescription: `Thanh toán đơn hàng ${orderId}`,
                name: "Khách hàng"
            });

            if (response.success && response.data && response.data.paymentUrl) {
                // Chuyển hướng đến trang thanh toán VNPAY
                window.location.href = response.data.paymentUrl;
            } else {
                throw new Error('Không thể tạo URL thanh toán');
            }
        } catch (error: any) {
            console.error('Error in VNPAY payment process:', error);
            toast.error(error.message || 'Đã có lỗi xảy ra trong quá trình thanh toán');
        }
    };

    const handlePlaceOrder = async () => {
        if (!orderId) {
            toast.error('Không tìm thấy ID đơn hàng.');
            return;
        }

        if (loadingOrder || !orderDetail) {
            toast('Đang tải chi tiết đơn hàng, vui lòng đợi...');
            return;
        }

        if (paymentMethod === 'vnpay') {
            await handleVNPayPayment();
        } else {
            try {
                const updateData = {
                    trangThaiDonHang: 'Chờ xác nhận',
                    phuongThucThanhToan: 'COD',
                    maKhuyenMai: orderDetail.maKhuyenMai,
                    chiTietDonHangs: orderDetail.chiTietDonHangs?.map(item => ({
                        maSanPham: item.maSanPham,
                        soLuongMua: item.soLuong,
                        donGiaMua: item.donGia
                    })) || []
                };

                const response = await updateDonHang(orderId, updateData);

                if (response.success) {
                    toast.success('Đặt hàng thành công!');
                    navigate('/ecommerce/orders');
                } else {
                    toast.error(response.message || 'Không thể đặt hàng COD. Vui lòng thử lại sau.');
                }
            } catch (error: any) {
                console.error('Error placing COD order:', error);
                toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng COD.');
            }
        }
    };

    // Show loading state while fetching order details
    if (loadingOrder) {
        return (
            <div className="container mx-auto px-4 py-8 text-white text-center">
                Đang tải đơn hàng...
            </div>
        );
    }

    // Show error or empty state if order details not loaded
    if (!orderDetail) {
        return (
            <div className="container mx-auto px-4 py-8 text-white text-center">
                Không tìm thấy chi tiết đơn hàng hoặc đã xảy ra lỗi.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ... existing checkout UI ... */}

            <div className="mb-6">
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
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                disabled={loadingOrder} // Disable button while loading
            >
                {loadingOrder ? 'Đang tải...' : (paymentMethod === 'vnpay' ? 'Thanh toán qua VNPAY' : 'Đặt hàng')}
            </button>
        </div>
    );
} 
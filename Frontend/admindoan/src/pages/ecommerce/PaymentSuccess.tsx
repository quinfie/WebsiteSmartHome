import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ViewResponseCreateDonHangDto } from '../../types/donhang';
import { getDonHangById } from '../../api/donhang'
import { toast } from 'react-hot-toast';

export default function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState<ViewResponseCreateDonHangDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const orderId = searchParams.get('orderId');

        if (orderId) {
            getDonHangById(orderId)
                .then(response => {
                    if (response.success && response.data) {
                        setOrder(response.data);
                    } else {
                        toast.error(response.message || 'Không thể tải chi tiết đơn hàng.');
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching order:', error);
                    toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tải chi tiết đơn hàng.');
                    setLoading(false);
                });
        } else {
            toast.error('Không tìm thấy ID đơn hàng trong URL.');
            setLoading(false);
        }
    }, [location, navigate]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-white text-center">
                Không tìm thấy chi tiết đơn hàng hoặc đã xảy ra lỗi khi tải.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-[#182233] rounded-lg shadow-md p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Thanh toán thành công!</h2>
                    <p className="text-gray-300 mb-6">
                        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.
                    </p>
                </div>

                {
                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Thông tin đơn hàng</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Mã đơn hàng:</span>
                                <span className="text-white">{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Tổng tiền:</span>
                                <span className="text-white">{new Intl.NumberFormat('vi-VN').format(order.tongTien)} đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Trạng thái:</span>
                                <span className="text-green-400">{order.trangThaiDonHang}</span>
                            </div>
                        </div>
                    </div>
                }

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/ecommerce/orders')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Xem đơn hàng của tôi
                    </button>
                </div>
            </div>
        </div>
    );
} 
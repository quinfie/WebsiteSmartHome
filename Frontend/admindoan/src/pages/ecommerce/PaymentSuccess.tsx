import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateDonHang, getDonHangById } from '../../api/donhang';
import { toast } from 'react-hot-toast';
import { HiOutlineShoppingBag, HiOutlineCash, HiOutlineClock, HiOutlineHome, HiOutlineReceiptTax } from 'react-icons/hi';
import { ViewResponseCreateDonHangDto } from '../../types/donhang';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orderInfo, setOrderInfo] = useState({
        transactionId: '',
        amount: '',
        bankCode: '',
        payDate: ''
    });

    useEffect(() => {
        const processSuccessfulPayment = async () => {
            const vnp_OrderInfo = searchParams.get('vnp_OrderInfo') || '';
            const vnp_TransactionId = searchParams.get('vnp_TransactionNo');
            const vnp_BankCode = searchParams.get('vnp_BankCode');
            const vnp_PayDate = searchParams.get('vnp_PayDate');
            const vnp_Amount = searchParams.get('vnp_Amount');

            // Lấy orderId (GUID) từ vnp_OrderInfo
            const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
            const match = vnp_OrderInfo.match(guidRegex);
            const orderId = match ? match[0] : null;

            if (!orderId) {
                toast.error('Không tìm thấy mã đơn hàng hợp lệ');
                navigate('/ecommerce/payment-failed', { replace: true });
                return;
            }

            console.log('OrderId extracted:', orderId);

            setOrderInfo({
                transactionId: vnp_TransactionId || '',
                amount: vnp_Amount ? `${Number(vnp_Amount) / 100} VNĐ` : '',
                bankCode: vnp_BankCode || '',
                payDate: vnp_PayDate || ''
            });

            try {
                // Lấy thông tin đơn hàng hiện tại
                const orderResponse = await getDonHangById(orderId);
                if (!orderResponse.success) {
                    throw new Error('Không thể lấy thông tin đơn hàng');
                }

                const orderDetail: ViewResponseCreateDonHangDto = orderResponse.data;

                // Cập nhật trạng thái đơn hàng
                const updateData = {
                    trangThaiDonHang: 'Đã xác nhận',
                    phuongThucThanhToan: 'VNPAY',
                    daThanhToan: true,
                    maKhuyenMai: orderDetail.maKhuyenMai,
                    chiTietDonHangs: orderDetail.chiTietDonHangs?.map(item => ({
                        maSanPham: item.maSanPham,
                        soLuongMua: item.soLuong,
                        donGiaMua: item.donGia
                    })) || []
                };

                console.log('Cập nhật đơn hàng với ID:', orderId);

                try {
                    const response = await updateDonHang(orderId, updateData);
                    if (response.success) {
                        toast.success('Đơn hàng đã được xác nhận và thanh toán thành công!');
                        setLoading(false);
                    } else {
                        throw new Error('Không thể cập nhật trạng thái đơn hàng');
                    }
                } catch (updateError: any) {
                    // Kiểm tra nếu lỗi là do optimistic concurrency
                    if (updateError.message.includes('optimistic concurrency')) {
                        // Đơn hàng có thể đã được cập nhật trước đó
                        toast.success('Đơn hàng đã được xác nhận trước đó!');
                        setLoading(false);
                    } else {
                        throw updateError;
                    }
                }
            } catch (error) {
                console.error('Error processing payment:', error);
                toast.error('Có lỗi xảy ra khi xử lý thanh toán');
                navigate('/ecommerce/payment-failed', { replace: true });
            }
        };

        processSuccessfulPayment();
    }, [searchParams, navigate]);

    const handleViewOrder = () => {
        navigate('/ecommerce/orders');
    };

    const handleGoHome = () => {
        navigate('/ecommerce');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-white">Đang xử lý thanh toán...</p>
                    </div>
                ) : (
                    <div className="bg-[#182233] rounded-2xl shadow-xl overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                            <div className="flex items-center justify-center">
                                <div className="bg-white/20 rounded-full p-3">
                                    <HiOutlineShoppingBag className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h1 className="mt-4 text-2xl font-bold text-center text-white">
                                Thanh toán thành công!
                            </h1>
                            <p className="mt-2 text-center text-blue-100">
                                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
                            </p>
                        </div>

                        {/* Payment Details */}
                        <div className="px-8 py-6">
                            <div className="space-y-6">
                                {/* Transaction ID */}
                                <div className="flex items-center p-4 bg-[#1e293b] rounded-lg">
                                    <HiOutlineReceiptTax className="h-6 w-6 text-blue-400" />
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-400">Mã giao dịch</p>
                                        <p className="text-white font-medium">{orderInfo.transactionId}</p>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="flex items-center p-4 bg-[#1e293b] rounded-lg">
                                    <HiOutlineCash className="h-6 w-6 text-green-400" />
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-400">Số tiền thanh toán</p>
                                        <p className="text-white font-medium">{orderInfo.amount}</p>
                                    </div>
                                </div>

                                {/* Bank */}
                                <div className="flex items-center p-4 bg-[#1e293b] rounded-lg">
                                    <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-400">Ngân hàng</p>
                                        <p className="text-white font-medium">{orderInfo.bankCode}</p>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="flex items-center p-4 bg-[#1e293b] rounded-lg">
                                    <HiOutlineClock className="h-6 w-6 text-yellow-400" />
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-400">Thời gian thanh toán</p>
                                        <p className="text-white font-medium">{orderInfo.payDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleViewOrder}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <HiOutlineShoppingBag className="h-5 w-5" />
                                    Xem đơn hàng
                                </button>
                                <button
                                    onClick={handleGoHome}
                                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <HiOutlineHome className="h-5 w-5" />
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
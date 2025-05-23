import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDonHangById } from '../../api/donhang';
import { ViewResponseCreateDonHangDto } from '../../types/donhang';
import { toast } from 'react-hot-toast';
import { BaseResponse } from '../../types/common';

interface VNPayResponseMapping {
    [key: string]: string;
}

const vnpayResponseMessages: VNPayResponseMapping = {
    "00": "Giao dịch thành công.", // Should not appear on failed page, but good to have
    "01": "Giao dịch không thành công do: Ngân hàng phát hành thẻ (Issuing Bank) từ chối thanh toán.",
    "02": "Giao dịch không thành công do: Một số trường (ví dụ: số thẻ, ngày hết hạn, CVV) không đúng định dạng.",
    "03": "Giao dịch không thành công do: Thẻ hết hạn hoặc bị khóa.",
    "04": "Giao dịch không thành công do: Thẻ chưa được đăng ký dịch vụ thanh toán trực tuyến.",
    "05": "Giao dịch không thành công do: Mật khẩu OTP không đúng.",
    "06": "Giao dịch không thành công do: Mã merchant không tồn tại hoặc chưa được kích hoạt.",
    "07": "Giao dịch không thành công do: Chuỗi kiểm tra (checksum) không khớp.",
    "08": "Giao dịch không thành công do: Số tiền vượt quá giới hạn cho phép.",
    "09": "Giao dịch không thành công do: Sai loại giao dịch hoặc mã giao dịch.",
    "10": "Giao dịch không thành công do: Lỗi hệ thống ngân hàng.",
    "11": "Giao dịch không thành công do: Sai số thẻ hoặc tài khoản.",
    "12": "Giao dịch không thành công do: Thẻ bị khóa.",
    "13": "Giao dịch không thành công do: Sai ngày hết hạn thẻ.",
    "24": "Giao dịch không thành công do: Giao dịch bị hủy.",
    "51": "Giao dịch không thành công do: Tài khoản không đủ số dư.",
    "65": "Giao dịch không thành công do: Vượt quá số lần xác thực (OTP).",
    "75": "Giao dịch không thành công do: Ngân hàng đang bảo trì.",
    "79": "Giao dịch không thành công do: Sai mật khẩu thanh toán trực tuyến (e-wallet).",
    "A0": "Giao dịch không thành công do: Lỗi đường truyền hoặc kết nối.",
    "A1": "Giao dịch không thành công do: Lỗi kết nối với ngân hàng.",
    "A2": "Giao dịch không thành công do: Lỗi xử lý dữ liệu.",
    "A3": "Giao dịch không thành công do: Lỗi cấu hình.",
    "A4": "Giao dịch không thành công do: Lỗi không xác định."
    // Add more codes if needed
};

export default function PaymentFailed() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('vnp_TxnRef');
    const responseCode = searchParams.get('vnp_ResponseCode');
    const errorMessage = searchParams.get('vnp_OrderInfo');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');
    const failReason = searchParams.get('vnp_OrderInfo') || 'Giao dịch không thành công';
    const bankCode = searchParams.get('vnp_BankCode');
    const payDate = searchParams.get('vnp_PayDate');
    const transactionNo = searchParams.get('vnp_TransactionNo');
    const amount = searchParams.get('vnp_Amount');

    const [order, setOrder] = useState<ViewResponseCreateDonHangDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        } else {
            setError("Không tìm thấy mã đơn hàng.");
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetails = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: BaseResponse<ViewResponseCreateDonHangDto> = await getDonHangById(id);
            if (response.success && response.data) {
                setOrder(response.data);
            } else {
                setError(response.message || "Không thể tải chi tiết đơn hàng.");
                setOrder(null);
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải chi tiết đơn hàng.");
            setOrder(null);
            console.error("Error fetching order details:", err);
        } finally {
            setLoading(false);
        }
    };

    const getDisplayMessage = (code: string | null): string => {
        if (!code) return "Giao dịch không thành công, không rõ nguyên nhân.";
        return vnpayResponseMessages[code] || `Giao dịch không thành công (Mã lỗi: ${code}).`;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // Show error state if order not loaded after trying
    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-white text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-[#182233] rounded-lg shadow-md p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Thanh toán thất bại</h2>
                    <p className="text-gray-300 mb-6">
                        {getDisplayMessage(responseCode)}
                    </p>
                    {failReason && failReason !== 'Giao dịch không thành công' && (
                        <p className="text-sm text-gray-500 mt-1">Chi tiết: {failReason}</p>
                    )}
                    {bankCode && (
                        <p className="text-sm text-gray-500 mt-1">Ngân hàng: {bankCode}</p>
                    )}
                    {transactionNo && (
                        <p className="text-sm text-gray-500 mt-1">Mã giao dịch VNPAY: {transactionNo}</p>
                    )}
                    {payDate && (
                        <p className="text-sm text-gray-500 mt-1">Thời gian: {new Date(payDate.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')).toLocaleString()}</p>
                    )}
                    {amount && (
                        <p className="text-sm text-gray-500 mt-1">Số tiền: {(parseInt(amount, 10) / 100).toLocaleString('vi-VN')} VND</p>
                    )}
                </div>

                {order && (
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
                                <span className="text-red-400">{order.trangThaiDonHang}</span>
                            </div>
                            {/* Add more order details here if needed */}
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center space-x-4">
                    {orderId && (
                        <button
                            onClick={() => navigate(`/ecommerce/checkout/${orderId}`)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Thử lại thanh toán
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/ecommerce/orders')}
                        className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Xem đơn hàng của tôi
                    </button>
                    {/* Optionally add a button to go back to cart if orderId is not available */}
                    {!orderId && (
                        <button
                            onClick={() => navigate('/ecommerce/cart')}
                            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Quay lại giỏ hàng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 
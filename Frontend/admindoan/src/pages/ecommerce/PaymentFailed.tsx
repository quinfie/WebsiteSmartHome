import { useNavigate, useSearchParams } from 'react-router-dom';

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
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_Message = searchParams.get('vnp_OrderInfo');

    const handleGoHome = () => {
        navigate('/ecommerce');
    };

    const handleRetryPayment = () => {
        navigate('/ecommerce/cart');
    };

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8 flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="bg-[#182233] rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto border border-[#243447]">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-times text-2xl text-red-500"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Thanh toán thất bại</h3>
                        <p className="text-gray-400 mb-4">
                            {vnp_Message || 'Đã xảy ra lỗi trong quá trình thanh toán'}
                        </p>
                        {vnp_ResponseCode && (
                            <p className="text-red-400 text-sm mb-6">
                                Mã lỗi: {vnp_ResponseCode}
                            </p>
                        )}
                        <div className="flex gap-4">
                            <button
                                onClick={handleRetryPayment}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={handleGoHome}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
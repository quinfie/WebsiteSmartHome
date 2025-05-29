import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

        // Chuyển hướng dựa vào mã phản hồi
        if (vnp_ResponseCode === '00') {
            // Thanh toán thành công
            navigate('/ecommerce/payment-success' + window.location.search, { replace: true });
        } else {
            // Thanh toán thất bại
            navigate('/ecommerce/payment-failed' + window.location.search, { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8 flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="bg-[#182233] rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto border border-[#243447]">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                        <h3 className="text-xl font-semibold text-white mb-2">Đang xử lý kết quả thanh toán</h3>
                        <p className="text-gray-400 text-center">Vui lòng đợi...</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
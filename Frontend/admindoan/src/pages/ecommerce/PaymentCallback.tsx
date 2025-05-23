import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState('processing'); // processing, success, error
    const [orderId, setOrderId] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // Assume VNPAY returns status and other info in query params
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_OrderId = searchParams.get('vnp_TxnRef'); // Assuming TxnRef is OrderId
        const vnp_TransactionId = searchParams.get('vnp_TransactionNo');
        const vnp_Message = searchParams.get('vnp_Message');

        if (vnp_ResponseCode === '00') {
            setStatus('success');
            setOrderId(vnp_OrderId);
            setTransactionId(vnp_TransactionId);
            setMessage('Thanh toán thành công!');
        } else {
            setStatus('error');
            setOrderId(vnp_OrderId);
            setTransactionId(vnp_TransactionId);
            // You might want to map specific error codes to user-friendly messages
            setMessage(`Thanh toán thất bại. Mã lỗi: ${vnp_ResponseCode || 'N/A'} ${vnp_Message ? ` - ${vnp_Message}` : ''}`);
        }

        // Optional: You might want to verify the transaction server-side here
        // before showing success. This requires an API call to your backend.

    }, [searchParams]);

    const handleGoHome = () => {
        navigate('/ecommerce');
    };

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8 flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="bg-[#182233] rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto border border-[#243447]">

                    {status === 'processing' && (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                            <h3 className="text-xl font-semibold text-white mb-2">Đang xử lý kết quả thanh toán</h3>
                            <p className="text-gray-400 text-center">Vui lòng đợi...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-check text-2xl text-green-500"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
                            {orderId && <p className="text-gray-400 text-center">Mã đơn hàng: {orderId}</p>}\
                            {transactionId && <p className="text-gray-400 text-center">Mã giao dịch VNPAY: {transactionId}</p>}\
                            <button
                                onClick={handleGoHome}
                                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-times text-2xl text-red-500"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
                            {orderId && <p className="text-gray-400 text-center">Mã đơn hàng: {orderId}</p>}\
                            {transactionId && <p className="text-gray-400 text-center">Mã giao dịch VNPAY: {transactionId}</p>}\
                            <button
                                onClick={handleGoHome}
                                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getImagePath } from '../../utils/imageUtils';
import { getDonHangById } from '../../api/donhang';
import { getKhuyenMaiById } from '../../api/khuyenmai';
import { ViewResponseCreateDonHangDto } from '../../types/donhang';
import { KhuyenMaiDto } from '../../types/khuyenmai';
import { toast } from 'react-hot-toast';

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('orderId');
    const [orderDetails, setOrderDetails] = useState<ViewResponseCreateDonHangDto | null>(null);
    const [khuyenMai, setKhuyenMai] = useState<KhuyenMaiDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                console.error('No orderId found in URL parameters');
                setError('Không tìm thấy mã đơn hàng');
                setLoading(false);
                return;
            }

            try {
                const data = await getDonHangById(orderId);

                if (!data) {
                    console.error('No data returned from API for order:', orderId);
                    setError('Không tìm thấy thông tin đơn hàng');
                    setTimeout(() => navigate('/ecommerce/cart'), 3000);
                } else {
                    setOrderDetails(data);

                    // Fetch promotion details if exists
                    if (data.maKhuyenMai) {
                        try {
                            const khuyenMaiData = await getKhuyenMaiById(data.maKhuyenMai);
                            setKhuyenMai(khuyenMaiData);
                        } catch (err) {
                            console.error('Error fetching promotion details:', err);
                        }
                    }
                }
            } catch (err: any) {
                console.error('Error fetching order details:', {
                    orderId,
                    error: err,
                    message: err.message,
                    response: err.response?.data
                });
                setError(err.message || 'Không thể tải thông tin đơn hàng');
                setTimeout(() => navigate('/ecommerce/cart'), 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    const calculateDiscount = (orderDetails: ViewResponseCreateDonHangDto) => {
        if (!khuyenMai || !khuyenMai.phanTramGiam) {
            return 0;
        }
        const totalBeforeDiscount = orderDetails.tongTien;
        return Math.round((totalBeforeDiscount * khuyenMai.phanTramGiam) / 100);
    };

    const calculateTotalAfterDiscount = (orderDetails: ViewResponseCreateDonHangDto) => {
        const discount = calculateDiscount(orderDetails);
        return orderDetails.tongTien - discount;
    };

    if (loading) {
        return (
            <div className="bg-[#0f172a] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#0f172a] min-h-screen py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-[#182233] rounded-lg shadow-lg p-8 border border-[#243447] text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Đã xảy ra lỗi</h1>
                        <p className="text-red-400 mb-6">{error}</p>
                        <Link
                            to="/ecommerce/cart"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out"
                        >
                            Quay lại giỏ hàng
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0f172a] min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-[#182233] rounded-lg shadow-lg p-8 border border-[#243447]">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Đặt hàng thành công!</h1>
                        <p className="text-gray-300 text-lg">
                            Cảm ơn bạn đã mua sắm với Smart Home
                        </p>
                        {orderId && (
                            <p className="text-blue-400 mt-2">
                                Mã đơn hàng: <span className="font-semibold">{orderId}</span>
                            </p>
                        )}
                    </div>

                    <div className="border-t border-b border-[#243447] py-6 mb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Thông tin đơn hàng</h2>
                        {orderDetails ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Tổng tiền hàng:</span>
                                    <span className="text-white font-medium">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.tongTien)}
                                    </span>
                                </div>

                                {orderDetails.tenKhuyenMai && khuyenMai && (
                                    <>
                                        <div className="flex justify-between items-center bg-green-900/20 -mx-6 px-6 py-2">
                                            <span className="text-green-400">Khuyến mãi áp dụng:</span>
                                            <span className="text-green-400 font-medium">
                                                {orderDetails.tenKhuyenMai} (Giảm {khuyenMai.phanTramGiam}%)
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center bg-green-900/10 -mx-6 px-6 py-2">
                                            <span className="text-green-400">Số tiền giảm:</span>
                                            <span className="text-green-400 font-medium">
                                                -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateDiscount(orderDetails))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center bg-green-900/10 -mx-6 px-6 py-2">
                                            <span className="text-green-400">Tổng tiền sau giảm:</span>
                                            <span className="text-green-400 font-medium">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotalAfterDiscount(orderDetails))}
                                            </span>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Phí vận chuyển:</span>
                                    <span className="text-white font-medium">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.phiVanChuyen || 30000)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-[#243447]">
                                    <span className="text-white font-medium">Tổng thanh toán:</span>
                                    <span className="text-blue-400 text-xl font-bold">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                            calculateTotalAfterDiscount(orderDetails) + (orderDetails.phiVanChuyen || 30000)
                                        )}
                                    </span>
                                </div>

                                {orderDetails.chiTietDonHangs && orderDetails.chiTietDonHangs.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-white font-medium mb-3">Chi tiết sản phẩm:</h3>
                                        <div className="space-y-3">
                                            {orderDetails.chiTietDonHangs.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center bg-[#1b2a3b] p-3 rounded">
                                                    <div>
                                                        <p className="text-white">{item.tenSanPham}</p>
                                                        <p className="text-gray-400 text-sm">Số lượng: {item.soLuong}</p>
                                                    </div>
                                                    <span className="text-blue-400">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.donGia * item.soLuong)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <p className="text-gray-300 mt-6">
                                    Đơn hàng của bạn đã được tiếp nhận và đang được xử lý. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                                </p>
                                <p className="text-gray-300">
                                    Bạn có thể theo dõi trạng thái đơn hàng trong mục <Link to="/ecommerce/orders" className="text-blue-400 hover:underline">Đơn hàng của tôi</Link>.
                                </p>
                            </div>
                        ) : (
                            <p className="text-red-400">Không thể tải thông tin đơn hàng</p>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link
                            to="/ecommerce"
                            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center transition duration-150 ease-in-out"
                        >
                            Tiếp tục mua sắm
                        </Link>
                        <Link
                            to="/ecommerce/orders"
                            className="w-full md:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md text-center transition duration-150 ease-in-out"
                        >
                            Xem đơn hàng
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <h3 className="text-xl text-white font-semibold mb-4">Có thể bạn quan tâm</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="bg-[#182233] rounded-lg p-4 border border-[#243447] hover:border-blue-500 transition-colors">
                                <Link to={`/ecommerce/product/${item}`}>
                                    <div className="h-32 flex items-center justify-center bg-[#1b2a3b] rounded mb-3">
                                        <img
                                            src={getImagePath(`product-${item}.jpg`, 'https://via.placeholder.com/150')}
                                            alt="Sản phẩm gợi ý"
                                            className="h-28 object-contain"
                                        />
                                    </div>
                                    <h4 className="text-white font-medium truncate">Sản phẩm gợi ý {item}</h4>
                                    <p className="text-blue-400 font-bold mt-1">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1000000 + item * 500000)}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 
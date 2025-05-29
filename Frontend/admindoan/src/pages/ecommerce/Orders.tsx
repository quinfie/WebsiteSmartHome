import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserDonHang, cancelUserOrder } from '../../api/donhang';
import { useAuth } from '../../contexts/AuthContext';
import { ViewResponseCreateDonHangDto } from '../../types/donhang';
import { toast } from 'react-toastify';
import danhGiaService from '../../api/danhgia';

export default function CustomerOrders() {
    const [orders, setOrders] = useState<(ViewResponseCreateDonHangDto & { isReviewed?: boolean })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [showCancelled, setShowCancelled] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getCurrentUserDonHang();

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Không thể tải danh sách đơn hàng');
            }

            // Process orders to check review status
            const ordersWithReviewStatus = await Promise.all(response.data.map(async (order) => {
                if (order.trangThaiDonHang === 'Hoàn thành') {
                    try {
                        const reviews = await danhGiaService.getByMaDonHang(order.id);
                        return { ...order, isReviewed: reviews && reviews.length > 0 };
                    } catch (reviewError) {
                        console.error(`Error fetching reviews for order ${order.id}:`, reviewError);
                        return { ...order, isReviewed: false };
                    }
                } else {
                    return { ...order, isReviewed: false };
                }
            }));

            setOrders(ordersWithReviewStatus);
        } catch (err) {
            setError('Không thể tải danh sách đơn hàng');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
            if (!confirmed) return;

            await cancelUserOrder(orderId);
            toast.success('Hủy đơn hàng thành công');
            fetchOrders(); // Refresh the orders list
        } catch (err: any) {
            console.error('Error canceling order:', err);
            toast.error(err.message || 'Không thể hủy đơn hàng. Vui lòng thử lại sau.');
        }
    };

    const handleReview = (orderId: string) => {
        navigate(`/ecommerce/orders/${orderId}/review`);
    };

    // Get status badge class based on order status
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Đã giao hàng':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Chờ xác nhận':
            case 'Đang xử lý':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Đang vận chuyển':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
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

    // Calculate total items in an order
    const getTotalItems = (order: ViewResponseCreateDonHangDto) => {
        return order.chiTietDonHangs?.reduce((total, item) => total + item.soLuong, 0) || 0;
    };

    // Get current orders for pagination
    const getCurrentOrders = () => {
        const filteredOrders = orders.filter(order => showCancelled || order.trangThaiDonHang !== 'Đã hủy');
        const indexOfLastOrder = currentPage * ordersPerPage;
        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
        return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    };

    // Calculate total pages
    const totalPages = Math.ceil(
        orders.filter(order => showCancelled || order.trangThaiDonHang !== 'Đã hủy').length / ordersPerPage
    );

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Đơn hàng của bạn</h1>
                            <p className="text-gray-400">
                                Hiển thị {getCurrentOrders().length} trong tổng số {orders.length} đơn hàng
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center cursor-pointer bg-white/5 px-4 py-2 rounded-lg">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    checked={showCancelled}
                                    onChange={() => {
                                        setShowCancelled(!showCancelled);
                                        setCurrentPage(1); // Reset to first page when filter changes
                                    }}
                                />
                                <span className="ml-2 text-white">Hiển thị đơn đã hủy</span>
                            </label>
                            <button
                                onClick={() => navigate('/ecommerce')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                            >
                                <i className="fas fa-shopping-cart mr-2"></i>
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                            <p className="text-blue-400">Đang tải dữ liệu...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg p-10 text-center border border-white/10">
                            <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-box-open text-blue-400 text-3xl"></i>
                            </div>
                            <h2 className="text-2xl font-medium text-white mb-3">Chưa có đơn hàng nào</h2>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                Bạn chưa có đơn hàng nào trong lịch sử mua sắm. Hãy khám phá các sản phẩm và tạo đơn hàng đầu tiên của bạn!
                            </p>
                            <button
                                onClick={() => navigate('/ecommerce')}
                                className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                            >
                                <i className="fas fa-shopping-cart mr-2"></i>
                                Mua sắm ngay
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {getCurrentOrders().map((order) => (
                                <div key={order.id} className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/10 hover:border-blue-500/50 transition duration-300">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <i className="fas fa-shopping-bag text-blue-400"></i>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h2 className="text-lg font-semibold text-white">
                                                            Đơn hàng #{order.id.slice(-8).toUpperCase()}
                                                        </h2>
                                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(order.trangThaiDonHang)}`}>
                                                            {order.trangThaiDonHang}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        <p>Ngày đặt: {formatDate(order.ngayDat)}</p>
                                                        <p>Số lượng sản phẩm: {getTotalItems(order)}</p>
                                                        <p>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongTien)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {order.trangThaiDonHang === 'Chờ xác nhận' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        className="px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                                                    >
                                                        Hủy đơn
                                                    </button>
                                                )}
                                                {order.trangThaiDonHang === 'Hoàn thành' && !order.isReviewed && (
                                                    <button
                                                        onClick={() => handleReview(order.id)}
                                                        className="px-4 py-2 text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition-colors duration-200"
                                                    >
                                                        Đánh giá
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => navigate(`/ecommerce/orders/${order.id}`)}
                                                    className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                                >
                                                    Chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white/5 text-white hover:bg-white/10'
                                            } transition-colors`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUserDonHang } from '../../api/donhang';
import danhGiaService from '../../api/danhgia';
import { ViewResponseCreateDonHangDto } from '../../types/donhang';
import { CreateDanhGiaDto } from '../../types/danhgia';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

export default function OrderReview() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<ViewResponseCreateDonHangDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const orders = await getCurrentUserDonHang();
            const foundOrder = orders.find(o => o.id === orderId);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                setError('Không tìm thấy đơn hàng');
            }
        } catch (err) {
            setError('Không thể tải thông tin đơn hàng');
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!order || !orderId || !order.chiTietDonHangs?.length) return;
        if (rating === 0) {
            toast.error('Vui lòng chọn số sao đánh giá');
            return;
        }
        if (!review.trim()) {
            toast.error('Vui lòng nhập nội dung đánh giá');
            return;
        }

        try {
            setSubmitting(true);

            const reviewPromises = order.chiTietDonHangs.map(async (item) => {
                const reviewData: CreateDanhGiaDto = {
                    maDonHang: orderId,
                    maSanPham: item.maSanPham,
                    soSao: rating,
                    noiDung: review.trim(),
                    ngayDanhGia: new Date().toISOString()
                };
                return danhGiaService.create(reviewData);
            });

            const results = await Promise.all(reviewPromises);

            const allSuccessful = results.every(result => result === true);

            if (allSuccessful) {
                toast.success('Đánh giá thành công cho tất cả sản phẩm!');
                navigate('/ecommerce/orders');
            } else {
                toast.error('Có lỗi xảy ra khi gửi đánh giá cho một hoặc nhiều sản phẩm. Vui lòng kiểm tra lại.');
            }

        } catch (err: any) {
            console.error('Error submitting review:', err);
            toast.error(err.message || 'Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex flex-col justify-center items-center h-64 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                            <p className="text-blue-400">Đang tải thông tin đơn hàng...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            <span>{error || 'Không tìm thấy đơn hàng'}</span>
                        </div>
                        <button
                            onClick={() => navigate('/ecommerce/orders')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                            Quay lại danh sách đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/10">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-white mb-6">Đánh giá đơn hàng</h1>

                            {/* Order Summary */}
                            <div className="mb-8 p-4 bg-white/5 rounded-lg">
                                <h2 className="text-lg font-semibold text-white mb-4">Thông tin đơn hàng</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400">Mã đơn hàng:</p>
                                        <p className="text-white">#{order.id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Ngày đặt:</p>
                                        <p className="text-white">{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Sản phẩm trong đơn:</p>
                                        <p className="text-white">
                                            {order.chiTietDonHangs?.map(item => item.tenSanPham).join(', ') || 'Không có thông tin sản phẩm'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Tổng tiền:</p>
                                        <p className="text-white">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongTien)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Section */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-white mb-4">Đánh giá của bạn</h2>
                                <div className="flex items-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="focus:outline-none"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <FaStar
                                                className={`w-8 h-8 ${star <= (hover || rating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-400'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {rating === 0
                                        ? 'Vui lòng chọn số sao'
                                        : rating === 1
                                            ? 'Rất không hài lòng'
                                            : rating === 2
                                                ? 'Không hài lòng'
                                                : rating === 3
                                                    ? 'Bình thường'
                                                    : rating === 4
                                                        ? 'Hài lòng'
                                                        : 'Rất hài lòng'}
                                </p>
                            </div>

                            {/* Review Text */}
                            <div className="mb-8">
                                <label htmlFor="review" className="block text-lg font-semibold text-white mb-4">
                                    Nhận xét của bạn
                                </label>
                                <textarea
                                    id="review"
                                    rows={4}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => navigate('/ecommerce/orders')}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition duration-200"
                                    disabled={submitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        'Gửi đánh giá'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
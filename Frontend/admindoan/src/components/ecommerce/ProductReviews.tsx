import React, { useState, useEffect } from 'react';
import danhGiaService from '../../api/danhgia';
import { DanhGiaDto, PagedResponse } from '../../types/danhgia';

interface ProductReviewsProps {
    productId: string; // Mã sản phẩm để fetch đánh giá
}

// Function to render star rating (copy from ProductDetail for now, could be a shared utility)
const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-300' : 'text-gray-300'
                    }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
        );
    }
    return stars;
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const [allReviews, setAllReviews] = useState<DanhGiaDto[]>([]); // State to hold all fetched reviews
    const [displayedReviews, setDisplayedReviews] = useState<DanhGiaDto[]>([]); // State for reviews currently displayed
    const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1); // State cho trang hiện tại (bắt đầu từ 1)

    const pageSize = 5; // Kích thước trang cố định

    const fetchAllReviews = async () => {
        if (!productId) return;

        try {
            setReviewsLoading(true);
            // Fetch all reviews for the product
            // Assuming the API returns an array of reviews directly under 'data'
            const response = await danhGiaService.getByMaSanPham(productId, 1, 100); // Fetch a large enough number to get all

            if (response && response.statusCode === 200 && response.data && Array.isArray(response.data.data)) {
                // Store all fetched reviews
                setAllReviews(response.data.data);
                // Display the first page
                setDisplayedReviews(response.data.data.slice(0, pageSize));
                setPage(1); // Reset to first page
            } else {
                console.error('API call was not successful or response data is not in expected format.', response);
                setAllReviews([]);
                setDisplayedReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setAllReviews([]);
            setDisplayedReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        // Reset states and fetch first page when productId changes
        setAllReviews([]);
        setDisplayedReviews([]);
        setPage(1);
        // Fetch the first page
        fetchAllReviews();
    }, [productId]); // Re-fetch when product ID changes

    const handleLoadMore = () => {
        const nextPage = page + 1;
        const nextReviews = allReviews.slice(0, nextPage * pageSize);
        setDisplayedReviews(nextReviews);
        setPage(nextPage);
    };

    // Determine if there are more reviews to load
    const hasMoreReviews = displayedReviews.length < allReviews.length;

    // Calculate average rating from currently loaded reviews
    const averageRating = allReviews.length > 0 ? allReviews.reduce((sum, review) => sum + review.soSao, 0) / allReviews.length : 0;

    return (
        <div className="mt-8">
            <div className="text-lg font-semibold text-white border-b border-gray-700 pb-2 mb-4 flex justify-between items-center">
                Đánh giá ({allReviews.length}) {/* Display total review count based on all fetched items */}
                <div className="flex items-center">
                    <div className="flex mr-1">
                        {renderStars(averageRating)}
                    </div>
                    <span className="text-gray-400 text-sm">({averageRating.toFixed(1)})</span>
                </div>
            </div>

            {/* Loading state */}
            {reviewsLoading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : allReviews.length === 0 ? (
                <div className="text-gray-400 text-center">Chưa có đánh giá nào cho sản phẩm này.</div>
            ) : (
                <div className="space-y-4">
                    {displayedReviews.map((review) => (
                        <div key={review.id} className="bg-[#1b2a3b] p-4 rounded-md border border-gray-700">
                            <div className="flex items-center mb-2">
                                <span className="font-medium text-white mr-2">{review.tenNguoiDung || 'Người dùng ẩn danh'}:</span>
                                {renderStars(review.soSao)}
                            </div>
                            <p className="text-gray-300">{review.noiDung}</p>
                            <p className="text-gray-500 text-sm mt-2">Ngày đánh giá: {new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Load More button */}
            {!reviewsLoading && hasMoreReviews && (
                <div className="text-center mt-4">
                    <button
                        onClick={handleLoadMore}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={reviewsLoading}
                    >
                        Tải thêm đánh giá ({allReviews.length - displayedReviews.length} còn lại)
                    </button>
                </div>
            )}

        </div>
    );
};

export default ProductReviews; 
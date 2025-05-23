import { Link } from 'react-router-dom';
import { SanPhamDto } from '../../types/sanpham';
import { getImagePath, handleImageError } from '../../utils/imageUtils';

interface ProductItemProps {
    product: SanPhamDto;
    isWished?: boolean;
    handleWishlist?: (id: string) => void;
    addToCart?: (id: string) => void;
    isAddingToCart?: boolean;
}

export default function ProductItem({
    product,
    isWished = false,
    handleWishlist = () => { },
    addToCart = () => { },
    isAddingToCart = false
}: ProductItemProps) {
    const renderStars = (rating: number) => {
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

    // Determine status based on soLuongTon
    const getStatusColor = () => {
        if (product.soLuongTon === undefined) return 'bg-gray-500';
        if (product.soLuongTon > 10) return 'bg-green-500';
        if (product.soLuongTon > 0) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Default rating (can be replaced when we have actual rating data)
    const rating = 4;

    return (
        <div className="w-full lg:w-1/4 md:w-1/3 sm:w-1/2 p-2">
            <div className="relative bg-[#182233] h-full mx-auto transition-all duration-300 hover:shadow-md shadow-sm rounded-lg overflow-hidden border border-gray-700">
                {/* Status indicator */}
                <div className="absolute top-3 left-3 z-10">
                    <div className={`w-3 h-3 ${getStatusColor()} rounded-full`}></div>
                </div>

                {/* Wishlist button */}
                <div className="absolute top-3 right-3 z-10">
                    <button
                        onClick={() => handleWishlist(product.id)}
                        className="p-1.5 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70"
                    >
                        {isWished ? (
                            <i className="fas fa-heart fa-fw text-sm text-green-500"></i>
                        ) : (
                            <i className="far fa-heart fa-fw text-sm text-green-500"></i>
                        )}
                    </button>
                </div>

                {/* Product image */}
                <Link to={`/ecommerce/product/${product.id}`} className="block relative">
                    <div className="h-44 md:h-48 w-full bg-[#1b2a3b] flex items-center justify-center p-4">
                        <img
                            className="max-h-full w-auto object-contain mx-auto"
                            src={getImagePath(product.img, 'https://via.placeholder.com/300')}
                            alt={product.tenSanPham}
                            loading="lazy"
                            onError={(e) => handleImageError(e, 'https://via.placeholder.com/300')}
                        />
                    </div>
                </Link>

                {/* Product details */}
                <div className="px-4 pt-4 pb-5">
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                        <div className="flex mr-1">
                            {renderStars(rating)}
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 py-0.5 rounded ml-1">
                            {rating.toFixed(1)}
                        </span>
                    </div>

                    {/* Product title */}
                    <Link to={`/ecommerce/product/${product.id}`} className="hover:text-green-400">
                        <h3 className="text-white overflow-hidden text-ellipsis whitespace-nowrap font-medium text-base mb-3">
                            {product.tenSanPham}
                        </h3>
                    </Link>

                    {/* Price and add to cart */}
                    <div className="flex items-center justify-between">
                        <span className="text-white font-bold">
                            {new Intl.NumberFormat('vi-VN').format(product.donGia)} đ
                        </span>
                        <button
                            onClick={() => addToCart(product.id)}
                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium"
                            disabled={product.soLuongTon === 0 || isAddingToCart}
                        >
                            {isAddingToCart ? (
                                <>
                                    <div className="animate-spin h-3 w-3 inline-block mr-1 border-2 border-white border-t-transparent rounded-full"></div>
                                    Đang thêm...
                                </>
                            ) : (
                                product.soLuongTon > 0 ? 'Thêm vào giỏ' : 'Hết hàng'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sanPhamService } from '../../api/sanpham';
import { SanPhamResponseDto } from '../../types/sanpham';
import { getImagePath, handleImageError } from '../../utils/imageUtils';
import { cartApi } from '../../api/cart';
import { toast } from 'react-hot-toast';
import ProductReviews from '../../components/ecommerce/ProductReviews';
import SuggestedProducts from '../../components/ecommerce/SuggestedProducts';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<SanPhamResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [activeImage, setActiveImage] = useState<string>('');
    const [addingToCart, setAddingToCart] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<'description' | 'reviews'>('description');
    const [relatedProducts, setRelatedProducts] = useState<SanPhamResponseDto[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await sanPhamService.getById(id);
                setProduct(data);
                // Set the first image as active if available
                if (data.img) {
                    setActiveImage(data.img);
                }
                // Fetch related products
                const related = await sanPhamService.getRelatedProducts(id);
                setRelatedProducts(related);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    const addToCart = async () => {
        if (!product) return;
        const productId = (product as any).maSanPham || product.id;

        if (!productId) {
            toast.error('Sản phẩm không có mã định danh hợp lệ.');
            return;
        }

        try {
            setAddingToCart(true);
            await cartApi.addToCart(productId.trim(), quantity);
            toast.success('Đã thêm sản phẩm vào giỏ hàng!');

            // Dispatch custom event for cart update
            window.dispatchEvent(new CustomEvent('cart-updated'));
        } catch (error) {
            toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
        } finally {
            setAddingToCart(false);
        }
    };

    // Function to render star rating
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

    // Default rating (can be replaced when we have actual rating data)
    const rating = 4;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">Sản phẩm không tồn tại</h2>
                    <Link to="/ecommerce" className="text-blue-400 hover:underline">
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-[#182233] shadow-md rounded-lg p-6">
                <div className="flex flex-col md:flex-row -mx-4">
                    {/* Product Image */}
                    <div className="md:flex-1 px-4 mb-6 md:mb-0">
                        <div className="h-64 md:h-80 rounded-lg bg-[#1b2a3b] mb-4 flex items-center justify-center p-4">
                            <img
                                src={getImagePath(activeImage || product?.img, 'https://via.placeholder.com/500')}
                                alt={product?.tenSanPham}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => handleImageError(e, 'https://via.placeholder.com/500')}
                            />
                        </div>

                        {/* Additional Images would go here if available */}
                        <div className="flex -mx-2 mb-4">
                            {product?.img && (
                                <div className="w-1/2 px-2">
                                    <button
                                        onClick={() => setActiveImage(product.img || '')}
                                        className={`w-full h-24 md:h-32 flex items-center justify-center border rounded-lg bg-[#1b2a3b] p-2 ${activeImage === product.img ? 'border-blue-500' : 'border-gray-700'}`}
                                    >
                                        <img
                                            src={getImagePath(product.img, 'https://via.placeholder.com/150')}
                                            alt={product.tenSanPham}
                                            className="h-full object-contain"
                                            onError={(e) => handleImageError(e, 'https://via.placeholder.com/150')}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="md:flex-1 px-4 text-white">
                        <h2 className="text-2xl font-bold mb-2">{product.tenSanPham}</h2>

                        <div className="flex items-center mb-4">
                            <div className="flex mr-2">
                                {renderStars(0)}
                            </div>
                        </div>

                        <div className="flex items-center mb-4">
                            <span className="text-blue-400 font-bold text-2xl">
                                {new Intl.NumberFormat('vi-VN').format(product.donGia)} đ
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-300">{product.moTa}</p>
                        </div>

                        <div className="mb-4">
                            <div className="flex border-b border-gray-700 py-2">
                                <span className="text-gray-400 w-1/3">Thương hiệu:</span>
                                <span className="text-white">{product.tenNhaCungCap || 'Không có'}</span>
                            </div>
                            <div className="flex border-b border-gray-700 py-2">
                                <span className="text-gray-400 w-1/3">Danh mục:</span>
                                <span className="text-white">{product.tenDanhMuc || 'Không có'}</span>
                            </div>
                            <div className="flex border-b border-gray-700 py-2">
                                <span className="text-gray-400 w-1/3">Kho:</span>
                                <span className="text-white">{product.tenKho || 'Không có'}</span>
                            </div>
                            <div className="flex border-b border-gray-700 py-2">
                                <span className="text-gray-400 w-1/3">Trạng thái:</span>
                                <span className={product.soLuongTon > 0 ? 'text-green-400' : 'text-red-400'}>
                                    {product.soLuongTon > 0 ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                            </div>
                            <div className="flex border-b border-gray-700 py-2">
                                <span className="text-gray-400 w-1/3">Còn lại:</span>
                                <span className="text-white">{product.soLuongTon} sản phẩm</span>
                            </div>
                            <div className="flex border-b border-gray-700 py-2">
                                <span className="text-gray-400 w-1/3">Thời gian bảo hành:</span>
                                <span className="text-white">{product.thoiGianBaoHanh} tháng</span>
                            </div>
                            <div className="flex border-b border-gray-700 py-2">
                                <span className="text-gray-400 w-1/3">Ngày sản xuất:</span>
                                <span className="text-white">{new Date(product.ngaySanXuat).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center">
                                <div className="mr-4">
                                    <label htmlFor="quantity" className="text-gray-300 mr-2">Số lượng:</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        className="w-16 bg-[#1b2a3b] border border-gray-700 text-white p-2 rounded"
                                        value={quantity}
                                        min="1"
                                        max={product.soLuongTon}
                                        onChange={handleQuantityChange}
                                    />
                                </div>
                                <button
                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center"
                                    onClick={addToCart}
                                    disabled={product.soLuongTon === 0 || addingToCart}
                                >
                                    {addingToCart ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                            Đang thêm...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-shopping-cart mr-2"></i>
                                            {product.soLuongTon > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Description & Reviews Section */}
            <div className="bg-[#182233] shadow-md rounded-lg p-6 mt-6">
                <div className="flex border-b border-gray-700 mb-4">
                    <button
                        className={`py-2 px-4 font-medium ${activeSection === 'description'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'}`}
                        onClick={() => setActiveSection('description')}
                    >
                        Mô tả chi tiết
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeSection === 'reviews'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'}`}
                        onClick={() => setActiveSection('reviews')}
                    >
                        Đánh giá
                    </button>
                </div>

                {activeSection === 'description' ? (
                    <div className="prose max-w-none text-gray-300">
                        <p>{product.moTa || 'Không có mô tả chi tiết cho sản phẩm này.'}</p>
                    </div>
                ) : (
                    id && <ProductReviews productId={id} />
                )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <SuggestedProducts
                    title="Sản phẩm liên quan"
                    products={relatedProducts}
                    icon="link"
                />
            )}
        </div>
    );
} 
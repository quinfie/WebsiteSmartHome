import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getImagePath, handleImageError } from '../../utils/imageUtils';
import api from '../../api/axios.config';
import { cartApi } from '../../api/cart';
import { toast } from 'react-hot-toast';

interface Product {
    maSanPham?: string;
    id?: string;
    tenSanPham: string;
    donGia: number;
    img: string;
    soLuongTon?: number;
    moTa?: string;
}

interface Category {
    maDanhMuc: string;
    tenDanhMuc: string;
    hinhAnh?: string;
}

// Add an event for cart updates
const CART_UPDATED_EVENT = 'cart-updated';

export default function CategoryPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('default');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {

                // Validate categoryId first
                if (!categoryId || categoryId === 'undefined') {
                    navigate('/ecommerce/category');
                    return;
                }

                setLoading(true);
                setError('');

                // Fetch category info first
                await fetchCategoryInfo();

                // Then fetch products if category exists
                await fetchProducts();

            } catch (err) {
                setError('Không thể tải thông tin danh mục. Vui lòng thử lại sau.');

                if (err instanceof Error && err.message.includes('Mã danh mục không hợp lệ')) {
                    navigate('/ecommerce/category');
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [categoryId, currentPage, sortBy, retryCount]);

    const fetchCategoryInfo = async () => {
        if (!categoryId || categoryId === 'undefined') {
            throw new Error('Mã danh mục không hợp lệ');
        }

        try {
            const response = await api.get(`/DanhMuc/${categoryId}`);

            if (response.data && response.data.data) {
                const categoryData = response.data.data;
                setCategory(categoryData);
            } else {
                throw new Error('Không tìm thấy thông tin danh mục');
            }
        } catch (err: any) {
        }
    };

    const fetchProducts = async () => {
        if (!categoryId) {
            return;
        }

        try {
            // Determine sort parameter
            let sortParam = {
                sortBy: '',
                ascending: true
            };
            switch (sortBy) {
                case 'price-asc':
                    sortParam = { sortBy: 'donGia', ascending: true };
                    break;
                case 'price-desc':
                    sortParam = { sortBy: 'donGia', ascending: false };
                    break;
                case 'name-asc':
                    sortParam = { sortBy: 'tenSanPham', ascending: true };
                    break;
                case 'name-desc':
                    sortParam = { sortBy: 'tenSanPham', ascending: false };
                    break;
                default:
                    sortParam = { sortBy: 'tenSanPham', ascending: true };
            }

            const requestParams = {
                maDanhMuc: categoryId,
                page: currentPage,
                pageSize: 12,
                ...sortParam
            };

            // Clear previous error state
            setError('');

            // Make the API request
            const response = await api.get('/SanPham/search', {
                params: requestParams
            });

            // Validate response structure
            if (!response.data) {
                throw new Error('Response data is null or undefined');
            }

            const responseData = response.data.data;
            if (!responseData) {
                throw new Error('Response data.data is null or undefined');
            }

            const items = responseData.items;
            if (!Array.isArray(items)) {
                throw new Error('Items is not an array');
            }


            // Only set empty state if we actually got an empty array
            if (items.length === 0) {
                setProducts([]);
                setError('Không có sản phẩm nào trong danh mục này');
                setLoading(false);
                return;
            }

            // Normalize product data
            const normalizedProducts = items.map((product: any) => ({
                ...product,
                maSanPham: product.id || product.maSanPham,
                id: product.id || product.maSanPham,
                img: product.img || '',
                donGia: typeof product.donGia === 'number' ? product.donGia : 0,
                soLuongTon: typeof product.soLuongTon === 'number' ? product.soLuongTon : 0,
                tenSanPham: product.tenSanPham || 'Sản phẩm không có tên'
            }));

            // Update state in the correct order
            setProducts(normalizedProducts);

            // Handle pagination
            const totalItems = responseData.totalItems || 0;
            const calculatedTotalPages = Math.ceil(totalItems / (responseData.pageSize || 12)) || 1;

            setTotalPages(calculatedTotalPages);

            // Finally set loading to false
            setLoading(false);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Không thể tải sản phẩm. Vui lòng thử lại sau.'
            );

            // Clear products and set loading to false
            setProducts([]);
            setLoading(false);
        }
    };

    const handleAddToCart = async (product: Product) => {
        try {
            // Check if product has an ID (either maSanPham or id) and it's not empty
            const productId = product.maSanPham || product.id;

            if (!productId) {
                toast.error('Sản phẩm không có mã định danh hợp lệ.');
                return;
            }

            await cartApi.addToCart(productId.trim(), 1);
            toast.success(`Đã thêm ${product.tenSanPham} vào giỏ hàng!`);

            // Dispatch custom event that cart was updated
            window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
        } catch (err) {
            toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.');
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setCurrentPage(1); // Reset to first page when changing sort

    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    return (
        <div className="bg-[#0f172a] min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="mb-6 text-gray-400">
                    <Link to="/ecommerce" className="hover:text-white flex items-center inline-flex">
                        <i className="fas fa-home mr-1"></i> Trang chủ
                    </Link>{' '}
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <Link to="/ecommerce/category" className="hover:text-white inline-flex items-center">
                        <i className="fas fa-folder mr-1"></i> Danh mục
                    </Link>{' '}
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <span className="text-white">{category?.tenDanhMuc || 'Danh mục'}</span>
                </div>

                {/* Category header */}
                <div className="bg-[#182233] border border-[#243447] rounded-lg p-6 mb-8 flex items-center justify-between">
                    <div className="flex items-center">
                        {category?.hinhAnh ? (
                            <div className="mr-4 bg-[#1b2a3b] p-2 rounded-full w-16 h-16 flex items-center justify-center overflow-hidden">
                                <img
                                    src={getImagePath(category.hinhAnh)}
                                    alt={category?.tenDanhMuc}
                                    className="w-12 h-12 object-contain"
                                    onError={handleImageError}
                                />
                            </div>
                        ) : (
                            <div className="mr-4 bg-[#1b2a3b] p-2 rounded-full w-16 h-16 flex items-center justify-center overflow-hidden">
                                <i className="fas fa-folder text-blue-400 text-3xl"></i>
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {category?.tenDanhMuc || 'Danh mục sản phẩm'}
                            </h1>
                            {!loading && (
                                <p className="text-gray-400 mt-1 flex items-center">
                                    <i className="fas fa-layer-group mr-1"></i>
                                    {products.length} sản phẩm
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sorting options */}
                    <div className="hidden md:flex items-center">
                        <i className="fas fa-sort text-gray-400 mr-2"></i>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="bg-[#1b2a3b] text-white border border-[#243447] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="default">Sắp xếp mặc định</option>
                            <option value="price-asc">Giá: Thấp đến cao</option>
                            <option value="price-desc">Giá: Cao đến thấp</option>
                            <option value="name-asc">Tên: A-Z</option>
                            <option value="name-desc">Tên: Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Mobile sorting */}
                <div className="block md:hidden mb-4">
                    <div className="flex items-center bg-[#1b2a3b] border border-[#243447] rounded-md px-3">
                        <i className="fas fa-sort text-gray-400 mr-2"></i>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="w-full bg-transparent text-white py-2 focus:outline-none"
                        >
                            <option value="default">Sắp xếp mặc định</option>
                            <option value="price-asc">Giá: Thấp đến cao</option>
                            <option value="price-desc">Giá: Cao đến thấp</option>
                            <option value="name-asc">Tên: A-Z</option>
                            <option value="name-desc">Tên: Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-[#182233] border border-[#243447] rounded-lg p-8 text-center mb-6">
                        <div className="text-red-400 mb-4 text-lg">
                            <i className="fas fa-exclamation-circle mr-2"></i> {error}
                        </div>
                        <button
                            onClick={handleRetry}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2 mx-auto"
                        >
                            <i className="fas fa-sync"></i> Thử lại
                        </button>
                    </div>
                )}

                {loading ? (
                    // Loading skeleton
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-[#182233] rounded-lg p-4 animate-pulse">
                                <div className="h-48 bg-[#1b2a3b] rounded mb-4"></div>
                                <div className="h-4 bg-[#1b2a3b] rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-[#1b2a3b] rounded w-1/2 mb-3"></div>
                                <div className="h-8 bg-[#1b2a3b] rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    // Empty state
                    <div className="bg-[#182233] rounded-lg border border-[#243447] p-8 text-center">
                        <i className="fas fa-box-open text-gray-400 text-5xl mb-4"></i>
                        <h3 className="text-xl font-medium text-white mb-2">Không có sản phẩm</h3>
                        <p className="text-gray-400 mb-6">
                            Chưa có sản phẩm nào trong danh mục này
                        </p>
                        <Link
                            to="/ecommerce"
                            className="inline-flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <i className="fas fa-home mr-2"></i> Quay lại trang chủ
                        </Link>
                    </div>
                ) : (
                    // Product grid
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => {
                                const productId = product.maSanPham || product.id;
                                return (
                                    <div key={productId} className="bg-[#182233] rounded-lg overflow-hidden border border-[#243447] hover:border-blue-500 transition-colors group">
                                        <Link to={`/ecommerce/product/${productId}`} className="block">
                                            <div className="h-48 bg-[#1b2a3b] p-4 flex items-center justify-center relative">
                                                <img
                                                    src={getImagePath(product.img)}
                                                    alt={product.tenSanPham}
                                                    className="max-h-40 max-w-full object-contain transition-transform group-hover:scale-105"
                                                    onError={handleImageError}
                                                />
                                                {product.soLuongTon !== undefined && product.soLuongTon <= 5 && product.soLuongTon > 0 && (
                                                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                                        <i className="fas fa-fire-flame-curved mr-1"></i>
                                                        Chỉ còn {product.soLuongTon}
                                                    </span>
                                                )}
                                                {product.soLuongTon === 0 && (
                                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                        <i className="fas fa-xmark mr-1"></i> Hết hàng
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <h3 className="text-white font-medium line-clamp-2 h-12">{product.tenSanPham}</h3>
                                                <p className="text-blue-400 font-bold mt-2 flex items-center">
                                                    <i className="fas fa-tag mr-2 text-blue-300"></i>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.donGia)}
                                                </p>

                                                {product.soLuongTon !== undefined && (
                                                    <div className="text-gray-400 text-sm mt-2 flex items-center">
                                                        <span className={`w-2 h-2 rounded-full mr-2 ${product.soLuongTon > 10 ? 'bg-green-500' :
                                                            product.soLuongTon > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}></span>
                                                        <span>
                                                            {product.soLuongTon > 10 ? 'Còn hàng' :
                                                                product.soLuongTon > 0 ? `Còn ${product.soLuongTon}` : 'Hết hàng'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="px-4 pb-4">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
                                                disabled={product.soLuongTon === 0}
                                            >
                                                <i className="fas fa-cart-plus"></i>
                                                Thêm vào giỏ
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex justify-center">
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-[#1b2a3b] text-white rounded-md disabled:opacity-50 flex items-center"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            // Show first, last, current and 1 page before and after current
                                            return (
                                                page === 1 ||
                                                page === totalPages ||
                                                page === currentPage ||
                                                page === currentPage - 1 ||
                                                page === currentPage + 1
                                            );
                                        })
                                        .map((page, index, array) => {
                                            // Add ellipsis between non-consecutive pages
                                            const showEllipsisBefore =
                                                index > 0 && array[index - 1] !== page - 1;

                                            return (
                                                <div key={page} className="flex items-center">
                                                    {showEllipsisBefore && (
                                                        <span className="px-4 py-2 text-gray-400">...</span>
                                                    )}

                                                    <button
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-[#1b2a3b] text-white hover:bg-[#243447]'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </div>
                                            );
                                        })}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-[#1b2a3b] text-white rounded-md disabled:opacity-50 flex items-center"
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
} 
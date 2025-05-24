import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getImagePath, handleImageError } from '../../utils/imageUtils';
import { sanPhamService } from '../../api/sanpham';
import { SanPhamDto, SanPhamResponseDto } from '../../types/sanpham';
import api from '../../api/axios.config';
import { useAuth } from '../../contexts/AuthContext';

interface Product {
    id?: string;
    maSanPham: string;
    tenSanPham: string;
    moTa?: string;
    img?: string;
    donGia: number;
    soLuongTon?: number;
    tongSoLuong?: number;
}

interface Category {
    maDanhMuc: string;
    tenDanhMuc: string;
    hinhAnh?: string;
    id?: string;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Map SanPhamDto to Product interface
const mapSanPhamToProduct = (sanPham: SanPhamDto | SanPhamResponseDto): Product => {
    return {
        id: sanPham.id,
        maSanPham: sanPham.id, // Using id as maSanPham since that's what the API returns
        tenSanPham: sanPham.tenSanPham,
        moTa: sanPham.moTa,
        img: sanPham.img,
        donGia: sanPham.donGia,
        soLuongTon: sanPham.soLuongTon
    };
};

export default function Products() {
    // Scroll to top on page load
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const location = useLocation();
    const navigate = useNavigate();
    const pageSize = 12;
    const { user } = useAuth(); // Lấy thông tin user từ AuthContext

    // Định nghĩa ref ở cấp độ component
    const shouldSkipFirstRender = useRef(true);

    // Parse query params directly on mount and also when location changes
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        // Parse each parameter
        const category = searchParams.get('category');
        const page = searchParams.get('page');
        const sort = searchParams.get('sort');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        // Create a batch of updates to avoid multiple renders
        const updates: {
            category?: string;
            page?: number;
            sort?: string;
            priceRange?: [number, number];
        } = {};

        // Process category first as it's the main filter
        if (category) {
            updates.category = category;
        }

        if (page) {
            updates.page = parseInt(page, 10);
        }

        if (sort) {
            updates.sort = sort;
        }

        if (minPrice && maxPrice) {
            updates.priceRange = [parseInt(minPrice, 10), parseInt(maxPrice, 10)];
        }

        // Apply all updates at once
        if (updates.category !== undefined && updates.category !== selectedCategory) {
            setSelectedCategory(updates.category);
        }

        if (updates.page !== undefined && updates.page !== currentPage) {
            setCurrentPage(updates.page);
        }

        if (updates.sort !== undefined && updates.sort !== sortBy) {
            setSortBy(updates.sort);
        }

        if (updates.priceRange !== undefined &&
            (updates.priceRange[0] !== priceRange[0] || updates.priceRange[1] !== priceRange[1])) {
            setPriceRange(updates.priceRange);
        }

        // Always fetch products when URL parameters change
        fetchProducts();

        // Scroll to top after parameters change
        window.scrollTo(0, 0);
    }, [location.search]);

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // Scroll to top on initial render
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/DanhMuc');

            if (response.data && response.data.data) {
                // Map categories to ensure maDanhMuc is a string and set to the ID field
                const formattedCategories = response.data.data.map((cat: any) => {
                    const id = cat.id ? cat.id.toString() : '';
                    return {
                        ...cat,
                        maDanhMuc: id
                    };
                });

                setCategories(formattedCategories);
            }
        } catch (err) {
            throw err;
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');

            // Build search parameters
            const params: any = {
                page: currentPage,
                pageSize: pageSize,
            };

            // Add category filter if selected
            if (selectedCategory) {
                params.maDanhMuc = selectedCategory;
            }

            // Add sorting
            if (sortBy === 'price-asc') {
                params.sortBy = 'gia';
                params.ascending = true;
            } else if (sortBy === 'price-desc') {
                params.sortBy = 'gia';
                params.ascending = false;
            } else if (sortBy === 'name-asc') {
                params.sortBy = 'tensanpham';
                params.ascending = true;
            } else if (sortBy === 'name-desc') {
                params.sortBy = 'tensanpham';
                params.ascending = false;
            }

            // Add price range
            if (priceRange[0] > 0) {
                params.minPrice = priceRange[0];
            }
            if (priceRange[1] < 10000000) {
                params.maxPrice = priceRange[1];
            }

            try {
                // Use the search API directly to debug
                const response = await api.get('/SanPham/search', {
                    params: params
                });

                const result = response.data.data;

                if (result && result.items) {
                    const mappedProducts = result.items.map(mapSanPhamToProduct);
                    setProducts(mappedProducts);
                    setTotalPages(Math.ceil(result.totalItems / pageSize));
                } else {
                    setProducts([]);
                    setTotalPages(1);
                }
            } catch (error) {
                throw error;
            }

        } catch (err: any) {
            setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        // Use empty string for 'all categories'
        const finalCategoryId = categoryId.toString();

        // Update URL directly rather than state
        const params = new URLSearchParams(location.search);

        if (finalCategoryId && finalCategoryId !== '') {
            params.set('category', finalCategoryId);
        } else {
            params.delete('category');
        }

        // Reset to page 1 when changing category
        params.delete('page');

        // Also directly update state for immediate UI feedback
        setSelectedCategory(finalCategoryId);
        setCurrentPage(1);

        // Navigate to new URL (this will trigger the useEffect that reads from URL)
        navigate({
            pathname: '/ecommerce/products',
            search: params.toString()
        }, { replace: true });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortValue = e.target.value;

        // Update URL directly
        const params = new URLSearchParams(location.search);

        if (newSortValue !== 'default') {
            params.set('sort', newSortValue);
        } else {
            params.delete('sort');
        }

        // Reset to page 1 when changing sort
        params.delete('page');

        // Update state directly for immediate UI feedback
        setSortBy(newSortValue);
        setCurrentPage(1);

        navigate({
            pathname: '/ecommerce/products',
            search: params.toString()
        }, { replace: true, state: { preventScroll: true, scroll: false } });
    };

    const handlePriceRangeChange = (min: number, max: number) => {
        // Update URL directly
        const params = new URLSearchParams(location.search);

        if (min > 0) {
            params.set('minPrice', min.toString());
        } else {
            params.delete('minPrice');
        }

        if (max < 10000000) {
            params.set('maxPrice', max.toString());
        } else {
            params.delete('maxPrice');
        }

        // Reset to page 1 when changing price range
        params.delete('page');

        // Update state directly for immediate UI feedback
        setPriceRange([min, max]);
        setCurrentPage(1);

        navigate({
            pathname: '/ecommerce/products',
            search: params.toString()
        }, { replace: true, state: { preventScroll: true, scroll: false } });
    };

    const handlePageChange = (page: number) => {
        // Update URL directly
        const params = new URLSearchParams(location.search);
        params.set('page', page.toString());

        // Update state directly for immediate UI feedback
        setCurrentPage(page);

        navigate({
            pathname: '/ecommerce/products',
            search: params.toString()
        }, { replace: true });
    };

    // Define a reset key based on current filters to force remount when they change
    const resetKey = `${selectedCategory}-${currentPage}`;

    return (
        <div className="bg-[#0f172a] min-h-screen py-8" key={resetKey} style={{ scrollBehavior: 'auto' }}>
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="mb-6 text-gray-400">
                    <Link to="/ecommerce" className="hover:text-white flex items-center inline-flex">
                        <i className="fas fa-home mr-1"></i> Trang chủ
                    </Link>{' '}
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <span className="text-white">Tất cả sản phẩm</span>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Filter sidebar */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-4 mb-4">
                            <h3 className="text-white font-bold mb-3">Danh mục</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <input
                                        type="radio"
                                        id="category-all"
                                        name="category"
                                        className="mr-2 accent-blue-600 h-4 w-4 cursor-pointer"
                                        checked={selectedCategory === ''}
                                        onChange={() => handleCategoryChange('')}
                                    />
                                    <label
                                        htmlFor="category-all"
                                        className={`flex-1 cursor-pointer py-1 ${selectedCategory === '' ? 'text-white' : 'text-gray-300'}`}
                                        onClick={() => handleCategoryChange('')}
                                    >
                                        Tất cả sản phẩm
                                    </label>
                                </li>
                                {categories.map((category, index) => {
                                    // Skip rendering if no valid ID
                                    if (!category.maDanhMuc && !category.id) {
                                        return null;
                                    }

                                    const categoryId = category.maDanhMuc || category.id || '';

                                    return (
                                        <li key={`${categoryId}-${index}`} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={`category-${categoryId}-${index}`}
                                                name="category"
                                                className="mr-2 accent-blue-600 h-4 w-4 cursor-pointer"
                                                checked={selectedCategory === categoryId}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleCategoryChange(categoryId);
                                                    }
                                                }}
                                                value={categoryId}
                                            />
                                            <label
                                                htmlFor={`category-${categoryId}-${index}`}
                                                className={`flex-1 cursor-pointer py-1 ${selectedCategory === categoryId ? 'text-white' : 'text-gray-300'}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategoryChange(categoryId);
                                                }}
                                            >
                                                {category.tenDanhMuc}
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-4 mb-4">
                            <h3 className="text-white font-bold mb-3">Giá</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <input
                                        type="radio"
                                        id="price-all"
                                        name="price"
                                        className="mr-2 accent-blue-600 h-4 w-4 cursor-pointer"
                                        checked={priceRange[0] === 0 && priceRange[1] === 10000000}
                                        onChange={() => handlePriceRangeChange(0, 10000000)}
                                    />
                                    <label
                                        htmlFor="price-all"
                                        className={`flex-1 cursor-pointer py-1 ${priceRange[0] === 0 && priceRange[1] === 10000000 ? 'text-white' : 'text-gray-300'}`}
                                        onClick={() => handlePriceRangeChange(0, 10000000)}
                                    >
                                        Tất cả
                                    </label>
                                </li>
                                <li className="flex items-center">
                                    <input
                                        type="radio"
                                        id="price-under-500k"
                                        name="price"
                                        className="mr-2 accent-blue-600 h-4 w-4 cursor-pointer"
                                        checked={priceRange[0] === 0 && priceRange[1] === 500000}
                                        onChange={() => handlePriceRangeChange(0, 500000)}
                                    />
                                    <label
                                        htmlFor="price-under-500k"
                                        className={`flex-1 cursor-pointer py-1 ${priceRange[0] === 0 && priceRange[1] === 500000 ? 'text-white' : 'text-gray-300'}`}
                                        onClick={() => handlePriceRangeChange(0, 500000)}
                                    >
                                        Dưới 500.000đ
                                    </label>
                                </li>
                                <li className="flex items-center">
                                    <input
                                        type="radio"
                                        id="price-500k-1m"
                                        name="price"
                                        className="mr-2 accent-blue-600 h-4 w-4 cursor-pointer"
                                        checked={priceRange[0] === 500000 && priceRange[1] === 1000000}
                                        onChange={() => handlePriceRangeChange(500000, 1000000)}
                                    />
                                    <label
                                        htmlFor="price-500k-1m"
                                        className={`flex-1 cursor-pointer py-1 ${priceRange[0] === 500000 && priceRange[1] === 1000000 ? 'text-white' : 'text-gray-300'}`}
                                        onClick={() => handlePriceRangeChange(500000, 1000000)}
                                    >
                                        500.000đ - 1.000.000đ
                                    </label>
                                </li>
                                <li className="flex items-center">
                                    <input
                                        type="radio"
                                        id="price-1m-5m"
                                        name="price"
                                        className="mr-2 accent-blue-600 h-4 w-4 cursor-pointer"
                                        checked={priceRange[0] === 1000000 && priceRange[1] === 5000000}
                                        onChange={() => handlePriceRangeChange(1000000, 5000000)}
                                    />
                                    <label
                                        htmlFor="price-1m-5m"
                                        className={`flex-1 cursor-pointer py-1 ${priceRange[0] === 1000000 && priceRange[1] === 5000000 ? 'text-white' : 'text-gray-300'}`}
                                        onClick={() => handlePriceRangeChange(1000000, 5000000)}
                                    >
                                        1.000.000đ - 5.000.000đ
                                    </label>
                                </li>
                                <li className="flex items-center">
                                    <input
                                        type="radio"
                                        id="price-over-5m"
                                        name="price"
                                        className="mr-2 accent-blue-600 h-4 w-4 cursor-pointer"
                                        checked={priceRange[0] === 5000000 && priceRange[1] === 10000000}
                                        onChange={() => handlePriceRangeChange(5000000, 10000000)}
                                    />
                                    <label
                                        htmlFor="price-over-5m"
                                        className={`flex-1 cursor-pointer py-1 ${priceRange[0] === 5000000 && priceRange[1] === 10000000 ? 'text-white' : 'text-gray-300'}`}
                                        onClick={() => handlePriceRangeChange(5000000, 10000000)}
                                    >
                                        Trên 5.000.000đ
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="w-full md:w-3/4">
                        {/* Header with sorting */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-4 mb-6">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <h1 className="text-xl font-bold text-white mb-3 md:mb-0">
                                    {selectedCategory
                                        ? categories.find(c => c.maDanhMuc === selectedCategory || c.id === selectedCategory)?.tenDanhMuc || 'Sản phẩm'
                                        : 'Tất cả sản phẩm'}
                                </h1>
                                <div className="flex items-center">
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
                        </div>

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="bg-[#182233] rounded-lg p-4 animate-pulse">
                                        <div className="h-48 bg-[#1b2a3b] rounded mb-4"></div>
                                        <div className="h-4 bg-[#1b2a3b] rounded w-3/4 mb-3"></div>
                                        <div className="h-4 bg-[#1b2a3b] rounded w-1/2 mb-3"></div>
                                        <div className="h-8 bg-[#1b2a3b] rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error message */}
                        {error && !loading && (
                            <div className="bg-[#182233] border border-[#243447] rounded-lg p-8 text-center">
                                <div className="text-red-400 mb-4">{error}</div>
                                <button
                                    onClick={fetchProducts}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !error && products.length === 0 && (
                            <div className="bg-[#182233] rounded-lg border border-[#243447] p-8 text-center">
                                <i className="fas fa-box-open text-gray-400 text-5xl mb-4"></i>
                                <h3 className="text-xl font-medium text-white mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-gray-400 mb-6">
                                    Không có sản phẩm nào phù hợp với bộ lọc bạn đã chọn
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setPriceRange([0, 10000000]);
                                        setCurrentPage(1);
                                    }}
                                    className="inline-flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <i className="fas fa-filter-circle-xmark mr-2"></i> Xóa bộ lọc
                                </button>
                            </div>
                        )}

                        {/* Products grid */}
                        {!loading && !error && products.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => {
                                        const productId = product.maSanPham || product.id;
                                        return (
                                            <div key={productId} className="bg-[#182233] rounded-lg overflow-hidden border border-[#243447] hover:border-blue-500 transition-colors group">
                                                <Link to={`/ecommerce/product/${productId}`} className="block">
                                                    <div className="h-48 bg-[#1b2a3b] p-4 flex items-center justify-center relative">
                                                        <img
                                                            src={getImagePath(product.img, 'https://via.placeholder.com/300')}
                                                            alt={product.tenSanPham}
                                                            className="max-h-40 max-w-full object-contain transition-transform group-hover:scale-105"
                                                            onError={(e) => handleImageError(e, 'https://via.placeholder.com/300')}
                                                        />
                                                        {/* Hiển thị số lượng tồn kho chỉ cho Admin */}
                                                        {(user?.vaiTro?.includes('Quản Trị Viên') || user?.vaiTro?.includes('Quản Lí')) && product.soLuongTon !== undefined && (
                                                            product.soLuongTon > 0 ? (
                                                                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                                    <i className="fas fa-check-circle mr-1"></i> Còn hàng: {product.soLuongTon}
                                                                </span>
                                                            ) : (
                                                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                                    <i className="fas fa-times-circle mr-1"></i> Hết hàng
                                                                </span>
                                                            )
                                                        )}
                                                    </div>

                                                    <div className="p-4">
                                                        <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                                            {product.tenSanPham}
                                                        </h3>
                                                        <p className="text-blue-400 font-bold">
                                                            {formatCurrency(product.donGia)}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-10 flex justify-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                                                                onClick={() => handlePageChange(page)}
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
                                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
            </div>
        </div>
    );
}

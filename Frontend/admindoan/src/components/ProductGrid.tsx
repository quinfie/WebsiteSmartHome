import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImagePath, handleImageError } from '../utils/imageUtils';
import api from '../api/axios.config';
import { sanPhamService } from '../api/sanpham';
import { SanPhamDto, SanPhamResponseDto } from '../types/sanpham';

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

interface ProductGridProps {
    category?: string;
    limit?: number;
    title?: string;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const mapSanPhamToProduct = (sanPham: SanPhamDto | SanPhamResponseDto): Product => {
    return {
        id: sanPham.id,
        maSanPham: sanPham.id,
        tenSanPham: sanPham.tenSanPham,
        moTa: sanPham.moTa,
        img: sanPham.img,
        donGia: sanPham.donGia,
        soLuongTon: sanPham.soLuongTon
    };
};

export default function ProductGrid({ category, limit = 8, title = "Sản phẩm nổi bật" }: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [category, limit]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');

            try {
                if (category && category !== 'all') {
                    const productsData = await sanPhamService.getByDanhMucId(category);
                    const mappedProducts = productsData.map(mapSanPhamToProduct);
                    setProducts(mappedProducts.slice(0, limit));
                } else {

                    const result = await sanPhamService.getAll(1, limit);

                    const mappedProducts = result.items.map(mapSanPhamToProduct);
                    setProducts(mappedProducts);
                }
                setLoading(false);
                return; // If successful, exit the function
            } catch (serviceErr) {
                console.error('Error using sanPhamService:', serviceErr);
            }

            // Approach 2: Direct API call (fallback)
            const url = category && category !== 'all'
                ? `/SanPham/danh-muc/${category}?pageSize=${limit}&pageNumber=1`
                : `/SanPham?pageSize=${limit}&pageNumber=1`;

            const response = await api.get(url);

            if (response.data && response.data.data) {
                const productsData = response.data.data;

                if (Array.isArray(productsData)) {
                    const mappedProducts = productsData.map((item: any) => ({
                        id: item.id,
                        maSanPham: item.id || item.maSanPham || '',
                        tenSanPham: item.tenSanPham || 'Sản phẩm không tên',
                        moTa: item.moTa || '',
                        img: item.img || '',
                        donGia: item.donGia || 0,
                        soLuongTon: item.soLuongTon
                    }));
                    setProducts(mappedProducts);
                } else if (productsData.items && Array.isArray(productsData.items)) {
                    const mappedProducts = productsData.items.map((item: any) => ({
                        id: item.id,
                        maSanPham: item.id || item.maSanPham || '',
                        tenSanPham: item.tenSanPham || 'Sản phẩm không tên',
                        moTa: item.moTa || '',
                        img: item.img || '',
                        donGia: item.donGia || 0,
                        soLuongTon: item.soLuongTon
                    }));
                    setProducts(mappedProducts);
                } else {
                    setError('Không thể tải sản phẩm. Cấu trúc dữ liệu không hợp lệ.');
                }
            } else {
                setError('Không thể tải sản phẩm. Dữ liệu không hợp lệ.');
            }
        } catch (err: any) {
            setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(limit)].map((_, index) => (
                            <div key={`loading-${index}`} className="bg-[#182233] rounded-lg overflow-hidden border border-[#243447] animate-pulse">
                                <div className="h-48 bg-[#1b2a3b]"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-[#1b2a3b] rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-[#1b2a3b] rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
                    <div className="bg-[#182233] rounded-lg border border-[#243447] p-8 text-center">
                        <div className="text-red-400 mb-4">{error}</div>
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
                    <div className="text-center p-8 bg-[#182233] rounded-lg border border-[#243447]">
                        <i className="fas fa-box-open text-gray-400 text-4xl mb-4"></i>
                        <p className="text-gray-300">Không có sản phẩm nào.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <i className="fas fa-star text-yellow-400"></i>
                        {title}
                    </h2>
                    <Link
                        to={category ? `/ecommerce/products?category=${category}` : "/ecommerce/products"}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center bg-[#182233] px-4 py-2 rounded-md border border-[#243447] hover:border-blue-500 transition-colors"
                    >
                        Xem full <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                        {product.soLuongTon !== undefined && product.soLuongTon <= 5 && product.soLuongTon > 0 && (
                                            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                                <i className="fas fa-fire-flame-curved mr-1"></i>
                                                Chỉ còn {product.soLuongTon}
                                            </span>
                                        )}
                                        {product.soLuongTon === 0 && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                <i className="fas fa-times-circle mr-1"></i>
                                                Hết hàng
                                            </span>
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
            </div>
        </div>
    );
} 
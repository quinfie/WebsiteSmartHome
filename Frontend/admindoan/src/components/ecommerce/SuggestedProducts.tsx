import { Link } from 'react-router-dom';
import { SanPhamResponseDto } from '../../types/sanpham';
import { getImagePath, handleImageError } from '../../utils/imageUtils';

interface SuggestedProductsProps {
    title: string;
    products: SanPhamResponseDto[];
    icon?: string;
}

export default function SuggestedProducts({ title, products, icon = 'gift' }: SuggestedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <div className="bg-[#1a2533] rounded-xl shadow-lg border border-[#2d3b4d] p-6 mt-8">
            <div className="flex items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                    <i className={`fas fa-${icon} mr-3 text-blue-400`}></i>
                    {title}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-400/20 to-transparent ml-4"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map(product => (
                    <div
                        key={product.id}
                        className="group bg-[#243447] rounded-lg overflow-hidden shadow-md border border-[#3a4e63] hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                        <Link to={`/ecommerce/product/${product.id}`} className="block w-full h-full">
                            <div className="relative overflow-hidden" style={{ paddingBottom: '100%' /* 1:1 Aspect Ratio */ }}>
                                <img
                                    src={product.img ? getImagePath(product.img) : '/path/to/default/image.png'}
                                    alt={product.tenSanPham}
                                    className="absolute top-0 left-0 w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                                    onError={handleImageError}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                    <span className="text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {product.soLuongTon > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 border-t border-[#3a4e63]">
                                <h4 className="text-sm font-semibold text-white truncate mb-1 group-hover:text-blue-400 transition-colors duration-300">
                                    {product.tenSanPham}
                                </h4>
                                <p className="text-blue-400 text-sm font-bold">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.donGia)}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
} 
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineTag, HiOutlineCash, HiOutlineCollection, HiOutlinePhotograph } from 'react-icons/hi';
import { Sidebar } from '../components';
import { useDanhMuc } from '../contexts/DanhMucContexts';
import { useSanPham } from '../contexts/SanPhamContext';
import { SanPhamResponseDto } from '../types/sanpham';

const CategoryProductsPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const { getById: getDanhMucById } = useDanhMuc();
    const { searchProduct } = useSanPham();

    const [products, setProducts] = useState<SanPhamResponseDto[]>([]);
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Hàm chuyển đổi đường dẫn ảnh từ DB sang đường dẫn thực tế
    const getImagePath = (imgPath: string | null | undefined) => {
        if (!imgPath) return '/placeholder-image.png';

        try {
            // Kiểm tra xem đường dẫn đã có http hoặc https chưa
            if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
                return imgPath;
            }

            // Nếu đường dẫn bắt đầu bằng 'public/'
            if (imgPath.startsWith('public/')) {
                // Đường dẫn tương đối trong src/assets
                return `/src/assets/${imgPath}`;
            }

            // Nếu đường dẫn bắt đầu bằng '/'
            if (imgPath.startsWith('/')) {
                return imgPath;
            }

            return `/src/assets/${imgPath}`;
        } catch (error) {
            console.error("Lỗi khi xử lý đường dẫn ảnh:", error);
            return '/placeholder-image.png';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId) return;

            setLoading(true);
            try {
                // Lấy thông tin danh mục từ API
                const categoryData = await getDanhMucById(categoryId);
                setCategory(categoryData);

                // Tìm sản phẩm theo danh mục
                const result = await searchProduct({
                    maDanhMuc: categoryId,
                    page: 1,
                    pageSize: 100
                });

                setProducts(result.items);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId, getDanhMucById, searchProduct]);

    const handleBackClick = () => {
        navigate(-1); // Quay lại trang trước
    };

    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-whiteSecondary w-full p-6 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleBackClick}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
                    >
                        <HiOutlineArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-white">
                        Sản phẩm của danh mục: {category?.tenDanhMuc || 'Đang tải...'}
                    </h1>
                </div>

                {loading ? (
                    <div className="bg-[#23272F] p-6 rounded-lg shadow-md text-white">
                        Đang tải dữ liệu sản phẩm...
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-[#23272F] p-6 rounded-lg shadow-md text-white">
                        Không có sản phẩm nào trong danh mục này.
                    </div>
                ) : (
                    <div className="bg-[#23272F] p-6 rounded-lg shadow-md overflow-x-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-[#181A20] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                                        {product.img ? (
                                            <img
                                                src={getImagePath(product.img)}
                                                alt={product.tenSanPham}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                                onError={(e) => {
                                                    console.error(`Failed to load image: ${product.img}`);
                                                    (e.target as HTMLImageElement).onerror = null;
                                                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                                <HiOutlinePhotograph size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold text-white mb-2">{product.tenSanPham}</h2>
                                        <p className="text-gray-400 mb-4 text-sm line-clamp-2">{product.moTa}</p>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-1 text-green-400">
                                                <HiOutlineCash />
                                                <span className="font-mono text-lg">{product.donGia?.toLocaleString()}₫</span>
                                            </div>
                                            <div className="text-blue-400 text-sm">
                                                Còn {product.soLuongTon} sản phẩm
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-purple-400 text-sm flex items-center gap-1">
                                                <HiOutlineTag />
                                                <span>Bảo hành {product.thoiGianBaoHanh} tháng</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProductsPage; 
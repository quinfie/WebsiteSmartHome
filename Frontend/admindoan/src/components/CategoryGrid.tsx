import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImagePath, handleImageError } from '../utils/imageUtils';
import api from '../api/axios.config';

interface Category {
    id: string;
    maDanhMuc: string;
    tenDanhMuc: string;
    hinhAnh?: string;
    soLuongSanPham?: number;
}

// Dictionary ánh xạ các từ khóa danh mục tới icon miễn phí của Font Awesome
const CATEGORY_ICONS: Record<string, string> = {
    "camera": "fa-camera",
    "camera an ninh": "fa-video",
    "hub": "fa-network-wired",
    "gateway": "fa-network-wired",
    "đèn": "fa-lightbulb",
    "đen": "fa-lightbulb",
    "light": "fa-lightbulb",
    "sensor": "fa-bell",
    "cảm biến": "fa-bell",
    "cam bien": "fa-bell",
    "khóa": "fa-lock",
    "khoa": "fa-lock",
    "lock": "fa-lock",
    "loa": "fa-volume-high",
    "speaker": "fa-volume-high",
    "điều khiển": "fa-sliders",
    "remote": "fa-sliders",
    "switch": "fa-toggle-on",
    "công tắc": "fa-toggle-on",
    "cong tac": "fa-toggle-on",
    "nhiệt độ": "fa-temperature-high",
    "nhiet do": "fa-temperature-high",
    "giám sát": "fa-shield",
    "giam sat": "fa-shield",
    "ổ cắm": "fa-plug",
    "o cam": "fa-plug",
    "plug": "fa-plug",
    "wifi": "fa-wifi",
    "thermostat": "fa-gauge",
    "default": "fa-house" // Icon mặc định cho nhà thông minh
};

// Hàm lấy icon phù hợp cho danh mục dựa trên tên
const getCategoryIcon = (categoryName: string): string => {
    const lowerCaseName = categoryName.toLowerCase();

    // Tìm từ khóa phù hợp nhất trong tên danh mục
    for (const [keyword, icon] of Object.entries(CATEGORY_ICONS)) {
        if (lowerCaseName.includes(keyword.toLowerCase())) {
            return icon;
        }
    }

    return CATEGORY_ICONS.default;
};

export default function CategoryGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, [retryCount]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/DanhMuc');

            if (response.data && response.data.data) {
                const categoriesWithId = response.data.data.map((category: any) => {
                    const categoryId = category.id || '';
                    return {
                        ...category,
                        id: categoryId,
                        maDanhMuc: categoryId // đảm bảo cả id và maDanhMuc là giống nhau
                    };
                });
                setCategories(categoriesWithId);
            } else {
                setError('Không thể tải danh mục sản phẩm. Dữ liệu không hợp lệ.');
            }
        } catch (err) {
            setError('Không thể tải danh mục sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-6">Danh mục sản phẩm</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <div key={`loading-${index}`} className="bg-[#182233] rounded-lg p-4 animate-pulse">
                                <div className="h-24 bg-[#1b2a3b] rounded-full w-24 mx-auto mb-4"></div>
                                <div className="h-4 bg-[#1b2a3b] rounded w-3/4 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8 bg-[#121e32]">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-6">Danh mục sản phẩm</h2>
                    <div className="bg-[#182233] rounded-lg p-6 text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 bg-[#121e32]">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6">Danh mục sản phẩm</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => {
                        return (
                            <Link
                                key={category.id}
                                to={`/ecommerce/products?category=${category.id}`}
                                className="bg-[#182233] rounded-lg p-4 text-center transition-transform hover:transform hover:scale-105 group border border-[#243447] hover:border-blue-500"
                            >
                                <div className="w-24 h-24 bg-[#1b2a3b] rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                                    {category.hinhAnh ? (
                                        <img
                                            src={getImagePath(category.hinhAnh, 'https://via.placeholder.com/150')}
                                            alt={category.tenDanhMuc}
                                            className="w-full h-full object-cover"
                                            onError={(e) => handleImageError(e, 'https://via.placeholder.com/150')}
                                        />
                                    ) : (
                                        <i className={`fas ${getCategoryIcon(category.tenDanhMuc)} text-3xl text-blue-400`}></i>
                                    )}
                                </div>

                                <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                    {category.tenDanhMuc}
                                </h3>

                                {category.soLuongSanPham !== undefined && (
                                    <p className="text-gray-400 text-sm mt-1">
                                        {category.soLuongSanPham} sản phẩm
                                    </p>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

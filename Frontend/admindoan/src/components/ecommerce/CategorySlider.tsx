import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDanhMuc } from '../../api/danhmuc';
import { DanhMucDto } from '../../types/danhmuc';

export default function CategorySlider() {
    const [categories, setCategories] = useState<DanhMucDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getAllDanhMuc();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-medium mb-5 text-white">Danh mục sản phẩm</h2>
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-medium mb-5 text-white">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/ecommerce/products?category=${category.id}`}
                        className="bg-[#182233] hover:bg-[#243447] transition-colors p-4 rounded-lg shadow border border-gray-700 text-center"
                    >
                        <div className="h-12 w-12 mx-auto bg-[#1b2a3b] rounded-full flex items-center justify-center mb-3">
                            <i className="fas fa-list text-blue-500 text-lg"></i>
                        </div>
                        <h3 className="text-white font-medium truncate text-sm">{category.tenDanhMuc}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanPhamService } from '../../api/sanpham';
import { SanPhamDto } from '../../types/sanpham';
import { getImagePath, handleImageError } from '../../utils/imageUtils';

export default function MainSlider() {
    const [featuredProducts, setFeaturedProducts] = useState<SanPhamDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const response = await sanPhamService.getAll(1, 3);
                setFeaturedProducts(response.items);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredProducts.length));
        }, 5000);

        return () => clearInterval(interval);
    }, [featuredProducts.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="h-80 bg-[#1b2a3b] animate-pulse rounded-lg"></div>
            </div>
        );
    }

    if (featuredProducts.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full" data-carousel="slide">
            {/* Slider controls */}
            <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={prevSlide}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 group-focus:ring-2 group-focus:ring-white group-focus:outline-none">
                    <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={nextSlide}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 group-focus:ring-2 group-focus:ring-white group-focus:outline-none">
                    <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>

            {/* Carousel wrapper */}
            <div className="relative h-80 overflow-hidden rounded-lg bg-[#182233]">
                {featuredProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1723]/80 to-transparent z-10"></div>
                        <div className="absolute inset-0 flex justify-center items-center">
                            <img
                                src={getImagePath(product.img, 'https://via.placeholder.com/1200x400')}
                                className="max-w-full max-h-full object-contain p-8"
                                alt={product.tenSanPham}
                                onError={(e) => handleImageError(e, 'https://via.placeholder.com/1200x400')}
                            />
                        </div>
                        <div className="absolute top-1/2 transform -translate-y-1/2 left-12 z-20 text-white max-w-xl">
                            <h2 className="text-3xl font-bold mb-3">{product.tenSanPham}</h2>
                            <p className="mb-3 text-gray-300 text-base line-clamp-2">{product.moTa || 'Sản phẩm Smart Home chất lượng cao'}</p>
                            <div className="mb-5 text-blue-400 font-bold text-xl">
                                {new Intl.NumberFormat('vi-VN').format(product.donGia)} đ
                            </div>
                            <Link
                                to={`/ecommerce/product/${product.id}`}
                                className="inline-block px-5 py-2.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {featuredProducts.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-2.5 h-2.5 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`}
                        aria-current={currentSlide === index ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => goToSlide(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
} 
import { useState } from 'react';
import { Link } from 'react-router-dom';

const carouselImages = [
    {
        image: 'https://images.unsplash.com/photo-1558002038-1055906df21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        title: 'Smart Home Hub',
        description: 'Điều khiển toàn bộ ngôi nhà của bạn chỉ với một chạm',
        link: '/ecommerce/category/hub'
    },
    {
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        title: 'Camera An Ninh Thông Minh',
        description: 'Giám sát 24/7 với công nghệ AI phát hiện chuyển động',
        link: '/ecommerce/category/camera'
    },
    {
        image: 'https://images.unsplash.com/photo-1560395222-5a0f6aca1bcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
        title: 'Đèn Thông Minh',
        description: 'Tùy chỉnh ánh sáng theo tâm trạng và tiết kiệm năng lượng',
        link: '/ecommerce/category/light'
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
    };

    return (
        <div className="relative bg-[#0f172a] overflow-hidden">
            {/* Main carousel */}
            <div className="relative h-[500px] overflow-hidden">
                {carouselImages.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Background image with overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-60" />
                        </div>

                        {/* Content */}
                        <div className="relative z-20 h-full flex items-center">
                            <div className="container mx-auto px-4">
                                <div className="max-w-xl">
                                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                        {item.title}
                                    </h1>
                                    <p className="text-xl text-gray-200 mb-8">
                                        {item.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Link
                                            to={item.link}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out"
                                        >
                                            Khám phá ngay
                                        </Link>
                                        <Link
                                            to="/ecommerce/category"
                                            className="px-6 py-3 bg-gray-700 bg-opacity-60 hover:bg-opacity-80 text-white font-medium rounded-md transition duration-150 ease-in-out"
                                        >
                                            Xem danh mục
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* Feature cards below the hero */}
            <div className="relative z-20 bg-[#121e32] py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16">
                        <div className="bg-[#182233] rounded-lg p-6 shadow-lg border border-[#243447] transform transition-all hover:-translate-y-2">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-blue-600 bg-opacity-20 rounded-lg mr-4">
                                    <i className="fas fa-shield-alt text-blue-500 text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Bảo hành 12 tháng</h3>
                            </div>
                            <p className="text-gray-300">
                                Tất cả các sản phẩm đều được bảo hành chính hãng và hỗ trợ kỹ thuật 24/7
                            </p>
                        </div>

                        <div className="bg-[#182233] rounded-lg p-6 shadow-lg border border-[#243447] transform transition-all hover:-translate-y-2">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-green-600 bg-opacity-20 rounded-lg mr-4">
                                    <i className="fas fa-shipping-fast text-green-500 text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Giao hàng nhanh</h3>
                            </div>
                            <p className="text-gray-300">
                                Giao hàng miễn phí trong nội thành cho đơn hàng từ 2 triệu đồng
                            </p>
                        </div>

                        <div className="bg-[#182233] rounded-lg p-6 shadow-lg border border-[#243447] transform transition-all hover:-translate-y-2">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-purple-600 bg-opacity-20 rounded-lg mr-4">
                                    <i className="fas fa-tools text-purple-500 text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Lắp đặt tận nơi</h3>
                            </div>
                            <p className="text-gray-300">
                                Đội ngũ kỹ thuật viên chuyên nghiệp lắp đặt tận nhà và hướng dẫn sử dụng
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
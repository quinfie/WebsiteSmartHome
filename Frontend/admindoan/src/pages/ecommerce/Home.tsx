import HeroSection from '../../components/HeroSection';
import ProductGrid from '../../components/ProductGrid';
import smartHomeImg from '@/assets/public/home/image.png'; 


export default function Home() {
    return (
        <div className="bg-[#0f172a] min-h-screen">
            <HeroSection />

            <ProductGrid
                title="Sản phẩm nổi bật"
                limit={8}
            />

            <div className="py-12 bg-[#121e32]">
                <div className="container mx-auto px-4">
                    <div className="bg-[#182233] border border-[#243447] rounded-lg p-8 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-4">Biến ngôi nhà của bạn thành ngôi nhà thông minh</h2>
                                <p className="text-gray-300 mb-6">
                                    Khám phá các giải pháp nhà thông minh tiên tiến giúp cuộc sống thuận tiện, an toàn và tiết kiệm năng lượng hơn.
                                </p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2">
                                    <i className="fas fa-lightbulb"></i>
                                    Tìm hiểu thêm
                                </button>
                            </div>
                            <div className="hidden md:block">
                                <img
                                    src={smartHomeImg}
                                    alt="Smart Home Solutions"
                                    className="rounded-lg w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductGrid
                title="Sản phẩm mới"
                limit={4}
            />

            <div className="py-12 bg-[#121e32]">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white mb-8">Lý do chọn Smart Home</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#182233] p-6 rounded-lg shadow-md border border-[#243447] hover:border-blue-500 transition-colors">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-certificate text-blue-500 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Bảo hành đảm bảo</h3>
                            <p className="text-gray-300">Cam kết chất lượng với bảo hành chính hãng lên đến 24 tháng</p>
                        </div>

                        <div className="bg-[#182233] p-6 rounded-lg shadow-md border border-[#243447] hover:border-blue-500 transition-colors">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-truck-fast text-blue-500 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Giao hàng nhanh</h3>
                            <p className="text-gray-300">Giao hàng miễn phí trong nội thành cho đơn hàng từ 2 triệu đồng</p>
                        </div>

                        <div className="bg-[#182233] p-6 rounded-lg shadow-md border border-[#243447] hover:border-blue-500 transition-colors">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-screwdriver-wrench text-blue-500 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Lắp đặt tận nơi</h3>
                            <p className="text-gray-300">Đội ngũ kỹ thuật viên chuyên nghiệp lắp đặt tận nhà và hướng dẫn sử dụng</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
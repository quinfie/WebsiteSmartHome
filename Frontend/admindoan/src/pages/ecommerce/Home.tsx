import ProductGrid from '../../components/ProductGrid';

export default function Home() {
    return (
        <div className="bg-[#1a2234] min-h-screen">
            {/* Hero Section with Background Image */}
            <div className="relative h-[460px] bg-cover bg-center mt-16" style={{ backgroundImage: 'url("../src/assets/public/home/nhathongminh1.png")' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#1a2234]/80">
                    <div className="container mx-auto px-6 h-full flex items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 drop-shadow-lg">
                                Khám Phá Công Nghệ Nhà Thông Minh
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow">
                                Trải nghiệm cuộc sống hiện đại với các giải pháp thông minh,
                                tiện nghi và an toàn cho ngôi nhà của bạn.
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all shadow-lg hover:shadow-blue-500/20">
                                Khám phá ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products Section */}
            <div className="py-12 bg-[#1e2738]">
                <div className="container mx-auto px-6">
                    <ProductGrid
                        title="Sản phẩm nổi bật"
                        limit={8}
                    />
                </div>
            </div>

            {/* Smart Home Solutions Section */}
            <div className="py-12 bg-[#1a2234]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div className="relative aspect-[4/3] w-full">
                            <img
                                src="../src/assets/public/home/smarthomehub.jpg"
                                alt="Smart Home Hub"
                                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2234] via-transparent to-transparent rounded-2xl"></div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                                Điều Khiển Thông Minh
                            </h2>
                            <p className="text-base md:text-lg text-gray-300 mb-6">
                                Quản lý toàn bộ thiết bị trong nhà chỉ với một ứng dụng.
                                Từ đèn, điều hòa đến camera an ninh - tất cả trong tầm tay bạn.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="bg-[#242e42] p-5 rounded-xl border border-[#2f3b52] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all">
                                    <i className="fas fa-mobile-alt text-blue-400 text-2xl mb-3"></i>
                                    <h3 className="text-white font-semibold mb-2">Điều khiển từ xa</h3>
                                    <p className="text-gray-300 text-sm">Quản lý nhà từ mọi nơi qua điện thoại</p>
                                </div>
                                <div className="bg-[#242e42] p-5 rounded-xl border border-[#2f3b52] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all">
                                    <i className="fas fa-shield-alt text-blue-400 text-2xl mb-3"></i>
                                    <h3 className="text-white font-semibold mb-2">An toàn tuyệt đối</h3>
                                    <p className="text-gray-300 text-sm">Bảo mật cao với mã hóa end-to-end</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Products Section */}
            <div className="py-12 bg-[#1e2738]">
                <div className="container mx-auto px-6">
                    <ProductGrid
                        title="Sản phẩm mới"
                        limit={4}
                    />
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-12 bg-[#1a2234]">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">Giải Pháp Toàn Diện</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#242e42] rounded-xl p-6 border border-[#2f3b52] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all transform hover:-translate-y-1">
                            <div className="relative aspect-[16/9] w-full mb-5">
                                <img
                                    src="../src/assets/public/home/denthongminh.png"
                                    alt="Đèn thông minh"
                                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#242e42] via-transparent to-transparent rounded-lg"></div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Chiếu Sáng Thông Minh</h3>
                            <p className="text-gray-300 text-sm">Tự động điều chỉnh ánh sáng theo thời gian thực và tâm trạng của bạn</p>
                        </div>
                        <div className="bg-[#242e42] rounded-xl p-6 border border-[#2f3b52] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all transform hover:-translate-y-1">
                            <div className="relative aspect-[16/9] w-full mb-5">
                                <img
                                    src="../src/assets/public/home/smarthomecamera.png"
                                    alt="Camera an ninh"
                                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#242e42] via-transparent to-transparent rounded-lg"></div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">An Ninh Thông Minh</h3>
                            <p className="text-gray-300 text-sm">Giám sát 24/7 với camera AI và cảnh báo thông minh</p>
                        </div>
                        <div className="bg-[#242e42] rounded-xl p-6 border border-[#2f3b52] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all transform hover:-translate-y-1">
                            <div className="relative aspect-[16/9] w-full mb-5">
                                <img
                                    src="../src/assets/public/home/image.png"
                                    alt="Điều khiển trung tâm"
                                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#242e42] via-transparent to-transparent rounded-lg"></div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Điều Khiển Trung Tâm</h3>
                            <p className="text-gray-300 text-sm">Tích hợp và điều khiển tất cả thiết bị qua một hub duy nhất</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="py-12 bg-[#1e2738]">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">Lý do chọn Smart Home</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#242e42] p-6 rounded-xl border border-[#2f3b52] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-certificate text-blue-400 text-xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Bảo hành đảm bảo</h3>
                            <p className="text-gray-300 text-sm">Cam kết chất lượng với bảo hành chính hãng lên đến 24 tháng</p>
                        </div>
                        <div className="bg-[#242e42] p-6 rounded-xl border border-[#2f3b52] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-truck-fast text-blue-400 text-xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Giao hàng nhanh</h3>
                            <p className="text-gray-300 text-sm">Giao hàng miễn phí trong nội thành cho đơn hàng từ 2 triệu đồng</p>
                        </div>
                        <div className="bg-[#242e42] p-6 rounded-xl border border-[#2f3b52] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-screwdriver-wrench text-blue-400 text-xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Lắp đặt tận nơi</h3>
                            <p className="text-gray-300 text-sm">Đội ngũ kỹ thuật viên chuyên nghiệp lắp đặt tận nhà và hướng dẫn sử dụng</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.config';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUserDonHang } from '../../api/donhang';

interface LichBaoTri {
    id: string;
    maChiTietDonHang: string;
    tenSanPham?: string;
    ngayBaoTri: string;
    loaiBaoTri: string;
    moTa?: string;
    trangThai: string;
    nguonPhatSinh: string;
    ghiChu?: string;
}

interface ChiTietDonHang {
    id: string;
    maDonHang: string;
    maSanPham: string;
    tenSanPham?: string;
    soLuong: number;
    donGia: number;
}

export default function UserWarrantyPage() {
    const { user, isAuthenticated } = useAuth();
    const [lichBaoTris, setLichBaoTris] = useState<LichBaoTri[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [allChiTietDonHangs, setAllChiTietDonHangs] = useState<ChiTietDonHang[]>([]);

    // Check authentication and user ID
    useEffect(() => {
        // Check authentication from multiple sources
        const token = localStorage.getItem('token');
        const tokenIsAuthenticated = !!token;
        const storedUserId = localStorage.getItem('userId');
        const userInfoString = localStorage.getItem('userInfo');
        let userInfo = null;

        if (userInfoString) {
            try {
                userInfo = JSON.parse(userInfoString);
            } catch (error) {
                console.error('Error parsing userInfo:', error);
            }
        }

        setAuthenticated(isAuthenticated || tokenIsAuthenticated);

        // Get user ID from all possible sources
        if (user?.id) {
            setUserId(user.id);
        } else if (user?.maNguoiDung) {
            setUserId(user.maNguoiDung);
        } else if (storedUserId) {
            setUserId(storedUserId);
        } else if (userInfo?.id) {
            setUserId(userInfo.id);
        } else if (userInfo?.maNguoiDung) {
            setUserId(userInfo.maNguoiDung);
        }
    }, [isAuthenticated, user]);

    // Fetch data when authentication or userId changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenIsAuthenticated = !!token;

        if ((authenticated || tokenIsAuthenticated) && userId) {
            fetchLichBaoTri();
        } else if ((authenticated || tokenIsAuthenticated) && !userId) {
            // Try to get user ID one more time from localStorage
            const userInfoString = localStorage.getItem('userInfo');
            if (userInfoString) {
                try {
                    const userInfo = JSON.parse(userInfoString);
                    const id = userInfo.id || userInfo.maNguoiDung;
                    if (id) {
                        setUserId(id);
                        fetchLichBaoTri(id);
                    } else {
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Error parsing userInfo in second attempt:', error);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [authenticated, userId, currentPage, selectedStatus]);

    const fetchLichBaoTri = async (userIdParam?: string) => {
        try {
            setLoading(true);
            setError('');

            // Use provided userId parameter or the state value
            const currentUserId = userIdParam || userId;

            // First, get all orders for the current user using the working API function
            try {
                const response = await getCurrentUserDonHang();

                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Không thể tải thông tin đơn hàng');
                }

                const donHangs = response.data;

                if (!donHangs || donHangs.length === 0) {
                    setLichBaoTris([]);
                    setLoading(false);
                    return;
                }

                // Process real data
                let allChiTietDonHangs: ChiTietDonHang[] = [];

                // Lấy tất cả chi tiết đơn hàng
                for (const donHang of donHangs) {
                    try {
                        const chiTietResponse = await api.get(`/ChiTietDonHang/don-hang/${donHang.id}`);

                        if (chiTietResponse.data?.data && Array.isArray(chiTietResponse.data.data)) {

                            // Process each order detail to ensure it has tenSanPham
                            const enhancedChiTietDonHangs = await Promise.all(
                                chiTietResponse.data.data.map(async (chiTiet: ChiTietDonHang) => {
                                    if (!chiTiet.tenSanPham && chiTiet.maSanPham) {
                                        try {
                                            const sanPhamResponse = await api.get(`/SanPham/${chiTiet.maSanPham}`);

                                            if (sanPhamResponse?.data?.data?.tenSanPham) {
                                                const productName = sanPhamResponse.data.data.tenSanPham;
                                                return {
                                                    ...chiTiet,
                                                    tenSanPham: productName
                                                };
                                            }
                                        } catch (error) {
                                            console.error(`Không thể lấy thông tin sản phẩm ${chiTiet.maSanPham}:`, error);
                                        }
                                    }
                                    return chiTiet;
                                })
                            );

                            allChiTietDonHangs = [...allChiTietDonHangs, ...enhancedChiTietDonHangs];
                        }
                    } catch (err) {
                        console.error(`Không thể lấy chi tiết đơn hàng ${donHang.id}`, err);
                    }
                }

                // Lấy danh sách ID chi tiết đơn hàng
                const chiTietDonHangIds = allChiTietDonHangs.map(ct => ct.id);

                if (chiTietDonHangIds.length === 0) {
                    setLichBaoTris([]);
                    setLoading(false);
                    return;
                }
                // Lấy lịch bảo trì cho các chi tiết đơn hàng
                const allLichBaoTris: LichBaoTri[] = [];

                for (const chiTietId of chiTietDonHangIds) {
                    try {
                        const lichBaoTriResponse = await api.get(`/lich_bao_tri/chitietdonhang/${chiTietId}`);

                        if (lichBaoTriResponse.data?.data && Array.isArray(lichBaoTriResponse.data.data)) {
                            // Lấy tên sản phẩm từ chi tiết đơn hàng tương ứng
                            const promises = lichBaoTriResponse.data.data.map(async (lbt: any) => {
                                // Convert ID to string for comparison since chiTiet.id is a string but lbt.maChiTietDonHang might be a number
                                const chiTiet = allChiTietDonHangs.find(ct => ct.id === String(lbt.maChiTietDonHang));

                                let tenSanPham = 'Sản phẩm không xác định';

                                if (chiTiet) {
                                    if (chiTiet.tenSanPham) {
                                        tenSanPham = chiTiet.tenSanPham;
                                    } else {
                                        try {
                                            const sanPhamResponse = await api.get(`/SanPham/${chiTiet.maSanPham}`);

                                            if (sanPhamResponse?.data?.data?.tenSanPham) {
                                                const productName = sanPhamResponse.data.data.tenSanPham;
                                                tenSanPham = productName;
                                            } else {
                                            }
                                        } catch (error) {
                                            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
                                        }
                                    }
                                }

                                return {
                                    ...lbt,
                                    tenSanPham
                                };
                            });

                            // Đợi tất cả các promise hoàn thành
                            const lichBaoTriWithProductInfo = await Promise.all(promises);
                            allLichBaoTris.push(...lichBaoTriWithProductInfo);
                        }
                    } catch (err: any) {
                        if (err.response?.status === 403) {
                            console.error(`Lỗi quyền truy cập: Tài khoản không có quyền xem lịch bảo trì cho chi tiết đơn hàng ${chiTietId}`);
                        } else {
                            console.error(`Không thể lấy lịch bảo trì cho chi tiết đơn hàng ${chiTietId}`, err);
                        }
                    }
                }

                // Sắp xếp lịch bảo trì theo ngày mới nhất
                const sortedLichBaoTris = [...allLichBaoTris].sort((a, b) =>
                    new Date(b.ngayBaoTri).getTime() - new Date(a.ngayBaoTri).getTime()
                );

                setLichBaoTris(sortedLichBaoTris);

            } catch (apiError) {
                console.error('Error fetching orders:', apiError);
                setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
            }

        } catch (err) {
            console.error('Global error fetching maintenance data:', err);
            setError('Không thể tải lịch bảo trì. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Lọc lịch bảo trì theo trạng thái và tìm kiếm
    const filteredLichBaoTris = lichBaoTris
        .filter(lbt => selectedStatus ? lbt.trangThai === selectedStatus : true)
        .filter(lbt =>
            searchTerm
                ? lbt.tenSanPham?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lbt.loaiBaoTri.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lbt.trangThai.toLowerCase().includes(searchTerm.toLowerCase())
                : true
        );

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLichBaoTris.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLichBaoTris.length / itemsPerPage);

    // Định dạng ngày tháng
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Lấy màu sắc dựa trên trạng thái
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'đã thông báo':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'chưa thông báo':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Check token directly before rendering login screen
    const token = localStorage.getItem('token');
    const tokenIsAuthenticated = !!token;

    if (!isAuthenticated && !tokenIsAuthenticated) {
        return (
            <div className="bg-[#0f172a] min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <div className="bg-[#182233] rounded-lg p-8 text-center max-w-2xl mx-auto border border-[#243447]">
                        <i className="fas fa-lock text-yellow-500 text-5xl mb-4"></i>
                        <h1 className="text-2xl font-bold text-white mb-4">Đăng nhập để xem lịch bảo trì</h1>
                        <p className="text-gray-300 mb-6">Bạn cần đăng nhập để xem lịch bảo trì của các sản phẩm đã mua.</p>
                        <Link
                            to="/ecommerce/login"
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                        >
                            <i className="fas fa-sign-in-alt mr-2"></i> Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0f172a] min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="mb-6 text-gray-400">
                    <Link to="/ecommerce" className="hover:text-white flex items-center inline-flex">
                        <i className="fas fa-home mr-1"></i> Trang chủ
                    </Link>{' '}
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <span className="text-white">Lịch bảo trì của tôi</span>
                </div>

                {/* Header */}
                <div className="bg-[#182233] border border-[#243447] rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center">
                                <i className="fas fa-tools text-yellow-500 mr-3"></i>
                                Lịch bảo trì của tôi
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Theo dõi lịch bảo trì của các sản phẩm bạn đã mua
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                to="/ecommerce/service-request"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center"
                            >
                                <i className="fas fa-tools mr-2"></i>
                                Yêu cầu dịch vụ
                            </Link>
                            <Link
                                to="/ecommerce/warranty/calendar"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                            >
                                <i className="fas fa-calendar-alt mr-2"></i>
                                Xem lịch
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="bg-[#182233] border border-red-500 rounded-lg p-4 mb-6 text-red-400">
                        <div className="flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* Filters */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-6 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search filter */}
                                <div className="flex-1">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-2">
                                        Tìm kiếm
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="search"
                                            className="block w-full bg-[#1b2a3b] border border-[#243447] rounded-md py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Tìm theo tên sản phẩm, loại bảo trì..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fas fa-search text-gray-500"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Status filter */}
                                <div className="md:w-64">
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-2">
                                        Trạng thái
                                    </label>
                                    <select
                                        id="status"
                                        className="block w-full bg-[#1b2a3b] border border-[#243447] rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="Đã thông báo">Đã thông báo</option>
                                        <option value="Chưa thông báo">Chưa thông báo</option>
                                    </select>
                                </div>

                                {/* Filter stats */}
                                <div className="md:w-auto flex items-end">
                                    <div className="text-sm text-gray-400">
                                        Hiển thị: <span className="text-white font-medium">{filteredLichBaoTris.length}</span> kết quả
                                    </div>
                                </div>
                            </div>

                            {/* Active filters */}
                            {(selectedStatus || searchTerm) && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {selectedStatus && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            Trạng thái: {selectedStatus}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedStatus('')}
                                                className="ml-2 inline-flex text-blue-800 hover:text-blue-900"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </span>
                                    )}
                                    {searchTerm && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            Tìm kiếm: {searchTerm}
                                            <button
                                                type="button"
                                                onClick={() => setSearchTerm('')}
                                                className="ml-2 inline-flex text-blue-800 hover:text-blue-900"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </span>
                                    )}
                                    {(selectedStatus || searchTerm) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedStatus('');
                                                setSearchTerm('');
                                            }}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-400 hover:text-white"
                                        >
                                            <i className="fas fa-times mr-1"></i>
                                            Xóa bộ lọc
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Table content */}
                        {currentItems.length > 0 ? (
                            <div className="bg-[#182233] border border-[#243447] rounded-lg mb-6 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-[#243447]">
                                        <thead className="bg-[#1b2a3b]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Sản phẩm
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Ngày bảo trì
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Loại bảo trì
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Trạng thái
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Nguồn
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#243447]">
                                            {currentItems.map((item) => {
                                                // Try to get product info from allChiTietDonHangs as a fallback
                                                let productInfo = item.tenSanPham || 'Sản phẩm không xác định';
                                                if (productInfo === 'Sản phẩm không xác định' && allChiTietDonHangs.length > 0) {
                                                    const chiTiet = allChiTietDonHangs.find(ct => ct.id === String(item.maChiTietDonHang));
                                                    if (chiTiet?.tenSanPham) {
                                                        productInfo = chiTiet.tenSanPham;
                                                    }
                                                }

                                                return (
                                                    <tr key={item.id} className="hover:bg-[#1b2a3b] transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-md font-medium text-white flex items-center">
                                                                <i className="fas fa-microchip text-blue-400 mr-2"></i>
                                                                {productInfo}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {formatDate(item.ngayBaoTri)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                                                {item.loaiBaoTri}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.trangThai)}`}>
                                                                {item.trangThai}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {item.nguonPhatSinh === 'Tự động'
                                                                ? <span className="flex items-center"><i className="fas fa-robot text-blue-400 mr-1"></i> Tự động</span>
                                                                : <span className="flex items-center"><i className="fas fa-user text-green-400 mr-1"></i> Yêu cầu</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#182233] border border-[#243447] rounded-lg p-12 text-center">
                                <div className="text-yellow-500 text-5xl mb-4">
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">Chưa có lịch bảo trì nào</h3>
                                <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                                    Bạn chưa có lịch bảo trì nào cho sản phẩm đã mua. Các lịch bảo trì sẽ được tạo tự động dựa vào lịch bảo trì của sản phẩm.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Link
                                        to="/ecommerce/products"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                                    >
                                        <i className="fas fa-shopping-cart mr-2"></i> Tiếp tục mua sắm
                                    </Link>
                                    <Link
                                        to="/ecommerce/service-request"
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center"
                                    >
                                        <i className="fas fa-tools mr-2"></i> Yêu cầu dịch vụ
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <nav className="inline-flex rounded-md shadow">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-l-md bg-[#182233] border border-[#243447] text-gray-300 hover:bg-[#1b2a3b] disabled:opacity-50"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page =>
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(page - currentPage) <= 1
                                )
                                .map((page, index, array) => {
                                    const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;

                                    return (
                                        <div key={page} className="flex">
                                            {showEllipsisBefore && (
                                                <span className="px-3 py-2 bg-[#182233] border-t border-b border-[#243447] text-gray-300">
                                                    ...
                                                </span>
                                            )}

                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-2 ${currentPage === page
                                                    ? 'bg-blue-600 text-white border border-blue-600'
                                                    : 'bg-[#182233] text-gray-300 border border-[#243447] hover:bg-[#1b2a3b]'
                                                    } ${index === array.length - 1 && page === totalPages ? 'rounded-r-md' : ''
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </div>
                                    );
                                })
                            }

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-r-md bg-[#182233] border border-[#243447] text-gray-300 hover:bg-[#1b2a3b] disabled:opacity-50"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </nav>
                    </div>
                )}

                {/* Help section */}
                <div className="mt-10 bg-[#182233] border border-[#243447] rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                        Thông tin về bảo trì
                    </h3>
                    <div className="text-gray-300 space-y-3">
                        <p>
                            <i className="fas fa-check-circle text-green-400 mr-2"></i>
                            <strong>Bảo trì định kỳ:</strong> Được tạo tự động theo lịch bảo trì của sản phẩm sau khi bạn mua.
                        </p>
                        <p>
                            <i className="fas fa-check-circle text-green-400 mr-2"></i>
                            <strong>Bảo trì theo yêu cầu:</strong> Được tạo khi bạn gửi yêu cầu dịch vụ bảo trì cho sản phẩm đã mua.
                        </p>
                        <p>
                            <i className="fas fa-check-circle text-green-400 mr-2"></i>
                            <strong>Thông báo:</strong> Bạn sẽ nhận được thông báo qua email khi có lịch bảo trì mới hoặc khi trạng thái lịch bảo trì thay đổi.
                        </p>
                    </div>
                    <div className="mt-4 p-4 bg-[#1b2a3b] rounded-md border border-[#243447]">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                            <i className="fas fa-question-circle text-yellow-400 mr-2"></i>
                            Cần hỗ trợ?
                        </h4>
                        <p className="text-gray-300 mb-3">
                            Nếu bạn có thắc mắc về lịch bảo trì hoặc cần yêu cầu dịch vụ, vui lòng liên hệ với chúng tôi.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/ecommerce/contact"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center justify-center"
                            >
                                <i className="fas fa-envelope mr-2"></i> Liên hệ
                            </Link>
                            <Link
                                to="/ecommerce/service-request"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center justify-center"
                            >
                                <i className="fas fa-tools mr-2"></i> Yêu cầu dịch vụ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
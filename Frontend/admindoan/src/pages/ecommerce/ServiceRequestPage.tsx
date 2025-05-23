import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import * as donhangApi from '../../api/donhang';
import { yeucaudichvuApi } from '../../api/yeucaudichvu';
import { ViewResponseCreateDonHangDto } from '../../types/donhang';
import { CreateYeuCauDichVuDto, YeuCauDichVuKhachHangDto, TrangThaiYeuCau } from '../../types/yeucaudichvu';

interface FormData {
    maChiTietDonHang: number;
    moTa: string;
    ngayHen: string;
}

const TRANG_THAI_YEU_CAU = {
    CHO_XAC_NHAN: "Đang chờ xác nhận" as TrangThaiYeuCau,
    DA_XAC_NHAN: "Đã xác nhận" as TrangThaiYeuCau,
    HOAN_THANH: "Hoàn thành" as TrangThaiYeuCau,
    DA_HUY: "Đã hủy" as TrangThaiYeuCau
};

export default function ServiceRequestPage() {
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<'orders' | 'requests'>('orders');
    const [requests, setRequests] = useState<YeuCauDichVuKhachHangDto[]>([]);
    const [completedOrders, setCompletedOrders] = useState<ViewResponseCreateDonHangDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<ViewResponseCreateDonHangDto | null>(null);
    const [formData, setFormData] = useState<FormData>({
        maChiTietDonHang: 0,
        moTa: '',
        ngayHen: new Date().toISOString().split('T')[0]
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const requestsPromise = fetchRequests();
            const ordersPromise = fetchCompletedOrders();
            await Promise.all([requestsPromise, ordersPromise]);
        } catch (error: any) {
            console.error('Error in fetchData:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await yeucaudichvuApi.getYeuCauCuaToi();

            if (Array.isArray(response)) {
                setRequests(response);
                if (response.length > 0) {
                    setActiveTab('requests');
                }
            } else {
                console.error('Invalid response format:', response);
                setRequests([]);
            }
        } catch (error: any) {
            console.error('Error fetching requests:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data
            });
            const errorMessage = error.response?.data?.message || error.message || 'Không thể tải danh sách yêu cầu dịch vụ';
            toast.error(errorMessage);
            setRequests([]);
        }
    };

    const fetchCompletedOrders = async () => {
        try {
            const response = await donhangApi.getCompletedOrders();
            if (response && Array.isArray(response.data)) {
                setCompletedOrders(response.data);
            } else {
                console.error('Invalid data format received for completed orders:', response);
                setCompletedOrders([]);
            }
        } catch (error: any) {
            console.error('Error fetching completed orders:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Không thể tải danh sách đơn hàng đã hoàn thành';
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleOpenRequestModal = (order: ViewResponseCreateDonHangDto) => {
        setSelectedOrder(order);
        setIsModalOpen(true);

        // Initialize with the first product if available
        const defaultProductId = order.chiTietDonHangs?.[0]?.id ? Number(order.chiTietDonHangs[0].id) : 0;

        setFormData({
            maChiTietDonHang: defaultProductId,
            moTa: '',
            ngayHen: new Date().toISOString().split('T')[0]
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.maChiTietDonHang) {
                toast.error('Vui lòng chọn sản phẩm từ đơn hàng');
                return;
            }

            const createDto: CreateYeuCauDichVuDto = {
                maChiTietDonHang: formData.maChiTietDonHang,
                moTa: formData.moTa.trim(),
                ngayHen: formData.ngayHen
            };

            const result = await yeucaudichvuApi.taoYeuCau(createDto);

            if (result) {
                toast.success('Tạo yêu cầu dịch vụ thành công');
                setIsModalOpen(false);
                setSelectedOrder(null);
                await fetchRequests(); // Refresh the requests list
            }
        } catch (error: any) {
            console.error('Error submitting service request:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo yêu cầu dịch vụ';
            toast.error(errorMessage);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maChiTietDonHang' ? Number(value) : value
        }));
    };

    const getStatusColor = (status: TrangThaiYeuCau): string => {
        switch (status) {
            case TRANG_THAI_YEU_CAU.HOAN_THANH:
                return 'bg-green-100 text-green-800';
            case TRANG_THAI_YEU_CAU.CHO_XAC_NHAN:
                return 'bg-blue-100 text-blue-800';
            case TRANG_THAI_YEU_CAU.DA_XAC_NHAN:
                return 'bg-purple-100 text-purple-800';
            case TRANG_THAI_YEU_CAU.DA_HUY:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!isAuthenticated && !localStorage.getItem('token')) {
        return (
            <div className="bg-[#0f172a] min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <div className="bg-[#182233] rounded-lg p-8 text-center max-w-2xl mx-auto border border-[#243447]">
                        <i className="fas fa-lock text-yellow-500 text-5xl mb-4"></i>
                        <h1 className="text-2xl font-bold text-white mb-4">Đăng nhập để gửi yêu cầu dịch vụ</h1>
                        <p className="text-gray-300 mb-6">Bạn cần đăng nhập để gửi và xem các yêu cầu dịch vụ của mình.</p>
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

    if (loading) {
        return (
            <div className="bg-[#0f172a] min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#0f172a] min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Breadcrumbs */}
                <div className="mb-6 text-gray-400">
                    <Link to="/ecommerce" className="hover:text-white flex items-center inline-flex">
                        <i className="fas fa-home mr-1"></i> Trang chủ
                    </Link>
                    <i className="fas fa-chevron-right text-xs mx-2"></i>
                    <span className="text-white">Yêu cầu dịch vụ</span>
                </div>

                {/* Header */}
                <div className="bg-[#182233] border border-[#243447] rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <i className="fas fa-tools text-yellow-500 mr-4"></i>
                                Yêu cầu dịch vụ
                            </h1>
                            <p className="text-gray-400 mt-3 text-lg">
                                Quản lý các yêu cầu dịch vụ bảo hành và sửa chữa
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 space-x-4">
                    <button
                        className={`flex-1 md:flex-none md:min-w-[200px] px-8 py-3 rounded-t-lg font-medium transition-all duration-200 ${activeTab === 'orders'
                            ? 'bg-[#182233] text-white border-t-2 border-l border-r border-[#243447]'
                            : 'bg-[#1b2a3b] text-gray-400 hover:text-white hover:bg-[#1f2937]'
                            }`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <i className="fas fa-shopping-bag mr-2"></i>
                        Đơn hàng đã hoàn thành
                    </button>
                    <button
                        className={`flex-1 md:flex-none md:min-w-[200px] px-8 py-3 rounded-t-lg font-medium transition-all duration-200 ${activeTab === 'requests'
                            ? 'bg-[#182233] text-white border-t-2 border-l border-r border-[#243447]'
                            : 'bg-[#1b2a3b] text-gray-400 hover:text-white hover:bg-[#1f2937]'
                            }`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <i className="fas fa-tools mr-2"></i>
                        Yêu cầu dịch vụ của tôi
                    </button>
                </div>

                {/* Content */}
                <div className="bg-[#182233] border border-[#243447] rounded-lg overflow-hidden shadow-xl">
                    {activeTab === 'orders' ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#243447]">
                                <thead className="bg-[#1b2a3b]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[15%]">
                                            Mã đơn hàng
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[15%]">
                                            Ngày đặt
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[40%]">
                                            Sản phẩm
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[15%]">
                                            Tổng tiền
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[15%]">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#182233] divide-y divide-[#243447]">
                                    {completedOrders.length > 0 ? (
                                        completedOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-[#1b2a3b] transition-colors">
                                                <td className="px-6 py-5 text-white font-medium">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-5 text-gray-300">
                                                    {new Date(order.ngayDat).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-5 text-gray-300">
                                                    <ul className="space-y-1">
                                                        {order.chiTietDonHangs?.map(item => (
                                                            <li key={item.id} className="flex items-center">
                                                                <span className="w-4 h-4 bg-blue-100 rounded-full mr-2 flex-shrink-0"></span>
                                                                {item.tenSanPham} x {item.soLuong}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="px-6 py-5 text-gray-300 font-medium">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(order.tongTien)}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <button
                                                        onClick={() => handleOpenRequestModal(order)}
                                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 inline-flex items-center justify-center"
                                                    >
                                                        <i className="fas fa-tools mr-2"></i>
                                                        Yêu cầu dịch vụ
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                                <i className="fas fa-box-open text-4xl mb-3"></i>
                                                <p>Chưa có đơn hàng hoàn thành nào</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#243447]">
                                <thead className="bg-[#1b2a3b]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[30%]">
                                            Sản phẩm
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[15%]">
                                            Loại dịch vụ
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[20%]">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[15%]">
                                            Ngày hẹn
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[20%]">
                                            Chi phí
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#182233] divide-y divide-[#243447]">
                                    {requests && requests.length > 0 ? (
                                        requests.map((request, index) => (
                                            <tr key={request.id || index} className="hover:bg-[#1b2a3b] transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="text-white">
                                                        <span className="font-medium">{request.tenSanPham}</span>
                                                        {request.moTa && (
                                                            <p className="text-sm text-gray-400 mt-1">{request.moTa}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full inline-flex items-center ${request.loaiDichVu === 'Bảo hành'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        <i className={`fas fa-${request.loaiDichVu === 'Bảo hành' ? 'shield-alt' : 'wrench'} mr-1.5`}></i>
                                                        {request.loaiDichVu}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(request.trangThaiYeuCau)}`}>
                                                        {request.trangThaiYeuCau}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-white">
                                                    {new Date(request.ngayHen).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-5 text-white">
                                                    {request.chiPhiYeuCau
                                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(request.chiPhiYeuCau)
                                                        : 'Chưa có'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <i className="fas fa-inbox text-4xl mb-3"></i>
                                                    <p className="text-lg">Chưa có yêu cầu dịch vụ nào</p>
                                                    <p className="text-sm mt-1">Bạn có thể tạo yêu cầu dịch vụ từ đơn hàng đã hoàn thành</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Create Request Modal */}
                {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#182233] rounded-lg shadow-xl w-full max-w-2xl border border-[#243447]">
                            <div className="px-8 py-6 border-b border-[#243447] flex justify-between items-center">
                                <h3 className="text-2xl font-semibold text-white flex items-center">
                                    <i className="fas fa-tools text-yellow-500 mr-3"></i>
                                    Tạo yêu cầu dịch vụ mới
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Chọn sản phẩm
                                        </label>
                                        <select
                                            name="maChiTietDonHang"
                                            value={formData.maChiTietDonHang}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-[#1b2a3b] border border-[#243447] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="">-- Chọn sản phẩm --</option>
                                            {selectedOrder.chiTietDonHangs?.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.tenSanPham}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Mô tả
                                        </label>
                                        <textarea
                                            name="moTa"
                                            value={formData.moTa}
                                            onChange={handleInputChange}
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 bg-[#1b2a3b] border border-[#243447] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                            placeholder="Mô tả chi tiết vấn đề của bạn"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Ngày hẹn
                                        </label>
                                        <input
                                            type="date"
                                            name="ngayHen"
                                            value={formData.ngayHen}
                                            onChange={handleInputChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 bg-[#1b2a3b] border border-[#243447] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setSelectedOrder(null);
                                        }}
                                        className="px-6 py-3 border border-[#243447] text-gray-300 rounded-lg hover:bg-[#1b2a3b] transition-colors duration-200 font-medium"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
                                    >
                                        <i className="fas fa-paper-plane mr-2"></i>
                                        Gửi yêu cầu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface NguoiDungData {
    tenNguoiDung: string;
    gioiTinh: string;
    ngaySinh: Date;
    cccd: string;
    sdt: string;
    diaChi: string;
    maTaiKhoan?: string;
}

interface TaiKhoanData {
    email: string;
    tenTaiKhoan: string;
    vaiTro: string;
    trangThai: string;
    maNguoiDung?: string;
}

export default function CustomerProfile() {
    const [userInfo, setUserInfo] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [editMode, setEditMode] = useState(false);
    const { user } = useAuth();

    // Form fields
    const [formData, setFormData] = useState({
        tenNguoiDung: '',
        email: '',
        diaChi: '',
        soDienThoai: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch profile from API
            const profileData = await authService.getProfile();

            let nguoiDungData = null;

            // If user has maNguoiDung, fetch their detailed information
            if (profileData.maNguoiDung || profileData.MaNguoiDung) {
                const maNguoiDung = profileData.maNguoiDung || profileData.MaNguoiDung || '';
                try {
                    nguoiDungData = await authService.getNguoiDungByTaiKhoanId(maNguoiDung);
                } catch (error) {
                    console.error('Error fetching nguoi dung details:', error);
                }
            }

            // Combine data
            const combinedUserInfo = {
                tenTaiKhoan: profileData.tenTaiKhoan,
                email: profileData.email,
                vaiTro: profileData.vaiTro,
                trangThai: profileData.trangThai,
                maNguoiDung: profileData.maNguoiDung || profileData.MaNguoiDung,
                tenNguoiDung: nguoiDungData?.tenNguoiDung || '',
                diaChi: nguoiDungData?.diaChi || '',
                soDienThoai: nguoiDungData?.sdt || '',
                gioiTinh: nguoiDungData?.gioiTinh || '',
                ngaySinh: nguoiDungData?.ngaySinh || null,
                cccd: nguoiDungData?.cccd || ''
            };

            // Set state and form data
            setUserInfo(combinedUserInfo);
            setFormData({
                tenNguoiDung: combinedUserInfo.tenNguoiDung || '',
                email: combinedUserInfo.email || '',
                diaChi: combinedUserInfo.diaChi || '',
                soDienThoai: combinedUserInfo.soDienThoai || ''
            });

            // Update localStorage for consistent UI across the app
            localStorage.setItem('userInfo', JSON.stringify(combinedUserInfo));

        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!userInfo.maNguoiDung) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            // Update nguoiDung information
            const nguoiDungDto = {
                tenNguoiDung: formData.tenNguoiDung,
                gioiTinh: userInfo.gioiTinh || 'Nam',
                ngaySinh: userInfo.ngaySinh || new Date(),
                cccd: userInfo.cccd || '',
                sdt: formData.soDienThoai,
                diaChi: formData.diaChi
            };

            await authService.updateNguoiDung(userInfo.maNguoiDung, nguoiDungDto);

            // Update userInfo state and localStorage
            const updatedUserInfo = {
                ...userInfo,
                tenNguoiDung: formData.tenNguoiDung,
                diaChi: formData.diaChi,
                soDienThoai: formData.soDienThoai
            };

            setUserInfo(updatedUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setSuccess('Cập nhật thông tin thành công');
            setEditMode(false);

            // Refresh profile data
            await fetchUserProfile();
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Lỗi khi cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setError('');
        setSuccess('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('vaiTro');
        navigate('/ecommerce/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#0f172a]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#0f172a] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-white mb-8">Thông tin tài khoản</h1>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}

                    <div className="bg-[#182233] rounded-lg shadow-md overflow-hidden border border-[#243447] mb-8">
                        <div className="p-6 border-b border-[#243447] flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white">
                                Thông tin cá nhân
                            </h2>
                            <button
                                onClick={toggleEditMode}
                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                            >
                                <i className={`fas ${editMode ? 'fa-times' : 'fa-edit'} mr-1`}></i>
                                {editMode ? 'Hủy' : 'Chỉnh sửa'}
                            </button>
                        </div>

                        <div className="p-6">
                            {editMode ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="tenNguoiDung" className="block text-sm font-medium text-gray-300 mb-1">
                                                Họ và tên
                                            </label>
                                            <input
                                                type="text"
                                                id="tenNguoiDung"
                                                name="tenNguoiDung"
                                                value={formData.tenNguoiDung}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-md text-white bg-[#1b2a3b] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-md text-white bg-[#1b2a3b] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="diaChi" className="block text-sm font-medium text-gray-300 mb-1">
                                                Địa chỉ
                                            </label>
                                            <input
                                                type="text"
                                                id="diaChi"
                                                name="diaChi"
                                                value={formData.diaChi}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-md text-white bg-[#1b2a3b] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="soDienThoai" className="block text-sm font-medium text-gray-300 mb-1">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="text"
                                                id="soDienThoai"
                                                name="soDienThoai"
                                                value={formData.soDienThoai}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-md text-white bg-[#1b2a3b] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 rounded-full bg-[#243447] flex items-center justify-center text-blue-300 text-2xl mr-4">
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-white">{userInfo?.tenNguoiDung}</h3>
                                            <p className="text-gray-400">{userInfo?.vaiTro}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 mb-1">Tên đăng nhập</h4>
                                            <p className="text-white">{userInfo?.tenTaiKhoan}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 mb-1">Email</h4>
                                            <p className="text-white">{userInfo?.email}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 mb-1">Địa chỉ</h4>
                                            <p className="text-white">{userInfo?.diaChi || 'Chưa cập nhật'}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 mb-1">Số điện thoại</h4>
                                            <p className="text-white">{userInfo?.soDienThoai || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#243447] pt-4 mt-4">
                                        <button
                                            onClick={handleLogout}
                                            className="text-red-400 hover:text-red-300 flex items-center"
                                        >
                                            <i className="fas fa-sign-out-alt mr-1"></i> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#182233] rounded-lg shadow-md overflow-hidden border border-[#243447]">
                        <div className="p-6 border-b border-[#243447]">
                            <h2 className="text-lg font-semibold text-white">
                                Đơn hàng hôm nay
                            </h2>
                        </div>

                        <div className="p-6">
                            {orders.filter(order => {
                                const orderDate = new Date(order.ngayDat);
                                const today = new Date();
                                return orderDate.toDateString() === today.toDateString();
                            }).length === 0 ? (
                                <div className="text-center py-8">
                                    <i className="fas fa-box-open text-gray-400 text-4xl mb-3"></i>
                                    <p className="text-gray-300">Chưa có đơn hàng nào trong ngày hôm nay</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-[#243447]">
                                        <thead className="bg-[#1b2a3b]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Mã đơn hàng
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Thời gian đặt
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Tổng tiền
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Trạng thái
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#243447]">
                                            {orders.filter(order => {
                                                const orderDate = new Date(order.ngayDat);
                                                const today = new Date();
                                                return orderDate.toDateString() === today.toDateString();
                                            }).map((order) => (
                                                <tr key={order.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                        {order.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {new Date(order.ngayDat).toLocaleTimeString('vi-VN')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongTien)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.trangThai === 'Đã giao hàng'
                                                            ? 'bg-green-900/30 text-green-400'
                                                            : order.trangThai === 'Đang xử lý'
                                                                ? 'bg-yellow-900/30 text-yellow-400'
                                                                : 'bg-blue-900/30 text-blue-400'
                                                            }`}>
                                                            {order.trangThai}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => navigate(`/ecommerce/orders/${order.id}`)} className="text-blue-400 hover:text-blue-300">
                                                            Chi tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => navigate('/ecommerce/orders')}
                                    className="inline-flex items-center text-blue-400 hover:text-blue-300"
                                >
                                    Xem tất cả đơn hàng
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth';
import { getCurrentUserDonHang } from '../../api/donhang';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { nguoiDungService } from '../../api/nguoiDungApi';
import { NguoiDungUpdateDto } from '../../types/nguoidung';
import ChangePasswordForm from '../../components/ChangePasswordForm';

interface NguoiDungData {
    tenNguoiDung: string;
    gioiTinh: string;
    ngaySinh: string;
    cccd: string;
    soDienThoai: string;
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
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [editForm, setEditForm] = useState<NguoiDungUpdateDto>({
        tenNguoiDung: '',
        gioiTinh: '',
        ngaySinh: new Date(),
        cccd: '',
        sdt: '',
        diaChi: ''
    });
    const { user } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        fetchUserOrders();
    }, []);

    useEffect(() => {
        if (userInfo) {
            setEditForm({
                tenNguoiDung: userInfo.tenNguoiDung || '',
                gioiTinh: userInfo.gioiTinh || '',
                ngaySinh: userInfo.ngaySinh ? new Date(userInfo.ngaySinh) : new Date(),
                cccd: userInfo.cccd || '',
                sdt: userInfo.soDienThoai || '',
                diaChi: userInfo.diaChi || ''
            });
        }
    }, [userInfo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm(prev => ({
            ...prev,
            ngaySinh: new Date(e.target.value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!userInfo?.maNguoiDung) {
                throw new Error('Không tìm thấy mã người dùng');
            }

            // Validate required fields
            if (!editForm.sdt?.trim()) {
                toast.error('Số điện thoại không được để trống');
                return;
            }

            if (!editForm.tenNguoiDung?.trim()) {
                toast.error('Họ tên không được để trống');
                return;
            }

            if (!editForm.gioiTinh?.trim()) {
                toast.error('Vui lòng chọn giới tính');
                return;
            }

            if (!editForm.diaChi?.trim()) {
                toast.error('Địa chỉ không được để trống');
                return;
            }

            if (!editForm.cccd?.trim()) {
                toast.error('CCCD/CMND không được để trống');
                return;
            }

            // Format data to match backend expectations exactly
            const formattedData = {
                tenNguoiDung: editForm.tenNguoiDung.trim(),
                gioiTinh: editForm.gioiTinh.trim(),
                ngaySinh: editForm.ngaySinh,
                cccd: editForm.cccd.trim(),
                sdt: editForm.sdt.trim(),
                diaChi: editForm.diaChi.trim()
            };

            console.log('Sending data to backend:', formattedData);
            await nguoiDungService.update(userInfo.maNguoiDung, formattedData);
            toast.success('Cập nhật thông tin thành công');
            setIsEditing(false);
            fetchUserProfile(); // Refresh data
        } catch (err: any) {
            console.error('Error updating profile:', err);
            toast.error(err.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        }
    };

    const fetchUserOrders = async () => {
        try {
            setLoadingOrders(true);
            const response = await getCurrentUserDonHang();
            if (response.success) {
                setOrders(response.data);
            } else {
                console.error('Error fetching orders:', response.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoadingOrders(false);
        }
    };

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
                soDienThoai: nguoiDungData?.soDienThoai || '',
                gioiTinh: nguoiDungData?.gioiTinh || '',
                ngaySinh: nguoiDungData?.ngaySinh || null,
                cccd: nguoiDungData?.cccd || '',
                ngayTao: profileData.ngayTao || null,
            };

            setUserInfo(combinedUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(combinedUserInfo));

        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
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
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
                        <i className="fas fa-user-circle text-blue-500 mr-3"></i>
                        Thông tin tài khoản
                    </h1>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#182233] rounded-lg shadow-md overflow-hidden border border-[#243447]">
                                <div className="p-6 text-center">
                                    <div className="w-32 h-32 rounded-full bg-[#243447] flex items-center justify-center text-blue-300 text-5xl mx-auto mb-4">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <h2 className="text-xl font-semibold text-white mb-2">
                                        {userInfo?.tenNguoiDung || 'Chưa cập nhật'}
                                    </h2>
                                    <p className="text-blue-400 mb-4">{userInfo?.vaiTro}</p>
                                    <div className="flex justify-center space-x-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userInfo?.trangThai === 'Hoạt động'
                                            ? 'bg-green-900/30 text-green-400'
                                            : 'bg-red-900/30 text-red-400'
                                            }`}>
                                            <i className={`fas fa-circle text-xs mr-2 ${userInfo?.trangThai === 'Hoạt động'
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                                }`}></i>
                                            {userInfo?.trangThai || 'Chưa xác định'}
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t border-[#243447] p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Email</p>
                                            <p className="text-white">{userInfo?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Số điện thoại</p>
                                            <p className="text-white">{userInfo?.soDienThoai || 'Chưa cập nhật'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Ngày tham gia</p>
                                            <p className="text-white">
                                                {userInfo?.ngayTao
                                                    ? new Date(userInfo.ngayTao).toLocaleDateString('vi-VN')
                                                    : 'Chưa cập nhật'
                                                }
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowChangePassword(true)}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-colors"
                                        >
                                            <i className="fas fa-key mr-2"></i>
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                </div>
                                <div className="border-t border-[#243447] p-6">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
                                    >
                                        <i className="fas fa-sign-out-alt mr-2"></i>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {showChangePassword ? (
                                <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
                            ) : (
                                <>
                                    {/* Personal Information */}
                                    <div className="bg-[#182233] rounded-lg shadow-md overflow-hidden border border-[#243447] mb-6">
                                        <div className="p-6 border-b border-[#243447] flex justify-between items-center">
                                            <h2 className="text-lg font-semibold text-white flex items-center">
                                                <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                                                Thông tin chi tiết
                                            </h2>
                                            <button
                                                onClick={() => setIsEditing(!isEditing)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                                            >
                                                <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
                                                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                                            </button>
                                        </div>
                                        <div className="p-6">
                                            {isEditing ? (
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                                Họ và tên
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="tenNguoiDung"
                                                                value={editForm.tenNguoiDung}
                                                                onChange={handleInputChange}
                                                                className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                                Giới tính
                                                            </label>
                                                            <select
                                                                name="gioiTinh"
                                                                value={editForm.gioiTinh}
                                                                onChange={handleInputChange}
                                                                className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                                required
                                                            >
                                                                <option value="">Chọn giới tính</option>
                                                                <option value="Nam">Nam</option>
                                                                <option value="Nữ">Nữ</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                                Ngày sinh
                                                            </label>
                                                            <input
                                                                type="date"
                                                                name="ngaySinh"
                                                                value={editForm.ngaySinh?.toISOString().split('T')[0]}
                                                                onChange={handleDateChange}
                                                                className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                                CCCD/CMND
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="cccd"
                                                                value={editForm.cccd}
                                                                onChange={handleInputChange}
                                                                className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                                Số điện thoại
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                name="Số điện thoại"
                                                                value={editForm.sdt}
                                                                onChange={handleInputChange}
                                                                className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                                Địa chỉ
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="diaChi"
                                                                value={editForm.diaChi}
                                                                onChange={handleInputChange}
                                                                className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end space-x-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditing(false)}
                                                            className="px-4 py-2 bg-gray-500/10 text-gray-400 rounded-md hover:bg-gray-500/20 transition-colors"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-colors"
                                                        >
                                                            Lưu thay đổi
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-400 mb-1">Họ và tên</h4>
                                                        <p className="text-white">{userInfo?.tenNguoiDung || 'Chưa cập nhật'}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-400 mb-1">Giới tính</h4>
                                                        <p className="text-white">{userInfo?.gioiTinh || 'Chưa cập nhật'}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-400 mb-1">Ngày sinh</h4>
                                                        <p className="text-white">
                                                            {userInfo?.ngaySinh
                                                                ? new Date(userInfo.ngaySinh).toLocaleDateString('vi-VN')
                                                                : 'Chưa cập nhật'
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-400 mb-1">CCCD/CMND</h4>
                                                        <p className="text-white">{userInfo?.cccd || 'Chưa cập nhật'}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-400 mb-1">Số điện thoại</h4>
                                                        <p className="text-white">{userInfo?.soDienThoai || 'Chưa cập nhật'}</p>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <h4 className="text-sm font-medium text-gray-400 mb-1">Địa chỉ</h4>
                                                        <p className="text-white">{userInfo?.diaChi || 'Chưa cập nhật'}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Recent Orders */}
                                    <div className="bg-[#182233] rounded-lg shadow-md overflow-hidden border border-[#243447]">
                                        <div className="p-6 border-b border-[#243447] flex justify-between items-center">
                                            <h2 className="text-lg font-semibold text-white flex items-center">
                                                <i className="fas fa-shopping-bag text-blue-400 mr-2"></i>
                                                Đơn hàng hôm nay
                                            </h2>
                                            <button
                                                onClick={() => navigate('/ecommerce/orders')}
                                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                                            >
                                                Xem tất cả
                                                <i className="fas fa-arrow-right ml-2"></i>
                                            </button>
                                        </div>

                                        <div className="p-6">
                                            {loadingOrders ? (
                                                <div className="text-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                                    <p className="text-gray-300 mt-2">Đang tải đơn hàng...</p>
                                                </div>
                                            ) : orders.filter(order => {
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
                                                                <tr key={order.id} className="hover:bg-[#1b2a3b] transition-colors">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                        {new Date(order.ngayDat).toLocaleTimeString('vi-VN')}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongTien)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.trangThaiDonHang === 'Đã giao hàng'
                                                                            ? 'bg-green-900/30 text-green-400'
                                                                            : order.trangThaiDonHang === 'Đang xử lý'
                                                                                ? 'bg-yellow-900/30 text-yellow-400'
                                                                                : 'bg-blue-900/30 text-blue-400'
                                                                            }`}>
                                                                            {order.trangThaiDonHang}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <button
                                                                            onClick={() => navigate(`/ecommerce/orders/${order.id}`)}
                                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                                        >
                                                                            Chi tiết
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
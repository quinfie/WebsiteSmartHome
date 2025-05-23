import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/auth';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        tenTaiKhoan: '',
        matKhau: '',
        xacNhanMatKhau: '',
        tenNguoiDung: '',
        gioiTinh: 'Nam',
        ngaySinh: '',
        cccd: '',
        sdt: '',
        diaChi: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra mật khẩu khớp nhau
        if (formData.matKhau !== formData.xacNhanMatKhau) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ');
            return;
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.sdt)) {
            setError('Số điện thoại không hợp lệ (phải có 10 chữ số)');
            return;
        }

        // Kiểm tra CCCD
        const cccdRegex = /^[0-9]{12}$/;
        if (!cccdRegex.test(formData.cccd)) {
            setError('CCCD không hợp lệ (phải có 12 chữ số)');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.register({
                ...formData,
                vaiTro: 'Khách Hàng', // Đặt vai trò mặc định là Khách Hàng
                trangThai: 'Hoạt động', // Mặc định trạng thái là Hoạt động
                ngaySinh: new Date(formData.ngaySinh)
            });

            // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
            navigate('/ecommerce/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
        } catch (err: any) {
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Đăng ký tài khoản
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Hoặc{' '}
                        <Link to="/ecommerce/login" className="font-medium text-green-600 hover:text-green-500">
                            đăng nhập nếu đã có tài khoản
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thông tin tài khoản */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Thông tin tài khoản</h3>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="tenTaiKhoan" className="block text-sm font-medium text-gray-700">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    name="tenTaiKhoan"
                                    id="tenTaiKhoan"
                                    value={formData.tenTaiKhoan}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="matKhau" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="matKhau"
                                    id="matKhau"
                                    value={formData.matKhau}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="xacNhanMatKhau" className="block text-sm font-medium text-gray-700">
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="xacNhanMatKhau"
                                    id="xacNhanMatKhau"
                                    value={formData.xacNhanMatKhau}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Thông tin cá nhân */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>

                            <div>
                                <label htmlFor="tenNguoiDung" className="block text-sm font-medium text-gray-700">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    name="tenNguoiDung"
                                    id="tenNguoiDung"
                                    value={formData.tenNguoiDung}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="gioiTinh" className="block text-sm font-medium text-gray-700">
                                    Giới tính
                                </label>
                                <select
                                    name="gioiTinh"
                                    id="gioiTinh"
                                    value={formData.gioiTinh}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="ngaySinh" className="block text-sm font-medium text-gray-700">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    name="ngaySinh"
                                    id="ngaySinh"
                                    value={formData.ngaySinh}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="cccd" className="block text-sm font-medium text-gray-700">
                                    CCCD/CMND
                                </label>
                                <input
                                    type="text"
                                    name="cccd"
                                    id="cccd"
                                    value={formData.cccd}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="sdt" className="block text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="sdt"
                                    id="sdt"
                                    value={formData.sdt}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="diaChi" className="block text-sm font-medium text-gray-700">
                            Địa chỉ
                        </label>
                        <textarea
                            name="diaChi"
                            id="diaChi"
                            rows={3}
                            value={formData.diaChi}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                            Tôi đồng ý với <a href="#" className="text-green-600 hover:text-green-500">Điều khoản dịch vụ</a> và <a href="#" className="text-green-600 hover:text-green-500">Chính sách bảo mật</a>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
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
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        // Kiểm tra mật khẩu khớp nhau
        if (formData.matKhau !== formData.xacNhanMatKhau) {
            setError('Mật khẩu xác nhận không khớp');
            return false;
        }

        // Kiểm tra độ dài mật khẩu
        if (formData.matKhau.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự');
            return false;
        }

        // Kiểm tra độ dài tên đăng nhập
        if (formData.tenTaiKhoan.length < 3) {
            setError('Tên đăng nhập phải có ít nhất 3 ký tự');
            return false;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ');
            return false;
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.sdt)) {
            setError('Số điện thoại không hợp lệ (phải có 10 chữ số)');
            return false;
        }

        // Kiểm tra CCCD
        const cccdRegex = /^[0-9]{12}$/;
        if (!cccdRegex.test(formData.cccd)) {
            setError('CCCD không hợp lệ (phải có 12 chữ số)');
            return false;
        }

        // Kiểm tra tuổi
        const birthDate = new Date(formData.ngaySinh);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setError('Bạn phải đủ 18 tuổi để đăng ký tài khoản');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await authService.register({
                ...formData,
                vaiTro: 'KhachHang', // Thay đổi từ 'Khách Hàng' thành 'KhachHang'
                trangThai: 'ChoXacMinh', // Thay đổi từ 'Chờ xác minh' thành 'ChoXacMinh'
                ngaySinh: new Date(formData.ngaySinh)
            });

            setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản của bạn.');

            // Chuyển hướng đến trang đăng nhập sau 5 giây
            setTimeout(() => {
                navigate('/ecommerce/login', {
                    state: {
                        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản của bạn.'
                    }
                });
            }, 5000);
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
                    <div className="mt-4 text-sm text-gray-600 space-y-2">
                        <p>Sau khi đăng ký, bạn cần xác thực email để kích hoạt tài khoản</p>
                        <p>Yêu cầu mật khẩu: Ít nhất 8 ký tự</p>
                        <p>Yêu cầu độ tuổi: Từ 18 tuổi trở lên</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{success}</span>
                        <div className="mt-2 text-sm text-gray-600">
                            Nếu không nhận được email, hãy kiểm tra thư mục <b>Spam</b> hoặc thử lại sau vài phút.<br />
                            <button
                                type="button"
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={async () => {
                                    setIsLoading(true);
                                    setError("");
                                    try {
                                        await authService.resendVerificationEmail(formData.email);
                                        setSuccess("Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư của bạn.");
                                    } catch (err: any) {
                                        setError(err.message || "Gửi lại email xác thực thất bại. Vui lòng thử lại sau.");
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={isLoading}
                            >
                                Gửi lại email xác thực
                            </button>
                        </div>
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
                                    minLength={3}
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
                                    minLength={8}
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
                                    minLength={8}
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
                                    required
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
                                    CCCD
                                </label>
                                <input
                                    type="text"
                                    name="cccd"
                                    id="cccd"
                                    value={formData.cccd}
                                    onChange={handleChange}
                                    required
                                    maxLength={12}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="sdt" className="block text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    name="sdt"
                                    id="sdt"
                                    value={formData.sdt}
                                    onChange={handleChange}
                                    required
                                    maxLength={10}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="diaChi" className="block text-sm font-medium text-gray-700">
                                    Địa chỉ
                                </label>
                                <textarea
                                    name="diaChi"
                                    id="diaChi"
                                    value={formData.diaChi}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    Đang xử lý...
                                </div>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
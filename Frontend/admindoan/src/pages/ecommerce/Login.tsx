import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // This function lets admin users bypass the redirect and use the admin login directly
    const goToAdminLogin = () => {
        // Store a flag to bypass the redirect in the main Login component
        sessionStorage.setItem('useAdminLogin', 'true');
        navigate('/dashboard');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ thông tin đăng nhập');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Đăng nhập với AuthContext để cập nhật context toàn cục
            await login(username, password);

            // Kiểm tra token trong localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Đăng nhập thất bại: Không nhận được token');
            }

            // Lấy vai trò từ localStorage - đây là cách giống EcommerceLayout
            let userRole = localStorage.getItem('vaiTro');

            // Lấy thông tin chi tiết người dùng từ API
            const profileData = await authService.getProfile();
            console.log('Profile data:', profileData);

            // Kiểm tra trạng thái tài khoản
            if (profileData.trangThai === 'Chờ xác minh') {
                throw new Error('Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản.');
            }

            if (profileData.trangThai === 'Bị khóa') {
                throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với chúng tôi để được hỗ trợ.');
            }

            // Nếu vaiTro chưa được lưu hoặc không lấy được từ localStorage, lấy từ profile
            if (!userRole && profileData.vaiTro) {
                userRole = profileData.vaiTro;
                // Lưu vai trò vào localStorage để dùng sau này
                localStorage.setItem('vaiTro', userRole);
            }

            // Nếu vẫn không có vai trò, mặc định là Khách hàng
            if (!userRole) {
                userRole = 'Khách hàng';
                localStorage.setItem('vaiTro', userRole);
            }

            // Chuẩn bị dữ liệu người dùng để lưu vào localStorage
            const userInfo = {
                tenTaiKhoan: profileData.tenTaiKhoan,
                email: profileData.email,
                vaiTro: userRole,
                trangThai: profileData.trangThai,
                maNguoiDung: profileData.maNguoiDung || profileData.MaNguoiDung
            };

            // Nếu có mã người dùng, lấy thông tin chi tiết người dùng
            if (userInfo.maNguoiDung) {
                try {
                    const nguoiDungData = await authService.getNguoiDungByTaiKhoanId(userInfo.maNguoiDung);

                    // Bổ sung thông tin người dùng
                    Object.assign(userInfo, {
                        tenNguoiDung: nguoiDungData.tenNguoiDung,
                        gioiTinh: nguoiDungData.gioiTinh,
                        ngaySinh: nguoiDungData.ngaySinh,
                        cccd: nguoiDungData.cccd,
                        soDienThoai: nguoiDungData.sdt,
                        diaChi: nguoiDungData.diaChi
                    });
                } catch (err) {
                    console.error('Không thể lấy thông tin chi tiết người dùng:', err);
                }
            }

            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            console.log('User info saved:', userInfo);

            // Kiểm tra vai trò người dùng và chuyển hướng tương ứng
            const staffRoles = ['Quản Trị Viên', 'Quản Lí', 'Nhân Viên'];
            if (staffRoles.includes(userRole)) {
                // Sử dụng navigate thay vì window.location để giữ state của ứng dụng
                navigate('/dashboard');
            } else {
                // Nếu có url được lưu trước đó, chuyển về url đó
                const from = location.state?.from?.pathname || '/ecommerce';
                navigate(from);
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[#182233] p-10 rounded-xl shadow-md border border-[#243447]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Đăng nhập tài khoản
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-300">
                        Hoặc{' '}
                        <Link to="/ecommerce/register" className="font-medium text-blue-400 hover:text-blue-300">
                            đăng ký tài khoản mới
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Tên đăng nhập</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-[#1b2a3b] rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Tên đăng nhập"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Mật khẩu</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-[#1b2a3b] rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-[#1b2a3b]"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/ecommerce/forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${isLoading ? 'bg-blue-600/50' : 'bg-blue-600 hover:bg-blue-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {isLoading ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            ) : (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <i className="fas fa-sign-in-alt text-blue-400 group-hover:text-blue-300" aria-hidden="true"></i>
                                </span>
                            )}
                            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
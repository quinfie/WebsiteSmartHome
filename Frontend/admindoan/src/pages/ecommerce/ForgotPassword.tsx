import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../api/auth';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Vui lòng nhập địa chỉ email');
            return;
        }

        setIsLoading(true);
        try {
            await authService.forgotPassword({ email });
            setIsSuccess(true);
            toast.success('Vui lòng kiểm tra email của bạn để nhận mật khẩu mới');
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[#182233] p-10 rounded-xl shadow-md border border-[#243447]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Quên mật khẩu
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-300">
                        Nhập email của bạn để nhận mật khẩu mới
                    </p>
                </div>

                {isSuccess ? (
                    <div className="text-center">
                        <div className="bg-blue-900/30 border border-blue-500 text-blue-300 px-4 py-3 rounded mb-4">
                            <p>Chúng tôi đã gửi mật khẩu mới đến email của bạn.</p>
                            <p className="mt-2">Vui lòng kiểm tra hộp thư của bạn (bao gồm thư mục spam).</p>
                        </div>
                        <Link
                            to="/ecommerce/login"
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Quay lại đăng nhập
                        </Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-[#1b2a3b] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập địa chỉ email"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Link
                                to="/ecommerce/login"
                                className="text-sm font-medium text-blue-400 hover:text-blue-300"
                            >
                                Quay lại đăng nhập
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                            ${isLoading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {isLoading ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                </span>
                            ) : null}
                            {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
} 
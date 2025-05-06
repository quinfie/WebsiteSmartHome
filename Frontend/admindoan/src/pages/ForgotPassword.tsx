import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await forgotPassword(email);
            setMessage('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setMessage('Không tìm thấy tài khoản với email này');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Quên mật khẩu
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                            {message && (
                                <div className={`mb-4 p-4 rounded-md ${message.includes('kiểm tra') ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <p className={`text-sm ${message.includes('kiểm tra') ? 'text-green-800' : 'text-red-800'}`}>
                                        {message}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>

                            <div className="mt-5">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                    {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 
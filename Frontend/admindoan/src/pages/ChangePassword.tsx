import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ChangePassword: React.FC = () => {
    const { changePassword } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        try {
            await changePassword(formData.currentPassword, formData.newPassword);
            setMessage('Đổi mật khẩu thành công');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setMessage('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Đổi mật khẩu
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                            {message && (
                                <div className={`mb-4 p-4 rounded-md ${message.includes('thành công') ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <p className={`text-sm ${message.includes('thành công') ? 'text-green-800' : 'text-red-800'}`}>
                                        {message}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                        Mật khẩu hiện tại
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        id="currentPassword"
                                        required
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        required
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="mt-5">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword; 
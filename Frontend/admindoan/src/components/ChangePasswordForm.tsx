import { useState } from 'react';
import { authService } from '../api/auth';
import { toast } from 'react-hot-toast';
import { ChangePasswordDto } from '../types/auth';

interface ChangePasswordFormProps {
    onClose: () => void;
}

export default function ChangePasswordForm({ onClose }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới không khớp');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
            return;
        }

        try {
            setIsLoading(true);
            const data: ChangePasswordDto = {
                currentPassword,
                newPassword,
                confirmPassword
            };

            const success = await authService.changePassword(data);
            if (success) {
                toast.success('Đổi mật khẩu thành công');
                onClose();
            } else {
                toast.error('Đổi mật khẩu thất bại');
            }
        } catch (error: any) {
            console.error('Change password error:', error);
            toast.error(error.message || 'Đổi mật khẩu thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#182233] rounded-lg shadow-md overflow-hidden border border-[#243447] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <i className="fas fa-key text-blue-400 mr-2"></i>
                Đổi mật khẩu
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Mật khẩu hiện tại
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                        minLength={8}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#1b2a3b] border border-[#243447] rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500/10 text-gray-400 rounded-md hover:bg-gray-500/20 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-colors
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                </div>
            </form>
        </div>
    );
} 
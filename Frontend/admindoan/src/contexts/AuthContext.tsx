import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponseDto, TaiKhoanDto, UpdateTaiKhoanDto, UpdateNguoiDungDto } from '../types/auth';
import { authService } from '../api/auth';

interface AuthContextType {
    user: TaiKhoanDto | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    updateProfile: (taiKhoanData: UpdateTaiKhoanDto, nguoiDungData: UpdateNguoiDungDto) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hàm giải mã token để lấy id tài khoản
function getUserIdFromToken(token: string): string | null {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.nameid || payload.nameidentifier || payload.sub || null;
    } catch {
        return null;
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<TaiKhoanDto | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const profile = await authService.getProfile();
            if (!profile) {
                throw new Error('Không tìm thấy thông tin tài khoản');
            }

            const vaiTro = profile.vaiTro || localStorage.getItem('vaiTro') || 'Khách hàng';
            const maNguoiDung = profile.maNguoiDung ?? profile.MaNguoiDung ?? '';
            const token = localStorage.getItem('token');
            const id = getUserIdFromToken(token || '');

            let nguoiDung = null;
            if (maNguoiDung) {
                try {
                    nguoiDung = await authService.getNguoiDungByTaiKhoanId(maNguoiDung);
                } catch (err) {
                    // Đã xóa log
                }
            }

            setUser({
                ...profile,
                id: id || '',
                maNguoiDung,
                vaiTro,
                nguoiDung,
            });
            setIsAuthenticated(true);
        } catch (error) {
            alert('Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại.');
            logout();
        }
    };

    const login = async (username: string, password: string) => {
        const response = await authService.login({ username, password });
        setToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('vaiTro', response.vaiTro);
        await fetchProfile();
        setIsAuthenticated(true);
    };

    const register = async (data: any) => {
        const response = await authService.register(data);
        setToken(response.token);
        localStorage.setItem('token', response.token);
        await fetchProfile();
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    const updateProfile = async (taiKhoanData: UpdateTaiKhoanDto, nguoiDungData: UpdateNguoiDungDto) => {
        const token = localStorage.getItem('token');
        const id = getUserIdFromToken(token || '');
        if (!id || !user) {
            throw new Error('Không tìm thấy thông tin tài khoản');
        }

        try {
            // Cập nhật tài khoản trước
            await authService.updateTaiKhoan(id, taiKhoanData);

            // Sau đó cập nhật thông tin người dùng
            if (user.maNguoiDung) {
                await authService.updateNguoiDung(user.maNguoiDung, nguoiDungData);
            }

            // Cuối cùng cập nhật lại thông tin profile
            await fetchProfile();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Cập nhật thông tin thất bại';
            throw new Error(errorMessage);
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        await authService.changePassword({ matKhauCu: currentPassword, matKhauMoi: newPassword });
    };

    const forgotPassword = async (email: string) => {
        await authService.forgotPassword({ email });
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            login,
            register,
            logout,
            updateProfile,
            changePassword,
            forgotPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 
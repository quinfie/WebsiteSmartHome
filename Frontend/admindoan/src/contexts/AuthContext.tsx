import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthResponseDto,
  TaiKhoanDto,
  UpdateTaiKhoanDto,
  UpdateNguoiDungDto
} from '../types/auth';
import { authService } from '../api/auth';

interface AuthContextType {
  user: TaiKhoanDto | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (
    taiKhoanData: UpdateTaiKhoanDto,
    nguoiDungData: UpdateNguoiDungDto
  ) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserIdFromToken(token: string): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.nameid || payload.sub || null;
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
      const userId = getUserIdFromToken(token || '');

      let vaiTro = profile.vaiTro || localStorage.getItem('vaiTro') || 'Khách hàng';

      localStorage.setItem('vaiTro', vaiTro);

      const maNguoiDung = profile.maNguoiDung ?? '';

      let nguoiDung = null;
      if (maNguoiDung) {
        try {
          nguoiDung = await authService.getNguoiDungByTaiKhoanId(maNguoiDung);
        } catch (err) {
          console.error('Không thể lấy thông tin người dùng:', err);
        }
      }

      setUser({
        ...profile,
        id: userId || '',
        maNguoiDung,
        vaiTro,
        nguoiDung,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại.');
      logout();
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });

      setToken(response.token);
      localStorage.setItem('token', response.token);

      if (response.vaiTro) {
        localStorage.setItem('vaiTro', response.vaiTro);
      }

      await fetchProfile();
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    setToken(response.token);
    localStorage.setItem('token', response.token);

    if (response.vaiTro) {
      localStorage.setItem('vaiTro', response.vaiTro);
    }

    await fetchProfile();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('vaiTro');
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (
    taiKhoanData: UpdateTaiKhoanDto,
    nguoiDungData: UpdateNguoiDungDto
  ) => {
    const currentToken = localStorage.getItem('token');
    const id = getUserIdFromToken(currentToken || '');
    if (!id || !user) {
      throw new Error('Không tìm thấy thông tin tài khoản');
    }

    try {
      await authService.updateTaiKhoan(id, taiKhoanData);
      if (user.maNguoiDung) {
        await authService.updateNguoiDung(user.maNguoiDung, nguoiDungData);
      }
      await fetchProfile();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Cập nhật thông tin thất bại';
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await authService.changePassword({ currentPassword, newPassword, confirmPassword: newPassword });
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword({ email });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

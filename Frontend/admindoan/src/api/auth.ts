import { LoginRequestDto, RegisterRequestDto, AuthResponseDto, TaiKhoanDto, UpdateTaiKhoanDto, UpdateNguoiDungDto, ChangePasswordDto, ForgotPasswordDto } from '../types/auth';
import api from './axios.config';

export const authService = {
  login: async (data: LoginRequestDto): Promise<AuthResponseDto> => {
    try {
      const response = await api.post('/Auth/login', data);
      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: RegisterRequestDto): Promise<AuthResponseDto> => {
    try {
      const response = await api.post('/Auth/register', data);
      return response.data.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  getProfile: async (): Promise<TaiKhoanDto> => {
    try {
      const response = await api.get('/Auth/Profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.data || !response.data.data) {
        throw new Error('Không tìm thấy thông tin tài khoản');
      }
      return response.data.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error('Không thể lấy thông tin tài khoản');
    }
  },

  updateTaiKhoan: async (id: string, data: UpdateTaiKhoanDto): Promise<UpdateTaiKhoanDto> => {
    try {
      const response = await api.put(`/TaiKhoan/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Update account error:', error);
      throw error;
    }
  },

  updateNguoiDung: async (id: string, data: UpdateNguoiDungDto): Promise<UpdateNguoiDungDto> => {
    try {
      const response = await api.put(`/NguoiDung/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Update user info error:', error);
      throw error;
    }
  },

  changePassword: async (data: ChangePasswordDto): Promise<boolean> => {
    try {
      const response = await api.put('/Auth/ChangePassword', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  forgotPassword: async (data: ForgotPasswordDto): Promise<boolean> => {
    try {
      const response = await api.post('/Auth/ForgotPassword', data);
      return response.data.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  getNguoiDungByTaiKhoanId: async (id: string) => {
    try {
      const response = await api.get(`/NguoiDung/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Get nguoi dung error:', error);
      throw error;
    }
  }
}; 
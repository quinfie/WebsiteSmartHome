import { LoginRequestDto, RegisterRequestDto, AuthResponseDto, ChangePasswordDto, ForgotPasswordDto, TaiKhoanDto, UpdateTaiKhoanDto, UpdateNguoiDungDto } from '../types/auth';
import api from './axios.config';

export const authService = {
  login: async (data: LoginRequestDto): Promise<AuthResponseDto> => {
    try {
      const payload = {
        Username: data.username,
        Password: data.password,
      };
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
      return response.data.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  updateTaiKhoan: async (data: UpdateTaiKhoanDto): Promise<boolean> => {
    try {
      const response = await api.put('/Auth/TaiKhoan', data, {
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

  updateNguoiDung: async (data: UpdateNguoiDungDto): Promise<boolean> => {
    try {
      const response = await api.put('/Auth/NguoiDung', data, {
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
  }
}; 
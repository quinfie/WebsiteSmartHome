import { TaiKhoanDto, UpdateTaiKhoanDto, TaiKhoanCreateDto } from '../types/taiKhoan';
import api from './axios.config';

export const taiKhoanService = {
  // GET: api/TaiKhoan
  getAll: async (): Promise<TaiKhoanDto[]> => {
    try {
      const response = await api.get('/TaiKhoan', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;

    } catch (error) {
      console.error('Get all accounts error:', error);
      throw error;
    }
  },

  // GET: api/TaiKhoan/{id}
  getById: async (id: string): Promise<TaiKhoanDto> => {
    try {
      const response = await api.get(`/TaiKhoan/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Get account by id error:', error);
      throw error;
    }
  },

  // POST: api/TaiKhoan
  create: async (data: TaiKhoanCreateDto): Promise<TaiKhoanDto> => {
    try {
      const response = await api.post('/TaiKhoan', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create account error:', error);
      throw error;
    }
  },

  // PUT: api/TaiKhoan/{id}
  update: async (id: string, data: UpdateTaiKhoanDto): Promise<string> => {
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

  // DELETE: api/TaiKhoan/{id}
  delete: async (id: string): Promise<string> => {
    try {
      const response = await api.delete(`/TaiKhoan/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  // GET: api/TaiKhoan/search
  search: async (keyword?: string, trangThai?: string): Promise<TaiKhoanDto[]> => {
    try {
      const response = await api.get('/TaiKhoan/search', {
        params: { keyword, trangThai },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Search accounts error:', error);
      throw error;
    }
  }
};

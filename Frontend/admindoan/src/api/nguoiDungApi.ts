import { NguoiDungDto, NguoiDungCreateDto, NguoiDungUpdateDto } from '../types/nguoiDung';
import api from './axios.config';

export const nguoiDungService = {
  // GET: api/NguoiDung
  getAll: async (): Promise<NguoiDungDto[]> => {
    try {
      const response = await api.get('/NguoiDung', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  // GET: api/NguoiDung/{id}
  getById: async (id: string): Promise<NguoiDungDto> => {
    try {
      const response = await api.get(`/NguoiDung/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Get user by id error:', error);
      throw error;
    }
  },

  // POST: api/NguoiDung
  create: async (data: NguoiDungCreateDto): Promise<NguoiDungDto> => {
    try {
      const response = await api.post('/NguoiDung', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  // PUT: api/NguoiDung/{id}
  update: async (id: string, data: NguoiDungUpdateDto): Promise<string> => {
    try {
      const response = await api.put(`/NguoiDung/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // DELETE: api/NguoiDung/{id}
  delete: async (id: string): Promise<string> => {
    try {
      const response = await api.delete(`/NguoiDung/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  // GET: api/NguoiDung/search
  search: async (keyword: string): Promise<NguoiDungDto[]> => {
    try {
      const response = await api.get('/NguoiDung/search', {
        params: { keyword },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }
};

import axios from './axios.config'; 
import { KhoDto, KhoCreateDto } from '../types/kho';

export const khoApi = {
  getAll: async (): Promise<KhoDto[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Chưa đăng nhập, không thể lấy danh sách kho');
        return [];
      }
      
      const res = await axios.get('/Kho', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return res.data.data || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho:", error);
      return [];
    }
  },
  
  create: async (data: KhoCreateDto): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Chưa đăng nhập, không thể tạo kho mới');
        return false;
      }
      
      await axios.post('/Kho', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return true;
    } catch (error) {
      console.error("Lỗi khi tạo kho:", error);
      return false;
    }
  },
};

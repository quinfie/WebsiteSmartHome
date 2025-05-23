import axios from './axios.config';
import { KhoDto, KhoCreateDto } from '../types/kho';

// Endpoint được xác định dựa trên controller [Route("api/[controller]")]
const endpoint = '/Kho';

interface BaseResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const khoApi = {
  getAll: async (): Promise<KhoDto[]> => {
    try {
      const res = await axios.get(endpoint);
      return res.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<KhoDto> => {
    try {
      const res = await axios.get(`${endpoint}/${id}`);
      return res.data.data;
    } catch (error) {
      console.error(`Lỗi khi lấy kho với ID ${id}:`, error);
      throw error;
    }
  },

  create: async (data: KhoCreateDto): Promise<KhoDto> => {
    try {
      // Convert camelCase property names to PascalCase for backend
      const backendData = {
        TenKho: data.tenKho,
        DiaChi: data.diaChi,
        SoDienThoai: data.soDienThoai
      };
      
      const res = await axios.post(endpoint, backendData);
      return res.data.data;
    } catch (error) {
      console.error("Lỗi khi tạo kho:", error);
      throw error;
    }
  },

  update: async (id: string, data: KhoDto): Promise<KhoDto> => {
    try {
      // Convert camelCase property names to PascalCase for backend
      const backendData = {
        TenKho: data.tenKho,
        DiaChi: data.diaChi,
        SoDienThoai: data.soDienThoai
      };
      
      const res = await axios.put(`${endpoint}/${id}`, backendData);
      return res.data.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật kho với ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const res = await axios.delete(`${endpoint}/${id}`);
      return res.data.data;
    } catch (error) {
      console.error(`Lỗi khi xóa kho với ID ${id}:`, error);
      throw error;
    }
  },

  search: async (keyword: string): Promise<KhoDto[]> => {
    try {
      const res = await axios.get(`${endpoint}/search?keyword=${encodeURIComponent(keyword)}`);
      return res.data.data;
    } catch (error) {
      console.error(`Lỗi khi tìm kiếm kho với từ khóa "${keyword}":`, error);
      throw error;
    }
  }
};

import axios from './axios.config';
import { NhaCungCapDto, NhaCungCapCreateDto } from '../types/nhacungcap';

// Endpoint được xác định dựa trên controller [Route("api/[controller]")]
const endpoint = '/NhaCungCap';

interface BaseResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

// Helper mới kiểm tra token và trả về thông tin cấu hình hoặc null
const getAuthHeaderSafe = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Tạo response mặc định để tránh ném lỗi
const createEmptyResponse = <T>(emptyData: T) => {
  return {
    data: {
      data: emptyData,
      message: "Chưa đăng nhập",
      success: false
    }
  };
};

export const getAllNhaCungCap = async () => {
  try {
    const config = getAuthHeaderSafe();
    if (!config) {
      console.log('Chưa đăng nhập, không thể lấy danh sách nhà cung cấp');
      return createEmptyResponse<NhaCungCapDto[]>([]);
    }
    
    return await axios.get<BaseResponse<NhaCungCapDto[]>>(endpoint, config);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    return createEmptyResponse<NhaCungCapDto[]>([]);
  }
};

export const getNhaCungCapById = async (id: string) => {
  try {
    const config = getAuthHeaderSafe();
    if (!config) {
      console.log(`Chưa đăng nhập, không thể lấy thông tin nhà cung cấp ${id}`);
      return createEmptyResponse<NhaCungCapDto | null>(null);
    }
    
    return await axios.get(`${endpoint}/${id}`, config);
  } catch (error) {
    console.error(`Lỗi khi lấy nhà cung cấp với ID ${id}:`, error);
    return createEmptyResponse<NhaCungCapDto | null>(null);
  }
};

export const createNhaCungCap = async (data: NhaCungCapCreateDto) => {
  try {
    const config = getAuthHeaderSafe();
    if (!config) {
      console.log('Chưa đăng nhập, không thể tạo nhà cung cấp mới');
      return createEmptyResponse<boolean>(false);
    }
    
    const backendData = {
      TenNhaCungCap: data.tenNhaCungCap,
      SDT: data.sdt,
      Email: data.email,
      DiaChi: data.diaChi
    };
    
    return await axios.post(endpoint, backendData, config);
  } catch (error) {
    console.error("Lỗi khi tạo nhà cung cấp:", error);
    throw error;
  }
};

export const updateNhaCungCap = async (id: string, data: NhaCungCapCreateDto) => {
  try {
    const config = getAuthHeaderSafe();
    if (!config) {
      console.log(`Chưa đăng nhập, không thể cập nhật nhà cung cấp ${id}`);
      return createEmptyResponse<boolean>(false);
    }
    
    // Convert camelCase property names to PascalCase for backend
    const backendData = {
      TenNhaCungCap: data.tenNhaCungCap,
      SDT: data.sdt,
      Email: data.email,
      DiaChi: data.diaChi
    };
    
    return await axios.put(`${endpoint}/${id}`, backendData, config);
  } catch (error) {
    console.error(`Lỗi khi cập nhật nhà cung cấp với ID ${id}:`, error);
    throw error;
  }
};

export const deleteNhaCungCap = async (id: string) => {
  try {
    const config = getAuthHeaderSafe();
    if (!config) {
      console.log(`Chưa đăng nhập, không thể xóa nhà cung cấp ${id}`);
      return createEmptyResponse<boolean>(false);
    }
    
    return await axios.delete(`${endpoint}/${id}`, config);
  } catch (error) {
    console.error(`Lỗi khi xóa nhà cung cấp với ID ${id}:`, error);
    throw error;
  }
};

export const searchNhaCungCap = async (keyword: string) => {
  try {
    const config = getAuthHeaderSafe();
    if (!config) {
      console.log(`Chưa đăng nhập, không thể tìm kiếm nhà cung cấp`);
      return createEmptyResponse<NhaCungCapDto[]>([]);
    }
    
    return await axios.get(`${endpoint}/search?keyword=${keyword}`, config);
  } catch (error) {
    console.error(`Lỗi khi tìm kiếm nhà cung cấp với từ khóa "${keyword}":`, error);
    throw error;
  }
};

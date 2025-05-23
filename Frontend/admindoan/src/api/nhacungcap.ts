import axios from './axios.config';
import { NhaCungCapDto, NhaCungCapCreateDto } from '../types/nhacungcap';

// Endpoint được xác định dựa trên controller [Route("api/[controller]")]
const endpoint = '/NhaCungCap';

interface BaseResponse<T> {
    data: T;
    message: string | null;
    statusCode: number;
    code: string;
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
const createEmptyResponse = <T>(emptyData: T): BaseResponse<T> => {
  return {
    data: emptyData,
    message: "Chưa đăng nhập",
    statusCode: 401,
    code: 'Unauthorized'
  };
};

export const getAllNhaCungCap = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để xem danh sách nhà cung cấp');
  }

  try {
    const response = await axios.get<BaseResponse<NhaCungCapDto[]>>(endpoint);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    throw error;
  }
};

export const getNhaCungCapById = async (id: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để xem thông tin nhà cung cấp');
  }

  try {
    const response = await axios.get<BaseResponse<NhaCungCapDto>>(`${endpoint}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi lấy nhà cung cấp với ID ${id}:`, error);
    throw error;
  }
};

export const createNhaCungCap = async (data: NhaCungCapCreateDto) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để tạo nhà cung cấp mới');
  }

  try {
    const backendData = {
      TenNhaCungCap: data.tenNhaCungCap,
      SDT: data.sdt,
      Email: data.email,
      DiaChi: data.diaChi
    };
    
    const response = await axios.post<BaseResponse<NhaCungCapDto>>(endpoint, backendData);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi tạo nhà cung cấp:", error);
    throw error;
  }
};

export const updateNhaCungCap = async (id: string, data: NhaCungCapCreateDto) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để cập nhật nhà cung cấp');
  }

  try {
    const backendData = {
      TenNhaCungCap: data.tenNhaCungCap,
      SDT: data.sdt,
      Email: data.email,
      DiaChi: data.diaChi
    };
    
    const response = await axios.put<BaseResponse<NhaCungCapDto>>(`${endpoint}/${id}`, backendData);
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi cập nhật nhà cung cấp với ID ${id}:`, error);
    throw error;
  }
};

export const deleteNhaCungCap = async (id: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để xóa nhà cung cấp');
  }

  try {
    const response = await axios.delete<BaseResponse<boolean>>(`${endpoint}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi xóa nhà cung cấp với ID ${id}:`, error);
    throw error;
  }
};

export const searchNhaCungCap = async (keyword: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Vui lòng đăng nhập để tìm kiếm nhà cung cấp');
  }

  try {
    const response = await axios.get<BaseResponse<NhaCungCapDto[]>>(`${endpoint}/search?keyword=${keyword}`);
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi tìm kiếm nhà cung cấp với từ khóa "${keyword}":`, error);
    throw error;
  }
};

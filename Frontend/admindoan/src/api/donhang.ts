import axios from './axios.config';
import {
  DonHangDto,
  ViewResponseCreateDonHangDto,
  RequestCreateDonHangDto,
  RequestUpdateDonHangDto,
  ResponseCreateDonHangDto,
} from '../types/donhang';

export const getAllDonHang = async (): Promise<DonHangDto[]> => {
  const res = await axios.get('/DonHang');
  return res.data.data;
};

export const getDonHangById = async (id: string): Promise<ViewResponseCreateDonHangDto> => {
  const res = await axios.get(`/DonHang/${id}`);
  return res.data.data;
};

export const createDonHang = async (dto: RequestCreateDonHangDto): Promise<ResponseCreateDonHangDto> => {
  const res = await axios.post('/DonHang', dto);
  return res.data.data;
};

export const updateDonHang = async (
  id: string,
  dto: RequestUpdateDonHangDto
): Promise<ResponseCreateDonHangDto> => {
  try {
    // Validate số lượng và đơn giá nếu có chiTietDonHangs
    if (dto.chiTietDonHangs && dto.chiTietDonHangs.length > 0) {
      dto.chiTietDonHangs.forEach((item, index) => {
        if (item.soLuongMua <= 0) {
          throw new Error(`Số lượng sản phẩm thứ ${index + 1} phải lớn hơn 0`);
        }
        if (item.donGiaMua <= 0) {
          throw new Error(`Đơn giá sản phẩm thứ ${index + 1} phải lớn hơn 0`);
        }
      });
    }
    
    // Log request để debug
    console.log(`Sending update request to /DonHang/${id}`, dto);
    
    const res = await axios.put(`/DonHang/${id}`, dto);
    return res.data.data;
  } catch (error: any) {
    console.error('Error in updateDonHang:', error);
    
    // Xử lý lỗi từ backend
    if (error.response?.data?.errors) {
      console.error('Server error details:', error.response.data.errors);
      
      // Nếu lỗi liên quan đến SoLuong
      if (error.response.data.errors.message?.includes('CHECK constraint') && 
          error.response.data.errors.message?.includes('SoLuong')) {
        throw new Error('Số lượng sản phẩm phải lớn hơn 0');
      }
      
      // Nếu lỗi liên quan đến đơn giá
      if (error.response.data.errors.message?.includes('CHECK constraint') && 
          error.response.data.errors.message?.includes('DonGia')) {
        throw new Error('Đơn giá sản phẩm phải lớn hơn 0');
      }
    }
    
    // Rethrow to handle in the component
    throw error;
  }
};

export const deleteDonHang = async (id: string): Promise<boolean> => {
  const res = await axios.delete(`/DonHang/${id}`);
  return res.data.data;
};

export const getCurrentUserDonHang = async (): Promise<ViewResponseCreateDonHangDto[]> => {
  const res = await axios.get(`/DonHang/current-user`);
  return res.data.data;
};

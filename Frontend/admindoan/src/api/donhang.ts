import axios from './axios.config';
import {
  DonHangDto,
  ViewResponseCreateDonHangDto,
  RequestCreateDonHangDto,
  RequestUpdateDonHangDto,
  ResponseCreateDonHangDto,
} from '../types/donhang';
import { BaseResponse } from '../types/common';

export const getAllDonHang = async (): Promise<DonHangDto[]> => {
  const res = await axios.get('/DonHang');
  return res.data.data;
};

export const getDonHangById = async (id: string): Promise<BaseResponse<ViewResponseCreateDonHangDto>> => {
  const res = await axios.get(`/DonHang/${id}`);
  return res.data;
};

export const createDonHang = async (dto: RequestCreateDonHangDto): Promise<BaseResponse<ResponseCreateDonHangDto>> => {
  const res = await axios.post('/DonHang', dto);
  return res.data;
};

export const updateDonHang = async (
  id: string,
  dto: RequestUpdateDonHangDto
): Promise<BaseResponse<ResponseCreateDonHangDto>> => {
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
    return res.data;
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

export const deleteDonHang = async (id: string): Promise<BaseResponse<boolean>> => {
  const res = await axios.delete(`/DonHang/${id}`);
  return res.data;
};

export const cancelUserOrder = async (id: string): Promise<BaseResponse<boolean>> => {
  try {
    // Đầu tiên, kiểm tra trạng thái đơn hàng
    const orderDetails = await getDonHangById(id);
    
    // Nếu đơn hàng không phải trạng thái "Chờ xác nhận", không cho phép hủy
    if (!orderDetails.data || orderDetails.data.trangThaiDonHang !== 'Chờ xác nhận') {
      throw new Error('Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận');
    }
    
    // Thực hiện hủy đơn hàng bằng cách cập nhật trạng thái
    const updateData: RequestUpdateDonHangDto = {
      trangThaiDonHang: 'Đã hủy',
      maKhuyenMai: orderDetails.data.maKhuyenMai,
      chiTietDonHangs: orderDetails.data.chiTietDonHangs?.map(item => ({
        maSanPham: item.maSanPham,
        soLuongMua: item.soLuong,
        donGiaMua: item.donGia
      })) || []
    };
    
    const res = await axios.put(`/DonHang/${id}`, updateData);
    return res.data;
  } catch (error: any) {
    console.error('Error canceling order:', error);
    throw error;
  }
};

export const getCurrentUserDonHang = async (): Promise<BaseResponse<ViewResponseCreateDonHangDto[]>> => {
  const res = await axios.get(`/DonHang/current-user`);
  return res.data;
};

export const getCompletedOrders = async (): Promise<BaseResponse<ViewResponseCreateDonHangDto[]>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    const response = await axios.get(`/DonHang/completed`);
    //console.log('Completed orders response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching completed orders:', error);
    throw error;
  }
};

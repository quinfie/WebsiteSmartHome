import api from "./axios.config";
import { 
  YeuCauDichVuDto, 
  CreateYeuCauDichVuDto, 
  UpdateChiPhiYeuCauDto,
  YeuCauDichVuKhachHangDto 
} from "../types/yeucaudichvu";
import { authService } from './auth';

export const yeucaudichvuApi = {
  // Tạo mới yêu cầu dịch vụ
  taoYeuCau: async (dto: CreateYeuCauDichVuDto): Promise<YeuCauDichVuDto> => {
    try {
      // Lấy thông tin người dùng từ profile
      const profileResponse = await authService.getProfile();
      if (!profileResponse || !profileResponse.maNguoiDung) {
        throw new Error('Không thể xác định người dùng từ profile');
      }

      // Convert to PascalCase for backend
      const requestBody = {
        MaChiTietDonHang: Number(dto.maChiTietDonHang),
        MoTa: dto.moTa?.trim(),
        NgayHen: dto.ngayHen // Format: YYYY-MM-DD
      };
      
      const response = await api.post(`/YeuCauDichVu?userId=${profileResponse.maNguoiDung}`, requestBody);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error: any) {
      console.error('Error creating service request:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Lấy danh sách yêu cầu của khách hàng hiện tại
  getYeuCauCuaToi: async (): Promise<YeuCauDichVuKhachHangDto[]> => {
    try {
      const token = localStorage.getItem('token');
      console.log('getYeuCauCuaToi - Token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      // Lấy thông tin người dùng từ profile
      const profileResponse = await authService.getProfile();
      console.log('getYeuCauCuaToi - Profile response:', profileResponse);
      
      if (!profileResponse || !profileResponse.maNguoiDung) {
        throw new Error('Không thể xác định người dùng từ profile');
      }

      const response = await api.get(`/YeuCauDichVu/cua-toi?userId=${profileResponse.maNguoiDung}`);
      console.log('getYeuCauCuaToi - API response:', response);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error in getYeuCauCuaToi:', error);  
      if (error.response) {
        console.error('Error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else {
        console.error('Error without response:', error.message);
      }
      throw error;
    }
  },

  // Lấy danh sách yêu cầu dịch vụ của một khách hàng cụ thể (dành cho nhân viên quản lý)
  getByKhachHang: async (khachHangId: string): Promise<YeuCauDichVuKhachHangDto[]> => {
    const response = await api.get(`/YeuCauDichVu/khach-hang/${khachHangId}`);
    return response.data.data;
  },

  // Lấy chi tiết yêu cầu dịch vụ
  getById: async (id: string): Promise<YeuCauDichVuDto> => {
    try {
      const response = await api.get(`/YeuCauDichVu/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching service request details:', error);
      throw error;
    }
  },

  // Lấy chi tiết yêu cầu dịch vụ đầy đủ (bao gồm khách hàng và sản phẩm)
  getDetailedById: async (id: string): Promise<YeuCauDichVuDto> => {
    try {
      // Sử dụng endpoint mới ở backend để lấy dữ liệu đầy đủ
      const response = await api.get(`/YeuCauDichVu/${id}/detailed`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching detailed service request details:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái yêu cầu dịch vụ
  updateTrangThai: async (id: string, trangThai: string, ngayXuLy?: string | null): Promise<YeuCauDichVuDto> => {
    const response = await api.put(`/YeuCauDichVu/trang-thai/${id}`, {
      trangThai: trangThai,
      ngayXuLy: ngayXuLy
    });
    return response.data.data;
  },

  // Cập nhật chi phí yêu cầu dịch vụ (dành cho nhân viên)
  updateChiPhi: async (id: string, chiPhi: number): Promise<YeuCauDichVuDto> => {
    try {
      const dto: UpdateChiPhiYeuCauDto = { chiPhiYeuCau: chiPhi };
      const response = await api.put(`/YeuCauDichVu/${id}/chi-phi`, dto);
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating cost:', error);
      throw error;
    }
  },

  // Cập nhật ngày xử lý yêu cầu dịch vụ
  updateNgayXuLy: async (id: string, ngayXuLy: string) => {
    const formattedDate = new Date(ngayXuLy).toISOString();
    const response = await api.put(`/YeuCauDichVu/${id}/ngay-xu-ly`, formattedDate, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data.data;
  },

  // Cập nhật mô tả (tiến độ hoặc kết quả)
  updateMoTa: async (id: string, moTa: string, isKetQua: boolean = false) => {
    const response = await api.put(`/YeuCauDichVu/${id}/mo-ta`, { moTa, isKetQua });
    return response.data.data;
  },

  // Hủy yêu cầu dịch vụ
  huyYeuCau: async (id: string): Promise<YeuCauDichVuDto> => {
    try {
      const response = await api.put(`/YeuCauDichVu/${id}/huy`, null);
      return response.data.data;
    } catch (error: any) {
      console.error('Error canceling service request:', error);
      throw error;
    }
  },

  // Xác nhận yêu cầu dịch vụ (dành cho quản lý)
  xacNhanYeuCau: async (id: string): Promise<YeuCauDichVuDto> => {
    try {
      const response = await api.put(`/YeuCauDichVu/${id}/xac-nhan`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error confirming service request:', error);
      throw error;
    }
  },

  // Lấy tất cả yêu cầu dịch vụ với các bộ lọc (dành cho quản lý)
  getAllYeuCau: async (trangThai?: string, loaiDichVu?: string): Promise<YeuCauDichVuDto[]> => {
    try {
      let url = "/YeuCauDichVu";
      const params = new URLSearchParams();
      
      if (trangThai) params.append("trangThai", trangThai);
      if (loaiDichVu) params.append("loaiDichVu", loaiDichVu);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('getAllYeuCau - Request URL:', url);
      const response = await api.get(url);
      console.log('getAllYeuCau - API response:', response);
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error in getAllYeuCau:', error);
      if (error.response) {
        console.error('Error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  // Lấy danh sách yêu cầu dịch vụ chưa được phân công
  getYeuCauChuaPhanCong: async (): Promise<YeuCauDichVuDto[]> => {
    const response = await api.get("/YeuCauDichVu/chua-phan-cong");
    return response.data.data;
  },

  // Lấy danh sách yêu cầu dịch vụ theo kỹ thuật viên
  getYeuCauTheoKyThuatVien: async (kyThuatVienId: string): Promise<YeuCauDichVuDto[]> => {
    const response = await api.get(`/YeuCauDichVu/ky-thuat-vien/${kyThuatVienId}`);
    return response.data.data;
  },

  // Đếm số lượng yêu cầu dịch vụ theo trạng thái
  countYeuCauTheoTrangThai: async (trangThai: string): Promise<number> => {
    const response = await api.get(`/YeuCauDichVu/count/${trangThai}`);
    return response.data.data;
  },

  // Tính tổng chi phí các yêu cầu dịch vụ đã hoàn thành
  tinhTongChiPhi: async (tuNgay?: Date, denNgay?: Date): Promise<number> => {
    let url = "/YeuCauDichVu/tong-chi-phi";
    const params = new URLSearchParams();

    if (tuNgay) params.append("tuNgay", tuNgay.toISOString());
    if (denNgay) params.append("denNgay", denNgay.toISOString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data.data;
  },

  // Cập nhật yêu cầu dịch vụ
  updateYeuCau: async (id: string, data: { moTa: string, ngayHen: string, loaiDichVu: string }) => {
    try {
      const response = await api.put(`/YeuCauDichVu/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating service request:', error);
      throw error;
    }
  },

  // Xóa vĩnh viễn yêu cầu dịch vụ
  deleteYeuCau: async (id: string): Promise<void> => {
    try {
      await api.delete(`/YeuCauDichVu/${id}`);
    } catch (error: any) {
      console.error('Error deleting service request:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  getYeuCauCuaNhanVien: async (maNhanVien: string): Promise<YeuCauDichVuDto[]> => {
    try {
      const response = await api.get(`/YeuCauDichVu/nhan-vien/${maNhanVien}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching employee service requests:', error);
      throw error;
    }
  }
};

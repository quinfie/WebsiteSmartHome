import axios from "./axios.config"; 
import {
  CreatePhanCongDichVuDto,
  PhanCongDichVuDto,
  PhanCongCalendarDto,
  UpdatePhanCongDichVuDto
} from "../types/phancongdichvu";

export const phanCongDichVuApi = {
  create: async (dto: CreatePhanCongDichVuDto): Promise<PhanCongDichVuDto> => {
    const backendDto = {
      MaYeuCau: dto.yeuCauDichVuId,
      MaKyThuatVien: dto.kyThuatVienId,
      GhiChu: dto.ghiChu || "",
      NgayPhanCong: new Date().toISOString()
    };
    const res = await axios.post("/PhanCongDichVu/phan-cong", backendDto);
    return res.data.data;
  },

  updateTrangThai: async (id: string, trangThai: string): Promise<PhanCongDichVuDto> => {
    const res = await axios.put(`/PhanCongDichVu/trang-thai/${id}`, { trangThai }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.data.data;
  },

  hoanThanh: async (id: string): Promise<PhanCongDichVuDto> => {
    const res = await axios.post(`/PhanCongDichVu/hoan-thanh/${id}`);
    return res.data.data;
  },

  getByYeuCau: async (yeuCauId: string): Promise<PhanCongDichVuDto[]> => {
    const res = await axios.get(`/PhanCongDichVu/yeu-cau/${yeuCauId}`, {
      params: {
        includeKhachHang: true
      }
    });
    return res.data.data;
  },

  getByKyThuatVien: async (kyThuatVienId: string): Promise<PhanCongDichVuDto[]> => {
    const response = await axios.get<{ data: PhanCongDichVuDto[] }>(`/PhanCongDichVu/ky-thuat-vien/${kyThuatVienId}`, {
      params: {
        includeKhachHang: true
      }
    });
    return response.data.data;
  },

  getPhanCongCalendarByKyThuatVien: async (kyThuatVienId: string): Promise<PhanCongCalendarDto[]> => {
    const res = await axios.get(`/PhanCongDichVu/calendar/ky-thuat-vien/${kyThuatVienId}`);
    return res.data.data;
  },

  getById: async (id: string): Promise<PhanCongDichVuDto> => {
    const res = await axios.get(`/PhanCongDichVu/${id}`);
    return res.data.data;
  },

  updatePhanCong: async (dto: { id: string; kyThuatVienId: string; ghiChu?: string; trangThaiPhanCong: string }): Promise<PhanCongDichVuDto> => {
    const backendDto = {
      MaKyThuatVien: dto.kyThuatVienId,
      GhiChu: dto.ghiChu,
      TrangThaiPhanCong: dto.trangThaiPhanCong
    };
    const res = await axios.put(`/PhanCongDichVu/${dto.id}`, backendDto);
    return res.data.data;
  },

  updateGhiChu: async (id: string, ghiChu: string): Promise<PhanCongDichVuDto> => {
    // Lấy thông tin phân công hiện tại
    const currentPhanCong = await phanCongDichVuApi.getById(id);
    
    if (!currentPhanCong.kyThuatVien) {
      throw new Error("Không tìm thấy thông tin kỹ thuật viên");
    }
    
    // Cập nhật ghi chú và giữ nguyên các thông tin khác
    const dto = {
      id: id,
      kyThuatVienId: currentPhanCong.kyThuatVien.id,
      ghiChu: ghiChu,
      trangThaiPhanCong: currentPhanCong.trangThaiPhanCong
    };
    
    const res = await phanCongDichVuApi.updatePhanCong(dto);
    return res;
  },

  updateKyThuatVien: async (id: string, kyThuatVienId: string): Promise<PhanCongDichVuDto> => {
    const res = await axios.put(`/PhanCongDichVu/ky-thuat-vien/${id}`, { kyThuatVienId });
    return res.data.data;
  },

  capNhatTrangThai: async (id: string, trangThai: string): Promise<PhanCongDichVuDto> => {
    try {
      const response = await axios.put(`/PhanCongDichVu/trang-thai/${id}`, trangThai, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },

  update: async (id: string, dto: UpdatePhanCongDichVuDto): Promise<PhanCongDichVuDto> => {
    const res = await axios.put(`/PhanCongDichVu/${id}`, dto);
    return res.data.data;
  }
};

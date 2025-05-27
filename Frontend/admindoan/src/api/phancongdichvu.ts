import axios from "./axios.config"; 
import {
  CreatePhanCongDichVuDto,
  PhanCongDichVuDto,
  PhanCongCalendarDto
} from "../types/phancongdichvu";

export const phanCongDichVuApi = {
  create: async (dto: CreatePhanCongDichVuDto): Promise<PhanCongDichVuDto> => {
    // Map frontend property names to backend DTO property names
    const backendDto = {
      MaYeuCau: dto.yeuCauDichVuId,
      MaKyThuatVien: dto.kyThuatVienId,
      GhiChu: dto.ghiChu
    };
    const res = await axios.post("/PhanCongDichVu/phan-cong", backendDto);
    return res.data.data;
  },

  updateTrangThai: async (id: string, trangThai: string): Promise<PhanCongDichVuDto> => {
    const res = await axios.put(`/PhanCongDichVu/trang-thai/${id}`, JSON.stringify(trangThai), {
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
    const res = await axios.get(`/PhanCongDichVu/ky-thuat-vien/${kyThuatVienId}`, {
      params: {
        includeKhachHang: true
      }
    });
    return res.data.data;
  },

  getPhanCongCalendarByKyThuatVien: async (kyThuatVienId: string): Promise<PhanCongCalendarDto[]> => {
    const res = await axios.get(`/PhanCongDichVu/calendar/ky-thuat-vien/${kyThuatVienId}`);
    return res.data.data;
  },

  getById: async (id: string): Promise<PhanCongCalendarDto> => {
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
  }
};

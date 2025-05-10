// src/types/yeuCauDichVu.dto.ts

export interface YeuCauDichVuDto {
    id: string;
    tieuDe: string;
    moTa: string;
    diaChi: string;
    chiPhi?: number;
    ketQua?: string;
    tienDo?: string;
    ngayXuLy?: string;
    ngayTao: string;
    trangThai: string;
    maKhachHang: string;
    maChiTietDonHang: string;
  }
  
  export interface CreateYeuCauDichVuDto {
    tieuDe: string;
    moTa: string;
    diaChi: string;
    maChiTietDonHang: string;
  }
  
// src/types/yeucaudichvu.ts

export type LoaiDichVu = "Bảo hành" | "Sửa chữa";

export type TrangThaiYeuCau = "Đang chờ xác nhận" | "Đã xác nhận" | "Hoàn thành" | "Đã hủy";

export interface YeuCauDichVuDto {
  id: string;
  maChiTietDonHang: number;
  loaiDichVu: LoaiDichVu;
  trangThaiYeuCau: TrangThaiYeuCau;
  chiPhiYeuCau: number;
  ngayHen: string;
  ngayXuLy?: Date;
  moTa?: string;
  daPhanCong: boolean;
  tenSanPham?: string;
  khachHang?: {
    id: string;
    tenNguoiDung: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinh: string;
    cccd: string;
    ngaySinh?: Date;
  };
}

export interface YeuCauDichVuKhachHangDto {
  id: string;
  tenSanPham: string;
  loaiDichVu: LoaiDichVu;
  trangThaiYeuCau: TrangThaiYeuCau;
  ngayHen: string;
  moTa?: string;
  chiPhiYeuCau: number;
}

export interface CreateYeuCauDichVuDto {
  maChiTietDonHang: number;
  moTa: string;
  ngayHen: string;
}

export interface UpdateChiPhiYeuCauDto {
  ChiPhiYeuCau: number;
}

export interface UpdateMoTaDto {
  MoTa: string;
  IsKetQua: boolean;
}

// DTO for updating service request status
export interface UpdateTrangThaiYeuCauDto {
    TrangThai: string;
    NgayXuLy?: Date;
}
  
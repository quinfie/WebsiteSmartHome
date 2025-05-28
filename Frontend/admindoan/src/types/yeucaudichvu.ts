// src/types/yeucaudichvu.ts

export type LoaiDichVu = "Bảo hành" | "Sửa chữa";

export type TrangThaiYeuCau = "Đang chờ xác nhận" | "Đã xác nhận" | "Hoàn thành" | "Đã hủy";

export interface YeuCauDichVuDto {
  id: string;
  maChiTietDonHang: number;
  loaiDichVu: 'Bảo hành' | 'Sửa chữa';
  trangThaiYeuCau: 'Đang chờ xác nhận' | 'Đã xác nhận' | 'Hoàn thành' | 'Đã hủy';
  chiPhiYeuCau: number;
  ngayHen: string;
  ngayXuLy: string | null;
  moTa: string | null;
  daPhanCong: boolean;
  tenSanPham?: string;
  khachHang?: {
    id: string;
    tenNguoiDung: string;
    email: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinh: string;
    cccd: string;
    ngaySinh: string;
  };
}

export interface YeuCauDichVuKhachHangDto extends YeuCauDichVuDto {
  khachHang: {
    id: string;
    tenNguoiDung: string;
    email: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinh: string;
    cccd: string;
    ngaySinh: string;
  };
}

export interface CreateYeuCauDichVuDto {
  maChiTietDonHang: number;
  loaiDichVu: 'Bảo hành' | 'Sửa chữa';
  ngayHen: string;
  moTa?: string;
}

export interface UpdateChiPhiYeuCauDto {
  chiPhiYeuCau: number;
}

export interface UpdateMoTaDto {
  moTa: string;
}

// DTO for updating service request status
export interface UpdateTrangThaiYeuCauDto {
  trangThaiYeuCau: 'Đang chờ xác nhận' | 'Đã xác nhận' | 'Hoàn thành' | 'Đã hủy';
  ngayXuLy?: string;
}
  
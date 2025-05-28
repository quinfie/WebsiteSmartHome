import { YeuCauDichVuDto } from './yeucaudichvu';

export interface CreatePhanCongDichVuDto {
    yeuCauDichVuId: string;
    kyThuatVienId: string;
    ghiChu?: string;
  }
  
  export interface PhanCongDichVuDto {
    id: string;
    yeuCauDichVuId: string;
    kyThuatVienId: string;
    quanLyId: string;
    ngayPhanCong: string;
    ngayHoanThanh?: string;
    trangThaiPhanCong: string;
    ghiChu?: string;
    yeuCauDichVu?: {
      id: string;
      tieuDe: string;
      moTa: string;
      trangThaiYeuCau: string;
      loaiDichVu: string;
      ngayHen?: string;
      ngayXuLy?: string;
      daPhanCong: boolean;
      chiPhiYeuCau?: number;
      khachHang?: {
        id: string;
        tenNguoiDung: string;
        email: string;
        soDienThoai: string;
        diaChi: string;
      };
    };
    kyThuatVien?: {
      id: string;
      tenNguoiDung: string;
      email: string;
      soDienThoai: string;
    };
  }
  
  export interface UpdatePhanCongDichVuDto {
    ghiChu?: string;
    trangThaiPhanCong?: 'Đang chờ xác nhận' | 'Đã xác nhận' | 'Hoàn thành' | 'Đã hủy';
  }
  
  export interface PhanCongCalendarDto {
    id: string;
    ngayPhanCong: string;
    trangThaiPhanCong: string;
    ghiChu: string;
    yeuCauId: string;
    loaiDichVu: string;
    moTaYeuCau: string;
    donHangId: string;
    maDonHang: string;
    sanPhamId: string;
    tenSanPham: string;
    moTaSanPham: string;
    giaSanPham: number;
    thoiGianBaoHanh: number;
    khachHangId: string;
    tenKhachHang: string;
    emailKhachHang: string;
    soDienThoaiKhachHang: string;
    diaChiKhachHang: string;
    ngayHetHanBaoHanh: string;
    ngayHoanThanh?: string;
    ngayXuLy?: string;
  }
  
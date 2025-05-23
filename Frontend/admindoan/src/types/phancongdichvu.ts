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
    kyThuatVien?: {
      id: string;
      tenNguoiDung: string;
      email: string;
      soDienThoai: string;
    };
    yeuCauDichVu?: {
      id: string;
      tieuDe: string;
      moTa: string;
      trangThaiYeuCau: string;
      loaiDichVu: string;
      khachHang?: {
        id: string;
        tenNguoiDung: string;
        email: string;
        soDienThoai: string;
        diaChi: string;
      };
    };
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
  }
  
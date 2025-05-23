export interface DonHangDto {
    id: string;
    tenNguoiDung: string;
    tongTien: number;
    trangThaiDonHang: string;
    ngayDat: string;
    tenKhuyenMai?: string;
    maKhuyenMai?:string;
    chiTietSanPham?: ChiTietDonHangDto[];
  }
  
  export interface ViewResponseCreateDonHangDto {
    id: string;
    tenNguoiDung: string;
    tongTien: number;
    tongTienSauGiam: number;
    phiVanChuyen: number;
    trangThaiDonHang: string;
    ngayDat: string;
    tenKhuyenMai?: string;
    maKhuyenMai?: string;
    phanTramGiam?: number;
    chiTietDonHangs?: ChiTietDonHangDto[];
  }
  
  export interface ChiTietDonHangDto {
    id: string;
    maDonHang: string;
    maSanPham: string;
    tenSanPham: string;
    soLuong: number;
    donGia: number;
  }
  
  export interface RequestUpdateDonHangDto {
    trangThaiDonHang: string;
    maKhuyenMai?: string;
    chiTietDonHangs?: RequestCreateChiTietDonHangDto[];
  }
  
  export interface RequestCreateDonHangDto {
    maKhuyenMai?: string | null;
    chiTietDonHangs: RequestCreateChiTietDonHangDto[];
  }
  
  export interface ResponseCreateDonHangDto {
    id: string;
    maNguoiDung: string;
    tongTien: number;
    trangThaiDonHang: string;
    maKhuyenMai?: string;
    chiTietDonHangs?: RequestCreateChiTietDonHangDto[];
  }
  
  export interface RequestCreateChiTietDonHangDto {
    maSanPham: string;
    soLuongMua: number;
    donGiaMua: number;
  }
  export interface RequestUpdateChiTietDonHangDto {
    maSanPham: string;
    soLuong: number;
    donGia: number;
  }
  
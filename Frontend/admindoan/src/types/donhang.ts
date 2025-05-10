export interface DonHangDto {
    id: string;
    tenNguoiDung: string;
    tongTien: number;
    trangThaiDonHang: string;
    ngayDat: string;
    tenKhuyenMai?: string;
    maKhuyenMai?:string;
  }
  
  export interface ViewResponseCreateDonHangDto extends DonHangDto {
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
    tenNguoiDung: string;
    tongTien: number;
    trangThaiDonHang:string;
    ngayDat: string;
    maKhuyenMai?: string;
    chiTietDonHangs?: RequestCreateChiTietDonHangDto[];
  }
  
  export interface ResponseCreateDonHangDto {
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
  

  
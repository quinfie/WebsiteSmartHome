export interface ThongKeDonHangDto {
    ngay: string;
    soDonHang: number;
    tongTien: number;
}

export interface ThongKeSanPhamDto {
    tenSanPham: string;
    soLuongBan: number;
    doanhThu: number;
}

export interface ThongKeDanhMucDto {
    tenDanhMuc: string;
    soLuongSanPham: number;
    tongTien: number;
}

export interface ThongKeDichVuDto {
    loaiDichVu: string;
    soLuong: number;
    tongTien: number;
}

export interface ThongKeDanhGiaDto {
    rating: number;
    soLuong: number;
} 
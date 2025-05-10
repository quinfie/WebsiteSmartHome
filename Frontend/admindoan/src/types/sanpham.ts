// src/types/sanPham.ts

export interface SanPhamDto {
    id: string;
    tenSanPham: string;
    donGia: number;
    soLuongTon: number;
    thoiGianBaoHanh: number; // tháng
    ngaySanXuat: Date;
    moTa: string;
    hinhAnh?: string;
  }
  
  export interface SanPhamResponseDto extends SanPhamDto {
    tenDanhMuc: string;
    tenNhaCungCap: string;
    tenKho: string;
    maDanhMuc: string;
    maNhaCungCap: string;
    maKho: string;
  }
  
  export interface SanPhamCreateDto {
    tenSanPham: string;
    donGia: number;
    soLuongTon: number;
    thoiGianBaoHanh: number;
    ngaySanXuat: Date;
    moTa?: string;
  }
  
  export interface SanPhamUpdateDto {
    tenSanPham: string;
    donGia: number;
    soLuongTon?: number;
    thoiGianBaoHanh: number;
    ngaySanXuat: Date;
    moTa: string;
    maDanhMuc: string;
    maNhaCungCap: string;
    maKho: string;
  }
  
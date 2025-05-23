export interface DanhGiaDto {
    id?: string;
    maDonHang: string;
    maSanPham: string;
    maNguoiDung: string;
    tenNguoiDung: string;
    tenSanPham: string;
    soSao: number;
    noiDung: string;
    ngayDanhGia: string;
    ngayDatHang: string;
  }
  
  export interface CreateDanhGiaDto {
    maDonHang: string;
    maSanPham: string;
    maNguoiDung: string;
    soSao: number;
    noiDung: string;
  }
  
  export interface UpdateDanhGiaDto {
    soSao: number;
    noiDung: string;
  }
  
  export interface DanhGiaDetailDto {
    id: string;
    maDonHang: string;
    maSanPham: string;
    maNguoiDung: string;
    soSao: number;
    noiDung: string;
    ngayDanhGia: string;
    tenNguoiDung: string;
    tenSanPham: string;
    ngayDatHang: string | null;
  }
  
  export interface PagedResponse<T> {
    statusCode: number;
    Data: T[];
    PageNumber: number;
    PageSize: number;
    TotalPages: number;
    TotalCount: number;
  }
  
export interface DanhGiaDto {
    id?: string;
    maDonHang?: string;
    maSanPham?: string;
    soSao: number;
    noiDung?: string;
    ngayDanhGia?: string; // ISO date string
  }
  
  export interface CreateDanhGiaDto {
    maDonHang: string;
    maSanPham: string;
    soSao: number;
    noiDung: string;
    ngayDanhGia: string; // Gửi lên server cần định dạng chuẩn ISO
  }
  
  export interface UpdateDanhGiaDto {
    soSao: number;
    noiDung: string;
  }
  
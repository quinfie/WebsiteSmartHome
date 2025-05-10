export interface NguoiDungDto {
    id: string;
    tenNguoiDung: string;
    gioiTinh: string;
    ngaySinh: string | null;
    cccd: string;
    sdt: string;
    diaChi: string;
  }
  
  export interface NguoiDungCreateDto {
    tenNguoiDung: string;
    gioiTinh: string;
    ngaySinh: string | null;
    cccd: string;
    sdt: string;
    diaChi: string;
    maVaiTro: string;
  }
  
  export interface NguoiDungUpdateDto {
    tenNguoiDung?: string;
    gioiTinh?: string;
    ngaySinh?: string | null;
    diaChi?: string;
    cccd?: string;
    sdt?: string;
  }
  
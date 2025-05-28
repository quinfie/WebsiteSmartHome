export interface NguoiDungDto {
  id: string;
  maNguoiDung?: string;
  tenNguoiDung: string;
  gioiTinh: string;
  ngaySinh: Date;
  cccd: string;
  soDienThoai: string;
  diaChi: string;
  tongTienMua?: number;
  isVip?: boolean;
  maTaiKhoan?: string;
  maVaiTro?: string;
  tenVaiTro?: string;
}

export interface NguoiDungUpdateDto {
  tenNguoiDung?: string;
  gioiTinh?: string;
  ngaySinh?: Date;
  cccd?: string;
  sdt?: string;
  diaChi?: string;
  maVaiTro?: string;
}

export interface NguoiDungCreateDto {
  tenNguoiDung: string;
  gioiTinh: string;
  ngaySinh: Date;
  cccd: string;
  sdt: string;
  diaChi: string;
  tenVaiTro: string;
  maTaiKhoan: string;
} 
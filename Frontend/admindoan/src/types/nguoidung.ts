export interface NguoiDungDto {
  id: string;
  maNguoiDung?: string;
  tenNguoiDung: string;
  gioiTinh: string;
  ngaySinh: Date;
  cccd: string;
  soDienThoai: string;
  diaChi: string;
  maTaiKhoan?: string;
  maVaiTro?: string;
  
}

export interface NguoiDungUpdateDto {
  tenNguoiDung: string;
  gioiTinh: string;
  ngaySinh: Date;
  cccd: string;
  soDienThoai: string;
  diaChi: string;
}

export interface NguoiDungCreateDto {
  tenNguoiDung: string;
  gioiTinh: string;
  ngaySinh: Date;
  cccd: string;
  soDienThoai: string;
  diaChi: string;
  maTaiKhoan: string;
  tenVaiTro: string;
} 


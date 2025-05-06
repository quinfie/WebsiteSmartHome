export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  tenTaiKhoan: string;
  matKhau: string;
  tenNguoiDung: string;
  gioiTinh: string;
  ngaySinh: Date;
  cccd: string;
  sdt: string;
  diaChi: string;
  vaiTro: string;
  trangThai: string;
}

export interface AuthResponseDto {
  token: string;
  id: string;
  tenNguoiDung: string;
  tenTaiKhoan: string;
  email: string;
  vaiTro: string;
}

export interface NguoiDungDto {
  maNguoiDung: string;
  tenNguoiDung: string;
  gioiTinh: string;
  ngaySinh: Date;
  cccd: string;
  sdt: string;
  diaChi: string;
  maTaiKhoan: string;
  maVaiTro: string;
}

export interface TaiKhoanDto {
  id: string;
  email: string;
  tenTaiKhoan: string;
  matKhau: string;
  ngayTao: Date;
  trangThai: string;
  vaiTro: string;
  maNguoiDung: string;
  MaNguoiDung?: string;
  nguoiDung?: NguoiDungDto;
}

export interface UpdateTaiKhoanDto {
  email: string;
  tenTaiKhoan: string;
  trangThai: string;
}

export interface UpdateNguoiDungDto {
  tenNguoiDung: string;
  gioiTinh: string;
  ngaySinh: Date;
  cccd: string;
  sdt: string;
  diaChi: string;
}

export interface ChangePasswordDto {
  matKhauCu: string;
  matKhauMoi: string;
}

export interface ForgotPasswordDto {
  email: string;
} 
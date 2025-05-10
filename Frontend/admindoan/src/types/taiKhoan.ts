import { NguoiDungDto } from './auth';

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

export interface TaiKhoanCreateDto {
  email: string;
  tenTaiKhoan: string;
  matKhau: string;
  trangThai?: string;
  ngayTao?: Date;
} 
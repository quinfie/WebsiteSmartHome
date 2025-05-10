import axios from './axios.config';
import {
  DonHangDto,
  ViewResponseCreateDonHangDto,
  RequestCreateDonHangDto,
  RequestUpdateDonHangDto,
  ResponseCreateDonHangDto,
} from '../types/donhang';

export const getAllDonHang = async (): Promise<DonHangDto[]> => {
  const res = await axios.get('/DonHang');
  return res.data.data;
};

export const getDonHangById = async (id: string): Promise<ViewResponseCreateDonHangDto> => {
  const res = await axios.get(`/DonHang/${id}`);
  return res.data.data;
};

export const createDonHang = async (dto: RequestCreateDonHangDto): Promise<ResponseCreateDonHangDto> => {
  const res = await axios.post('/DonHang', dto);
  return res.data.data;
};

export const updateDonHang = async (
  id: string,
  dto: RequestUpdateDonHangDto
): Promise<ResponseCreateDonHangDto> => {
  const res = await axios.put(`/DonHang/${id}`, dto);
  return res.data.data;
};

export const deleteDonHang = async (id: string): Promise<boolean> => {
  const res = await axios.delete(`/DonHang/${id}`);
  return res.data.data;
};

export const getCurrentUserDonHang = async (): Promise<ViewResponseCreateDonHangDto[]> => {
  const res = await axios.get(`/DonHang/current-user`);
  return res.data.data;
};

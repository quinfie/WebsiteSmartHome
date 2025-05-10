import axiosInstance from './axios.config';
import { CreateLichBaoTriDto } from '../types/lichBaoTri';

export const lichBaoTriService = {
  create: (data: CreateLichBaoTriDto) => axiosInstance.post('/LichBaoTri', data),
  getLichBaoTriByDonHangId: (maDonHang: number) =>
    axiosInstance.get(`/LichBaoTri/DonHang/${maDonHang}`),
};

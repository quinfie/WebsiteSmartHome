import api from './axios.config'; // axios instance
import {
  NguoiDungDto,
  NguoiDungCreateDto,
  NguoiDungUpdateDto
} from '../types/nguoidung';

export const getAllNguoiDung = async (): Promise<NguoiDungDto[]> => {
  const response = await api.get('/NguoiDung');
  return response.data.data;
};

export const getNguoiDungById = async (id: string): Promise<NguoiDungDto> => {
  const response = await api.get(`/NguoiDung/${id}`);
  return response.data.data;
};

export const createNguoiDung = async (data: NguoiDungCreateDto): Promise<NguoiDungDto> => {
  const response = await api.post('/NguoiDung', data);
  return response.data.data;
};

export const updateNguoiDung = async (id: string, data: NguoiDungUpdateDto): Promise<string> => {
  const response = await api.put(`/NguoiDung/${id}`, data);
  return response.data.data;
};

export const deleteNguoiDung = async (id: string): Promise<string> => {
  const response = await api.delete(`/NguoiDung/${id}`);
  return response.data.data;
};

export const searchNguoiDung = async (keyword: string): Promise<NguoiDungDto[]> => {
  const response = await api.get(`/NguoiDung/search?keyword=${encodeURIComponent(keyword)}`);
  return response.data.data;
};

export const getKyThuatVien = async (): Promise<NguoiDungDto[]> => {
  const response = await api.get('/NguoiDung/ky-thuat-vien');
  return response.data.data;
};

export const nguoiDungApi = {
  getKyThuatVien: async (): Promise<NguoiDungDto[]> => {
    const res = await api.get("/NguoiDung/ky-thuat-vien");
    return res.data.data;
  }
};

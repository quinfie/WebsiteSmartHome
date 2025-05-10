import axios from './axios.config';
import { NhaCungCapDto, NhaCungCapCreateDto } from '../types/nhacungcap';

const endpoint = '/NhaCungCap';

interface BaseResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }
  
  export const getAllNhaCungCap = () => {
    return axios.get<BaseResponse<NhaCungCapDto[]>>('/NhaCungCap');
  };
export const getNhaCungCapById = (id: string) => axios.get(`${endpoint}/${id}`);

export const createNhaCungCap = (data: NhaCungCapCreateDto) =>
  axios.post(endpoint, data);

export const updateNhaCungCap = (id: string, data: NhaCungCapCreateDto) =>
  axios.put(`${endpoint}/${id}`, data);

export const deleteNhaCungCap = (id: string) =>
  axios.delete(`${endpoint}/${id}`);

export const searchNhaCungCap = async (keyword: string) =>
  axios.get(`${endpoint}/search?keyword=${keyword}`, {
    //headers: { Authorization: `Bearer ${token}` },
  });

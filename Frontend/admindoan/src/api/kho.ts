import axios from './axios.config'; 
import { KhoDto, KhoCreateDto } from '../types/kho';

export const khoApi = {
  getAll: async (): Promise<KhoDto[]> => {
    const res = await axios.get('/Kho');
    return res.data.data;
  },
  create: async (data: KhoCreateDto): Promise<void> => {
    await axios.post('/Kho', data);
  },
};

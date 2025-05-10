import axios from "./axios.config"; 
import {
  CreatePhanCongDichVuDto,
  PhanCongDichVuDto
} from "@/types/phancongdichvu";

export const phanCongDichVuApi = {
  create: async (data: CreatePhanCongDichVuDto): Promise<PhanCongDichVuDto> => {
    const res = await axios.post("/api/PhanCongDichVu/phan-cong", data);
    return res.data.data;
  },

  updateTrangThai: async (id: string, trangThai: string): Promise<PhanCongDichVuDto> => {
    const res = await axios.put(`/api/PhanCongDichVu/trang-thai/${id}`, trangThai, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.data.data;
  },

  hoanThanh: async (id: string): Promise<PhanCongDichVuDto> => {
    const res = await axios.post(`/api/PhanCongDichVu/hoan-thanh/${id}`);
    return res.data.data;
  },
};

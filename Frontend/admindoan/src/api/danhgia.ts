import api from "./axios.config";
import { DanhGiaDto, CreateDanhGiaDto, UpdateDanhGiaDto } from "@/types/danhgia";

const danhGiaService = {
  getAll: async (): Promise<DanhGiaDto[]> => {
    const res = await api.get("/danh_gia");
    return res.data.data;
  },

  getById: async (id: string): Promise<DanhGiaDto> => {
    const res = await api.get(`/danh_gia/${id}`);
    return res.data.data;
  },

  create: async (data: CreateDanhGiaDto): Promise<boolean> => {
    const res = await api.post("/danh_gia", data);
    return res.data.success;
  },

  update: async (
    maDonHang: string,
    maSanPham: string,
    data: UpdateDanhGiaDto
  ): Promise<boolean> => {
    const res = await api.put(`/danh_gia/${maDonHang}/${maSanPham}`, data);
    return res.data.success;
  },

  delete: async (id: string): Promise<boolean> => {
    const res = await api.delete(`/danh_gia/${id}`);
    return res.data.success;
  },

  search: async (noiDung: string): Promise<DanhGiaDto[]> => {
    const res = await api.get(`/danh_gia/search?noiDung=${encodeURIComponent(noiDung)}`);
    return res.data.data;
  },
};

export default danhGiaService;

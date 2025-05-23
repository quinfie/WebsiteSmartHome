import api from "./axios.config";
import { DanhGiaDto, CreateDanhGiaDto, UpdateDanhGiaDto, DanhGiaDetailDto, PagedResponse} from "../types/danhgia";

// Cache for storing API responses
let cachedData: DanhGiaDto[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const danhGiaService = {
  getAll: async (): Promise<DanhGiaDto[]> => {
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedData.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      return cachedData;
    }

    // Fetch new data if cache is invalid
    const res = await api.get(`/DanhGia`);
    cachedData = res.data.data;
    lastFetchTime = now;
    return cachedData;
  },

  getByMaDonHang: async (maDonHang: string): Promise<DanhGiaDto[]> => {
    const res = await api.get(`/DanhGia/by-order-id/${maDonHang}`);
    return res.data.data;
  },

  getByMaSanPham: async (maSanPham: string, pageNumber: number, pageSize: number): Promise<PagedResponse<DanhGiaDto>> => {
    const res = await api.get(`/DanhGia/by-product-id/${maSanPham}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return res.data;
  },

  create: async (data: CreateDanhGiaDto): Promise<boolean> => {
    const res = await api.post("/DanhGia", data);
    // Invalidate cache after creating new data
    cachedData = [];
    return res.data.data;
  },

  update: async (
    maDonHang: string,
    maSanPham: string,
    data: UpdateDanhGiaDto
  ): Promise<boolean> => {
    const res = await api.put(`/DanhGia/${maDonHang}/${maSanPham}`, data);
    // Invalidate cache after updating data
    cachedData = [];
    return res.data.success;
  },

  delete: async (id: string): Promise<boolean> => {
    const res = await api.delete(`/DanhGia/${id}`);
    // Invalidate cache after deleting data
    cachedData = [];
    return res.data.success;
  },

  search: async (noiDung: string): Promise<DanhGiaDto[]> => {
    const res = await api.get(`/DanhGia/search?noiDung=${encodeURIComponent(noiDung)}`);
    return res.data.data;
  },

  getDetailById: async (id: string): Promise<DanhGiaDetailDto> => {
    const res = await api.get(`/DanhGia/${id}`);
    return res.data.data;
  },
};

export default danhGiaService;

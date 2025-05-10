import { DanhMucCreateDto, DanhMucDto, DanhMucUpdateDto } from "@/types/danhmuc";
import axios from "./axios.config";
import { getAccessToken } from "../utils/auth";
import api from "./axios.config";

// Lấy danh sách tất cả danh mục (GET /api/DanhMuc)
export const getAllDanhMuc = async (): Promise<DanhMucDto[]> => {
  const res = await axios.get("/DanhMuc");
  return res.data.data;
};

// Lấy chi tiết danh mục theo ID (GET /api/DanhMuc/{id})
export const getDanhMucById = async (id: string): Promise<DanhMucDto> => {
  const res = await axios.get(`/DanhMuc/${id}`);
  return res.data.data;
};

// Tạo danh mục mới (POST /api/DanhMuc)
export const createDanhMuc = async (dto: DanhMucCreateDto): Promise<DanhMucCreateDto> => {
  const token = await getAccessToken();
  const res = await axios.post("/DanhMuc", dto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

// Cập nhật danh mục (PUT /api/DanhMuc)
export const updateDanhMuc = async (data: FormData, token?: string) => {
    const response = await axios.put("/DanhMuc", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };
  

// Xóa danh mục (DELETE /api/DanhMuc/{id})
export const deleteDanhMuc = async (id: string): Promise<boolean> => {
  const token = await getAccessToken();
  const res = await axios.delete(`/DanhMuc/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

// Tìm kiếm danh mục theo keyword (GET /api/DanhMuc/search?keyword=...)
export const searchDanhMuc = async (keyword: string): Promise<DanhMucDto[]> => {
  const res = await axios.get(`/DanhMuc/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data.data;
};

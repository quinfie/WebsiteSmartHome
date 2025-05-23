import { KhuyenMaiCreateDto, KhuyenMaiDto, KhuyenMaiUpdateDto, KhuyenMaiApplyDto } from "../types/khuyenmai";
import axios from "./axios.config";
import { getAccessToken } from "../utils/auth";

// Lấy tất cả khuyến mãi
export const getAllPromotions = async (): Promise<KhuyenMaiDto[]> => {
  const token = await getAccessToken();
  const res = await axios.get("/KhuyenMai/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

// Lấy danh sách khuyến mãi hợp lệ cho giỏ hàng
export const getValidPromotions = async (tongTien: number): Promise<KhuyenMaiDto[]> => {
  const res = await axios.get(`/KhuyenMai/valid?tongTien=${tongTien}`);
  return res.data.data;
};

// Lấy chi tiết khuyến mãi theo ID
export const getKhuyenMaiById = async (id: string): Promise<KhuyenMaiDto> => {
  const res = await axios.get(`/KhuyenMai/${id}`);
  return res.data.data;
};

// Tạo khuyến mãi mới
export const createKhuyenMai = async (dto: KhuyenMaiCreateDto): Promise<KhuyenMaiDto> => {
  const token = await getAccessToken();
  const res = await axios.post("/KhuyenMai", dto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

// Cập nhật khuyến mãi
export const updateKhuyenMai = async (id: string, dto: KhuyenMaiUpdateDto): Promise<KhuyenMaiDto> => {
  try {
    const token = await getAccessToken();
    const res = await axios.put(`/KhuyenMai/${id}`, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data.data;
  } catch (error: any) {
    console.error('API Error:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message
    });
    throw error;
  }
};

// Xóa khuyến mãi
export const deleteKhuyenMai = async (id: string): Promise<boolean> => {
  const token = await getAccessToken();
  const res = await axios.delete(`/KhuyenMai/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

// Áp dụng khuyến mãi vào giỏ hàng
export const applyPromotion = async (promotionId: string, cartTotal: number): Promise<KhuyenMaiApplyDto> => {
  const res = await axios.post("/KhuyenMai/apply", {
    promotionId,
    cartTotal,
  });
  return res.data.data;
}; 
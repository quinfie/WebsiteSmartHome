import api from './axios.config';
import { SanPhamDto } from '../types/sanpham';

interface WishlistItem {
  id: string;
  sanPhamId: string;
  ngayThem: Date;
  sanPham: SanPhamDto;
}

interface WishlistDto {
  id: string;
  userId: string;
  items: WishlistItem[];
}

export const wishlistService = {
  // Lấy danh sách yêu thích của người dùng
  getWishlist: async (): Promise<WishlistDto> => {
    const response = await api.get('/YeuThich');
    return response.data.data;
  },

  // Thêm sản phẩm vào danh sách yêu thích
  addToWishlist: async (sanPhamId: string): Promise<WishlistDto> => {
    const response = await api.post('/YeuThich/add', { sanPhamId });
    return response.data.data;
  },

  // Xóa sản phẩm khỏi danh sách yêu thích
  removeFromWishlist: async (sanPhamId: string): Promise<WishlistDto> => {
    const response = await api.delete(`/YeuThich/remove/${sanPhamId}`);
    return response.data.data;
  },

  // Kiểm tra sản phẩm có trong danh sách yêu thích không
  isProductInWishlist: async (sanPhamId: string): Promise<boolean> => {
    const response = await api.get(`/YeuThich/check/${sanPhamId}`);
    return response.data.data;
  }
}; 
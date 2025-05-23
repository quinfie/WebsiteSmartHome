import api from './axios.config';
import { createDonHang } from './donhang';
import { RequestCreateDonHangDto } from '../types/donhang';
import { BaseResponse } from '../types/common';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  tenSanPham?: string;
  hinhAnh?: string;
  soLuongTon?: number;
}

interface Cart {
  items: CartItem[];
  totalAmount: number;
}

// Get cart from localStorage
export const getCartFromStorage = (): Cart => {
  const cartJson = localStorage.getItem('cart');
  const cart = cartJson ? JSON.parse(cartJson) : { items: [], totalAmount: 0 };
  return cart;
};

// Save cart to localStorage
export const saveCartToStorage = (cart: Cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Calculate total price
export const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Clear cart
export const clearCart = () => {
  saveCartToStorage({ items: [], totalAmount: 0 });
};

export const cartApi = {
  // Chuyển giỏ hàng thành đơn hàng thực tế
  checkout: async (checkoutData: {
    maKhuyenMai: string | null;
    tongTien: number;
    tongTienSauGiam: number;
    phiVanChuyen: number;
  }): Promise<BaseResponse<{ id: string }>> => {
    try {
      const cart = getCartFromStorage();
      
      if (cart.items.length === 0) {
        throw new Error('Giỏ hàng trống');
      }
      
      // Tạo đối tượng RequestCreateDonHangDto
      const donHangDto: RequestCreateDonHangDto = {
        maKhuyenMai: checkoutData.maKhuyenMai,
        chiTietDonHangs: cart.items.map(item => ({
          maSanPham: item.id,
          soLuongMua: item.quantity,
          donGiaMua: item.price
        }))
      };

      // Gọi API tạo đơn hàng
      console.log('Creating order with data:', donHangDto);
      const response = await createDonHang(donHangDto);
      console.log('Order creation response:', response);

      // Check for success and if data and data.id exist
      if (!response.success || !response.data || !response.data.id) {
        throw new Error(response.message || 'Không nhận được mã đơn hàng từ server');
      }

      // Xóa giỏ hàng sau khi đặt hàng thành công
      clearCart();

      return response; // Return the full BaseResponse
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (sanPhamId: string, soLuong: number): Promise<boolean> => {
    try {
      const formattedId = sanPhamId.toString();
      const cart = getCartFromStorage();
      
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.id === formattedId);
      
      try {
        // Get product details from API
        const response = await api.get(`/SanPham/${formattedId}`);
        const product = response.data.data;

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          cart.items[existingItemIndex].quantity += soLuong;
          cart.items[existingItemIndex].price = product.donGia;
          cart.items[existingItemIndex].tenSanPham = product.tenSanPham;
          cart.items[existingItemIndex].hinhAnh = product.hinhAnh;
          cart.items[existingItemIndex].soLuongTon = product.soLuongTon;
        } else {
          // Add new item
          cart.items.push({
            id: formattedId,
            quantity: soLuong,
            price: product.donGia,
            tenSanPham: product.tenSanPham,
            hinhAnh: product.hinhAnh,
            soLuongTon: product.soLuongTon
          });
        }

        cart.totalAmount = calculateTotalPrice(cart.items);
        saveCartToStorage(cart);
        return true;
      } catch (error) {
        console.error('Error fetching product details:', error);
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity: async (itemId: string, quantity: number): Promise<boolean> => {
    try {
      const cart = getCartFromStorage();
      
      const itemIndex = cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          cart.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          cart.items[itemIndex].quantity = quantity;
        }
        
        cart.totalAmount = calculateTotalPrice(cart.items);
        saveCartToStorage(cart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (itemId: string): Promise<boolean> => {
    try {
      const cart = getCartFromStorage();
      
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      cart.items = updatedItems;
      cart.totalAmount = calculateTotalPrice(updatedItems);
      
      saveCartToStorage(cart);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<boolean> => {
    clearCart();
    return Promise.resolve(true);
  }
}; 


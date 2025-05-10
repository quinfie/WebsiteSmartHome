// src/utils/auth.ts

// Lấy token từ localStorage
export const getToken = (): string | null => {
    return localStorage.getItem("token");
  };
  
  // Lưu token vào localStorage
  export const setToken = (token: string): void => {
    localStorage.setItem("token", token);
  };
  
  // Xoá token khỏi localStorage
  export const removeToken = (): void => {
    localStorage.removeItem("token");
  };
  
  // Lấy accessToken nếu lưu dưới dạng object JSON (ví dụ: từ user info)
  export const getAccessToken = (): string | null => {
    const userInfo = localStorage.getItem("user");
    if (!userInfo) return null;
  
    try {
      const user = JSON.parse(userInfo);
      return user?.accessToken || null;
    } catch {
      return null;
    }
  };
  
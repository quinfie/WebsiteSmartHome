import api from "./axios.config";

export const vaiTroService = {
  // Lấy toàn bộ vai trò
  getAll: async () => {
    const res = await api.get("/vaitro");
    return res.data; // Mảng VaiTroDto: { id, tenVaiTro }
  },

  // Lấy vai trò theo ID
  getById: async (id: string) => {
    const res = await api.get(`/vaitro/${id}`);
    return res.data;
  },

  // Tạo vai trò mới
  create: async (tenVaiTro: string) => {
    const res = await api.post("/vaitro", { tenVaiTro });
    return res.data;
  },

  // Cập nhật vai trò
  update: async (id: string, tenVaiTro: string) => {
    const res = await api.put(`/vaitro/${id}`, { tenVaiTro });
    return res.data;
  },

  // Xóa vai trò
  delete: async (id: string) => {
    const res = await api.delete(`/vaitro/${id}`);
    return res.data;
  },

  // Tìm kiếm vai trò theo từ khoá
  search: async (keyword: string) => {
    const res = await api.get(`/vaitro/search`, {
      params: { keyword }
    });
    return res.data;
  },

  // Lấy ID vai trò theo tên (nếu có endpoint hỗ trợ, ví dụ /vaitro/by-name)
  getIdByName: async (tenVaiTro: string) => {
    const res = await api.get(`/vaitro/by-name`, {
      params: { rolename: tenVaiTro }
    });
    return res.data; // Giả sử trả về GUID
  }
};

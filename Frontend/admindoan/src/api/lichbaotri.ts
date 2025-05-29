import { LichBaoTriDto } from "../types/lichBaoTri";
import axios from "./axios.config";

// Lấy tất cả lịch bảo trì
export const getAllLichBaoTri = async (): Promise<LichBaoTriDto[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Không có token xác thực");
    }

    const response = await axios.get('/lich_bao_tri', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data) {
      throw new Error("Không có dữ liệu trả về");
    }

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lịch bảo trì:", error);
    throw error;
  }
};

// Lấy danh sách lịch bảo trì theo mã đơn hàng
export const getLichBaoTriByDonHangId = async (donHangId: string): Promise<LichBaoTriDto[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Không có token xác thực");
    }

    const response = await axios.get(`/lich_bao_tri/donhang/${donHangId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data) {
      throw new Error("Không có dữ liệu trả về");
    }

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch bảo trì:", error);
    throw error;
  }
};

// Lấy danh sách lịch bảo trì theo mã chi tiết đơn hàng
export const getLichBaoTriByChiTietDonHangId = async (chiTietDonHangId: number): Promise<LichBaoTriDto[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Không có token xác thực");
    }

    const response = await axios.get(`/lich_bao_tri/chitietdonhang/${chiTietDonHangId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data) {
      throw new Error("Không có dữ liệu trả về");
    }

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch bảo trì:", error);
    throw error;
  }
};

// Tạo lịch bảo trì mới
export const createLichBaoTri = async (lichBaoTri: Partial<LichBaoTriDto>): Promise<LichBaoTriDto> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Không có token xác thực");
    }

    const response = await axios.post("/lich_bao_tri", lichBaoTri, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data) {
      throw new Error("Không có dữ liệu trả về");
    }

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi tạo lịch bảo trì:", error);
    throw error;
  }
};

// Cập nhật lịch bảo trì
export const updateLichBaoTri = async (id: string, lichBaoTri: Partial<LichBaoTriDto>): Promise<LichBaoTriDto> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Không có token xác thực");
    }

    const response = await axios({
      method: 'PUT',
      url: `/lich_bao_tri/${id}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: lichBaoTri
    });

    if (!response.data) {
      throw new Error("Không có dữ liệu trả về");
    }

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật lịch bảo trì:", error);
    throw error;
  }
};

// Xóa lịch bảo trì
export const deleteLichBaoTri = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Không có token xác thực");
    }

    await axios.delete(`/lich_bao_tri/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Lỗi khi xóa lịch bảo trì:", error);
    throw error;
  }
};

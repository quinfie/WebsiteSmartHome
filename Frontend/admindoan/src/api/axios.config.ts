import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5133/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động thêm token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log("=== TOKEN GỬI ĐI ===", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'Có lỗi xảy ra');
    } else if (error.request) {
      console.error('Network Error:', error.request);
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      console.error('Request Error:', error.message);
      throw new Error('Có lỗi xảy ra khi gửi yêu cầu');
    }
  }
);


export default api;

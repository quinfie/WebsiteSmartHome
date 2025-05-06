import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5133/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server trả về lỗi
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'Có lỗi xảy ra');
    } else if (error.request) {
      // Không nhận được response từ server
      console.error('Network Error:', error.request);
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Lỗi khi thiết lập request
      console.error('Request Error:', error.message);
      throw new Error('Có lỗi xảy ra khi gửi yêu cầu');
    }
  }
);

export default api; 
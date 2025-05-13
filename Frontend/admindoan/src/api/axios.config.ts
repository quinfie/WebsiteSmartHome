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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log request data
  if (config.data) {
    console.log('Request data:', JSON.stringify(config.data));
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log đầy đủ thông tin lỗi để debug
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      }
    });

    if (error.response) {
      const data = error.response.data;

      // Xử lý lỗi từ server
      const message =
        data?.errorMessage ||
        data?.message ||
        data?.title ||
        data?.error ||
        (typeof data === 'string' ? data : null) ||
        'Có lỗi xảy ra';

      const code = data?.errorCode ? `[${data.errorCode}] ` : '';

      // Log lỗi chi tiết
      console.error('API Error:', {
        code: data?.errorCode,
        message: message,
        data: data
      });

      throw new Error(`${code}${message}`);
    } else if (error.request) {
      // Log lỗi kết nối
      console.error('Network Error:', {
        request: error.request,
        message: 'Không thể kết nối đến máy chủ'
      });
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Log lỗi cấu hình request
      console.error('Request Setup Error:', {
        message: error.message,
        config: error.config
      });
      throw new Error('Có lỗi xảy ra khi gửi yêu cầu');
    }
  }
);

export default api;

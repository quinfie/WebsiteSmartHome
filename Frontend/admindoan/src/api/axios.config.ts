import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5133/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;

      // Xử lý lỗi từ server
      // Nếu có thông báo lỗi từ server thì sử dụng thông báo đó
      const message =
        data?.errorMessage
        data?.message ||
        data?.title ||
        data?.error ||
        (typeof data === 'string' ? data : null) ||
        'Có lỗi xảy ra';

      const code = data?.errorCode ? `[${data.errorCode}] ` : '';

      console.error('API Error:', data);
      throw new Error(`${code}${message}`); // Trả lỗi rõ cho FE
    } else if (error.request) {
      console.error('Network Error:', error.request);
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      console.error('Request Setup Error:', error.message);
      throw new Error('Có lỗi xảy ra khi gửi yêu cầu');
    }
  }
);

export default api;

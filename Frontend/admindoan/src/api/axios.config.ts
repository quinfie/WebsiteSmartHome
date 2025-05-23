import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5133/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for token handling
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Log the request URL and token (first 10 chars)
    //console.log(`Request to ${config.url} with token: ${token.substring(0, 10)}...`);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    //console.log(`Request to ${config.url} without token`);
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      config: error.config,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response) {
      // Server returned an error response
      const data = error.response.data;
      
      // Get the error message from the response
      let message = '';
      
      // Handle validation errors
      if (error.response.status === 400 && data.errors) {
        // Combine all validation errors into one message
        message = Object.values(data.errors)
          .flat()
          .join(', ');
      } else {
        message = data?.errorMessage || 
                 data?.message || 
                 data?.title || 
                 data?.error || 
                 (typeof data === 'string' ? data : null) ||
                 'Có lỗi xảy ra';
      }

      // // Handle 401 Unauthorized
      // if (error.response.status === 401) {
      //   console.log('401 Unauthorized - Current token:', localStorage.getItem('token'));
        
      //   // Clear auth data
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('userInfo');
      //   localStorage.removeItem('vaiTro');
        
      //   // Add small delay to ensure error message is shown
      //   await new Promise(resolve => setTimeout(resolve, 100));
        
      //   // Redirect to login
      //   window.location.href = '/ecommerce/login';
      //   return Promise.reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
      // }

      // Handle 404 Not Found
      if (error.response.status === 404) {
        return Promise.reject(new Error('Không tìm thấy tài nguyên yêu cầu'));
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        return Promise.reject(new Error('Bạn không có quyền thực hiện thao tác này'));
      }

      // Handle 400 Bad Request
      if (error.response.status === 400) {
        return Promise.reject(new Error(message || 'Dữ liệu gửi lên không hợp lệ'));
      }

      // Handle other error codes
      throw new Error(message);
    }

    // Handle network errors or other issues
    console.error('Network or other error:', error);
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
  }
);

export default api;

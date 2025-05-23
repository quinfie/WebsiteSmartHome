import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginComponent from '../components/LoginComponent';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Check if user was directed here from the ecommerce login page
  useEffect(() => {
    // If there's no bypass flag, redirect to ecommerce login
    if (!sessionStorage.getItem('useAdminLogin')) {
      navigate('/ecommerce/login');
    } else {
      // Clear the flag after use
      sessionStorage.removeItem('useAdminLogin');
    }
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    setError("");
    try {
      // Gọi login và lấy response
      await login(email, password);

      // Lấy vai trò từ localStorage
      const vaiTro = localStorage.getItem('vaiTro');

      // Phân quyền và chuyển hướng dựa trên vai trò
      if (vaiTro === "Khách Hàng") {
        // Nếu là khách hàng, chuyển hướng đến trang ecommerce
        navigate('/ecommerce');
      } else if (
        vaiTro === "Quản Trị Viên" ||
        vaiTro === "Quản Lí" ||
        vaiTro === "Nhân Viên"
      ) {
        // Nếu là admin hoặc nhân viên, chuyển hướng đến dashboard
        navigate('/dashboard');
      } else {
        setError("Không có quyền truy cập");
      }
    } catch (error) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginComponent onLogin={handleLogin} error={error} />
    </div>
  );
};

export default Login;

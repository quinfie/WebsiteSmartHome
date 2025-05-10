import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginComponent from '../components/LoginComponent';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    setError("");
    try {
      // Gọi login và lấy response
      const response = await login(email, password);
      // Lấy vai trò từ localStorage hoặc response
      const vaiTro = response?.vaiTro || localStorage.getItem('vaiTro');
      if (
        vaiTro === "Quản Trị Viên" ||
        vaiTro === "Quản Lí" ||
        vaiTro === "Nhân Viên"
      ) {
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

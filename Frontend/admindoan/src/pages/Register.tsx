import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterRequestDto } from '../types/auth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequestDto>({
    email: '',
    tenTaiKhoan: '',
    matKhau: '',
    tenNguoiDung: '',
    gioiTinh: '',
    ngaySinh: new Date(),
    cccd: '',
    sdt: '',
    diaChi: '',
    vaiTro: 'Khách Hàng',
    trangThai: 'Chờ xác minh'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản của bạn.');
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sau khi đăng ký, bạn cần xác thực email để kích hoạt tài khoản
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="tenTaiKhoan" className="sr-only">
                Tên tài khoản
              </label>
              <input
                id="tenTaiKhoan"
                name="tenTaiKhoan"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Tên tài khoản"
                value={formData.tenTaiKhoan}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="matKhau" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="matKhau"
                name="matKhau"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={formData.matKhau}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="tenNguoiDung" className="sr-only">
                Tên người dùng
              </label>
              <input
                id="tenNguoiDung"
                name="tenNguoiDung"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Tên người dùng"
                value={formData.tenNguoiDung}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="gioiTinh" className="sr-only">
                Giới tính
              </label>
              <select
                id="gioiTinh"
                name="gioiTinh"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.gioiTinh}
                onChange={handleChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label htmlFor="ngaySinh" className="sr-only">
                Ngày sinh
              </label>
              <input
                id="ngaySinh"
                name="ngaySinh"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.ngaySinh.toISOString().split('T')[0]}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="cccd" className="sr-only">
                CCCD
              </label>
              <input
                id="cccd"
                name="cccd"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="CCCD"
                value={formData.cccd}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="sdt" className="sr-only">
                Số điện thoại
              </label>
              <input
                id="sdt"
                name="sdt"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Số điện thoại"
                value={formData.sdt}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="diaChi" className="sr-only">
                Địa chỉ
              </label>
              <input
                id="diaChi"
                name="diaChi"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ"
                value={formData.diaChi}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

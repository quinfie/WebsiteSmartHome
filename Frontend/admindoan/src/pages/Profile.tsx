import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UpdateTaiKhoanDto, UpdateNguoiDungDto } from '../types/auth';
import { HiOutlineSave, HiOutlineUpload, HiOutlineUser } from "react-icons/hi";
import { InputWithLabel, Sidebar, SimpleInput, WhiteButton } from "../components";
import { authService } from '../api/auth';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [taiKhoanData, setTaiKhoanData] = useState<UpdateTaiKhoanDto>({
    email: '',
    tenTaiKhoan: '',
    trangThai: ''
  });
  const [nguoiDungData, setNguoiDungData] = useState<UpdateNguoiDungDto>({
    tenNguoiDung: '',
    gioiTinh: '',
    ngaySinh: new Date(),
    cccd: '',
    sdt: '',
    diaChi: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateCCCD = (cccd: string) => {
    const cccdRegex = /^[0-9]{12}$/;
    return cccdRegex.test(cccd);
  };

  const validateForm = () => {
    if (!taiKhoanData.email || !validateEmail(taiKhoanData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!taiKhoanData.tenTaiKhoan || taiKhoanData.tenTaiKhoan.length < 3) {
      setError('Tên tài khoản phải có ít nhất 3 ký tự');
      return false;
    }
    if (!nguoiDungData.tenNguoiDung) {
      setError('Họ và tên không được để trống');
      return false;
    }
    if (!nguoiDungData.cccd || !validateCCCD(nguoiDungData.cccd)) {
      setError('CCCD phải có đúng 12 số');
      return false;
    }
    if (!nguoiDungData.sdt || !validatePhone(nguoiDungData.sdt)) {
      setError('Số điện thoại phải có đúng 10 số');
      return false;
    }
    if (!nguoiDungData.diaChi) {
      setError('Địa chỉ không được để trống');
      return false;
    }
    return true;
  };

  const fetchUserData = async () => {
    try {
      if (user?.maNguoiDung) {
        const nguoiDung = await authService.getNguoiDungByTaiKhoanId(user.maNguoiDung);
        setNguoiDungData({
          tenNguoiDung: nguoiDung.tenNguoiDung,
          gioiTinh: nguoiDung.gioiTinh,
          ngaySinh: new Date(nguoiDung.ngaySinh),
          cccd: nguoiDung.cccd,
          sdt: nguoiDung.sdt,
          diaChi: nguoiDung.diaChi
        });
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setError(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setTaiKhoanData({
        email: user.email,
        tenTaiKhoan: user.tenTaiKhoan,
        trangThai: user.trangThai
      });
      fetchUserData();
    }
  }, [user]);

  const handleTaiKhoanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaiKhoanData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleNguoiDungChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNguoiDungData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(taiKhoanData, nguoiDungData);
      setMessage('Cập nhật thông tin thành công');
      await fetchUserData();
    } catch (error: any) {
      console.error('Update error:', error); // Thêm dòng này để xem chi tiết lỗi
      setError(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        error.message ||
        'Cập nhật thông tin thất bại'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Hồ sơ của bạn
              </h2>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <HiOutlineSave className="text-xl" />
              <span>{isSubmitting ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}</span>
            </button>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            {message && (
              <div className="mb-4 p-4 rounded-md bg-green-100 text-green-700">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 rounded-md bg-red-100 text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-10">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <HiOutlineUser className="text-4xl text-gray-500" />
                  </div>
                  <div>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-xl">
                      {nguoiDungData.tenNguoiDung || user.tenTaiKhoan}
                    </p>
                    <p className="dark:text-whiteSecondary text-blackPrimary">
                      {user.vaiTro}
                    </p>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-sm">
                      Trạng thái: {user.trangThai}
                    </p>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-sm">
                      Ngày tạo: {user.ngayTao ? new Date(user.ngayTao).toLocaleDateString() : ''}
                    </p>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-sm">
                      Email: {user.email}
                    </p>
                  </div>
                </div>

                <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-72 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                  <HiOutlineUpload className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                  <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                    Thay đổi ảnh đại diện
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium dark:text-whiteSecondary text-blackPrimary">Thông tin tài khoản</h3>
                  <InputWithLabel label="Tên đăng nhập">
                    <SimpleInput
                      name="tenTaiKhoan"
                      type="text"
                      value={taiKhoanData.tenTaiKhoan}
                      onChange={handleTaiKhoanChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Email">
                    <SimpleInput
                      name="email"
                      type="email"
                      value={taiKhoanData.email}
                      onChange={handleTaiKhoanChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Trạng thái">
                    <select
                      name="trangThai"
                      value={taiKhoanData.trangThai}
                      onChange={handleTaiKhoanChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="Hoạt Động">Hoạt Động</option>
                      <option value="Bị Khóa">Bị Khóa</option>
                    </select>
                  </InputWithLabel>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium dark:text-whiteSecondary text-blackPrimary">Thông tin cá nhân</h3>
                  <InputWithLabel label="Họ và tên">
                    <SimpleInput
                      name="tenNguoiDung"
                      type="text"
                      value={nguoiDungData.tenNguoiDung}
                      onChange={handleNguoiDungChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Giới tính">
                    <select
                      name="gioiTinh"
                      value={nguoiDungData.gioiTinh}
                      onChange={handleNguoiDungChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </InputWithLabel>
                  <InputWithLabel label="Ngày sinh">
                    <SimpleInput
                      name="ngaySinh"
                      type="date"
                      value={nguoiDungData.ngaySinh.toISOString().split('T')[0]}
                      onChange={handleNguoiDungChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="CCCD">
                    <SimpleInput
                      name="cccd"
                      type="text"
                      value={nguoiDungData.cccd}
                      onChange={handleNguoiDungChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Số điện thoại">
                    <SimpleInput
                      name="sdt"
                      type="tel"
                      value={nguoiDungData.sdt}
                      onChange={handleNguoiDungChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Địa chỉ">
                    <SimpleInput
                      name="diaChi"
                      type="text"
                      value={nguoiDungData.diaChi}
                      onChange={handleNguoiDungChange}
                    />
                  </InputWithLabel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

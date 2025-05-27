import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UpdateTaiKhoanDto, UpdateNguoiDungDto } from '../types/auth';
import { HiOutlineUser } from "react-icons/hi";
import { InputWithLabel, Sidebar, SimpleInput } from "../components";
import { authService } from '../api/auth';
import SelectInput from '../components/SelectInput';
import { nguoiDungService } from '../api/nguoiDungApi';

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
      const profile = await authService.getProfile();
      setTaiKhoanData({
        email: profile.email,
        tenTaiKhoan: profile.tenTaiKhoan,
        trangThai: profile.trangThai
      });

      // Lấy thông tin người dùng nếu có maNguoiDung
      if (profile.maNguoiDung) {
        const nguoiDung = await nguoiDungService.getById(profile.maNguoiDung);
        setNguoiDungData({
          tenNguoiDung: nguoiDung.tenNguoiDung,
          gioiTinh: nguoiDung.gioiTinh,
          ngaySinh: new Date(nguoiDung.ngaySinh),
          cccd: nguoiDung.cccd,
          sdt: nguoiDung.soDienThoai,
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
    fetchUserData();
  }, []);

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
      console.error('Update error:', error);
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
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
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4 dark:text-whiteSecondary text-blackPrimary">
                  Thông tin tài khoản
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithLabel label="Email">
                    <SimpleInput
                      type="email"
                      name="email"
                      value={taiKhoanData.email}
                      onChange={handleTaiKhoanChange}
                      required
                      disabled={true}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Tên tài khoản">
                    <SimpleInput
                      type="text"
                      name="tenTaiKhoan"
                      value={taiKhoanData.tenTaiKhoan}
                      onChange={handleTaiKhoanChange}
                      required
                      disabled={true}
                    />
                  </InputWithLabel>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4 dark:text-whiteSecondary text-blackPrimary">
                  Thông tin cá nhân
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithLabel label="Họ và tên">
                    <SimpleInput
                      type="text"
                      name="tenNguoiDung"
                      value={nguoiDungData.tenNguoiDung}
                      onChange={handleNguoiDungChange}
                      required
                      disabled={true}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Giới tính">
                    <SelectInput
                      selectList={[
                        { value: 'Nam', label: 'Nam' },
                        { value: 'Nữ', label: 'Nữ' },
                      ]}
                      name="gioiTinh"
                      value={nguoiDungData.gioiTinh}
                      onChange={handleNguoiDungChange}
                      disabled={true}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Ngày sinh">
                    <SimpleInput
                      type="date"
                      name="ngaySinh"
                      value={nguoiDungData.ngaySinh.toISOString().split('T')[0]}
                      onChange={handleNguoiDungChange}
                      required
                      disabled={true}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="CCCD">
                    <SimpleInput
                      type="text"
                      name="cccd"
                      value={nguoiDungData.cccd}
                      onChange={handleNguoiDungChange}
                      required
                      disabled={true}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Số điện thoại">
                    <SimpleInput
                      type="tel"
                      name="sdt"
                      value={nguoiDungData.sdt}
                      onChange={handleNguoiDungChange}
                      required
                      disabled={true}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Địa chỉ">
                    <SimpleInput
                      type="text"
                      name="diaChi"
                      value={nguoiDungData.diaChi}
                      onChange={handleNguoiDungChange}
                      required
                      disabled={true}
                    />
                  </InputWithLabel>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

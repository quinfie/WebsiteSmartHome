import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSave, HiOutlineUserAdd } from "react-icons/hi";
import {
  InputWithLabel,
  Sidebar,
  SimpleInput,
} from "../components";
import SelectInput from "../components/SelectInput";
import { roles } from "../utils/data";
import { nguoiDungService } from "../api/nguoiDungApi";
import { taiKhoanService } from "../api/taiKhoanApi";
import { TaiKhoanCreateDto } from "../types/taiKhoan";

const CreateUser = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [accountData, setAccountData] = useState<TaiKhoanCreateDto>({
    email: "",
    tenTaiKhoan: "",
    matKhau: "",
    trangThai: "Hoạt động",
  });

  const [userData, setUserData] = useState({
    tenNguoiDung: "",
    gioiTinh: "Nam",
    ngaySinh: new Date(),
    cccd: "",
    sdt: "",
    diaChi: "",
    maTaiKhoan: "",
    tenVaiTro: ""
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAccount = async () => {
    setError("");
    setMessage("");

    try {
      const taiKhoanResponse = await taiKhoanService.create(accountData);

      const nguoiDungResponse = await nguoiDungService.create({
        ...userData,
        maTaiKhoan: taiKhoanResponse.id,
      });

      setMessage("Thêm người dùng thành công!");
      setTimeout(() => navigate("/dashboard/users"), 1500);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.response?.data?.errorMessage || "Thêm người dùng thất bại";
      setError(errorMessage);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary min-h-screen">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full flex flex-col items-center py-10">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row gap-8 mb-8">
            {/* Card: Thông tin tài khoản */}
            <div className="flex-1 bg-white dark:bg-blackSecondary rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <HiOutlineUserAdd className="text-2xl text-blue-500" />
                <h3 className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary">Thông tin tài khoản</h3>
              </div>
              <div className="flex flex-col gap-5">
                <InputWithLabel label="Email">
                  <SimpleInput
                    type="email"
                    name="email"
                    placeholder="Nhập email..."
                    value={accountData.email}
                    onChange={handleAccountChange}
                  />
                </InputWithLabel>
                <InputWithLabel label="Tên tài khoản">
                  <SimpleInput
                    type="text"
                    name="tenTaiKhoan"
                    placeholder="Nhập tên tài khoản..."
                    value={accountData.tenTaiKhoan}
                    onChange={handleAccountChange}
                  />
                </InputWithLabel>
                <InputWithLabel label="Mật khẩu">
                  <SimpleInput
                    type="password"
                    name="matKhau"
                    placeholder="Nhập mật khẩu..."
                    value={accountData.matKhau}
                    onChange={handleAccountChange}
                  />
                </InputWithLabel>
              </div>
            </div>
            {/* Card: Thông tin người dùng */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="bg-white dark:bg-blackSecondary rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <HiOutlineUserAdd className="text-2xl text-green-500" />
                  <h3 className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary">Thông tin người dùng</h3>
                </div>
                <div className="flex flex-col gap-5">
                  <InputWithLabel label="Tên">
                    <SimpleInput
                      type="text"
                      name="tenNguoiDung"
                      placeholder="Nhập tên..."
                      value={userData.tenNguoiDung}
                      onChange={handleUserChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Giới tính">
                    <SelectInput
                      selectList={[
                        { value: 'Nam', label: 'Nam' },
                        { value: 'Nữ', label: 'Nữ' },
                      ]}
                      name="gioiTinh"
                      value={userData.gioiTinh}
                      onChange={handleUserChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Ngày sinh">
                    <SimpleInput
                      type="date"
                      name="ngaySinh"
                      value={userData.ngaySinh ? new Date(userData.ngaySinh).toISOString().split('T')[0] : ""}
                      onChange={handleUserChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="CCCD">
                    <SimpleInput
                      type="text"
                      name="cccd"
                      placeholder="Nhập CCCD..."
                      value={userData.cccd}
                      onChange={handleUserChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Số điện thoại">
                    <SimpleInput
                      type="text"
                      name="sdt"
                      placeholder="Nhập số điện thoại..."
                      value={userData.sdt}
                      onChange={handleUserChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Địa chỉ">
                    <SimpleInput
                      type="text"
                      name="diaChi"
                      placeholder="Nhập địa chỉ..."
                      value={userData.diaChi}
                      onChange={handleUserChange}
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Vai trò">
                    <SelectInput
                      selectList={roles}
                      name="tenVaiTro"
                      value={userData.tenVaiTro}
                      onChange={handleUserChange}
                    />
                  </InputWithLabel>
                </div>
              </div>
            </div>
          </div>

          {/* Thông báo lỗi/thành công */}
          {error && (
            <div className="w-full max-w-2xl mx-auto mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <span className="font-bold">Lỗi:</span> {error}
            </div>
          )}
          {message && (
            <div className="w-full max-w-2xl mx-auto mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <span className="font-bold">Thành công:</span> {message}
            </div>
          )}

          {/* Nút hành động */}
          <div className="flex justify-end gap-4 w-full max-w-6xl mt-2">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-blackPrimary font-semibold py-2 px-6 rounded-lg border border-gray-400 transition-colors"
              onClick={() => navigate("/dashboard/users")}
            >
              Hủy
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg flex items-center gap-2 shadow-md transition-colors"
              onClick={handleCreateAccount}
            >
              <HiOutlineSave className="text-xl" />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default CreateUser;

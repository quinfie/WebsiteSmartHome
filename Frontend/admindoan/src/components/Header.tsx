import { FaReact } from "react-icons/fa6";
import { HiOutlineMoon, HiOutlineSun, HiOutlineLogout, HiOutlineUser, HiOutlineCog } from "react-icons/hi";
import { HiOutlineBell } from "react-icons/hi";
import { HiOutlineMenu } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { toggleDarkMode } from "../features/darkMode/darkModeSlice";
import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";

// Hàm ánh xạ vai trò sang tên tiếng Việt
const getTenVaiTro = (vaiTro?: string) => {
  switch (vaiTro) {
    case "Admin":
      return "Quản trị viên";
    case "Customer":
      return "Khách hàng";
    case "Worker":
      return "Nhân viên";
    case "Manager":
      return "Quản lý";
    default:
      return vaiTro || "Vai trò";
  }
};

const Header = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.darkMode);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserModal, setShowUserModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="dark:bg-blackPrimary bg-whiteSecondary relative">
      <div className="flex justify-between items-center px-9 py-5 max-xl:flex-col max-xl:gap-y-7 max-[400px]:px-4">
        <HiOutlineMenu
          className="text-2xl dark:text-whiteSecondary text-blackPrimary absolute bottom-7 left-5 xl:hidden max-sm:static max-sm:order-1 cursor-pointer"
          onClick={() => dispatch(setSidebar())}
        />
        <Link to="/">
          <FaReact className="text-4xl dark:text-whiteSecondary text-blackPrimary hover:rotate-180 hover:duration-1000 hover:ease-in-out cursor-pointer" />
        </Link>
        <SearchInput />
        <div className="flex gap-4 items-center max-xl:justify-center">
          <span className="dark:text-whiteSecondary text-blackPrimary">VI</span>
          {darkMode ? (
            <HiOutlineSun
              onClick={() => dispatch(toggleDarkMode())}
              className="text-xl dark:text-whiteSecondary text-blackPrimary cursor-pointer"
            />
          ) : (
            <HiOutlineMoon
              onClick={() => dispatch(toggleDarkMode())}
              className="text-xl dark:text-whiteSecondary text-blackPrimary cursor-pointer"
            />
          )}
          <Link to="/notifications">
            <HiOutlineBell className="text-xl dark:text-whiteSecondary text-blackPrimary" />
          </Link>
          <div className="flex gap-2 items-center">
            <img
              src="/src/assets/profile.jpg"
              alt="profile"
              className="rounded-full w-10 h-10 cursor-pointer"
              onClick={() => setShowUserModal(true)}
            />
            <div className="flex flex-col">
              <p className="dark:text-whiteSecondary text-blackPrimary text-base max-xl:text-sm">
                {user?.nguoiDung?.tenNguoiDung || user?.tenTaiKhoan || 'Người dùng'}
              </p>
              <p className="dark:text-whiteSecondary text-blackPrimary text-sm max-xl:text-xs">
                {getTenVaiTro(user?.vaiTro)}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Đăng xuất"
            >
              <HiOutlineLogout className="text-xl dark:text-whiteSecondary text-blackPrimary" />
            </button>
          </div>
        </div>
      </div>
      {/* User Info Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowUserModal(false)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white"
              onClick={() => setShowUserModal(false)}
            >
              ×
            </button>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img src="/src/assets/profile.jpg" alt="profile" className="rounded-full w-16 h-16" />
                <div>
                  <h2 className="text-xl font-semibold dark:text-whiteSecondary text-blackPrimary">
                    {user?.nguoiDung?.tenNguoiDung || 'Người dùng'}
                  </h2>
                  <p className="text-sm dark:text-gray-400 text-gray-700">{getTenVaiTro(user?.vaiTro)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HiOutlineUser className="text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-whiteSecondary text-blackPrimary">Email: {user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCog className="text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-whiteSecondary text-blackPrimary">Trạng thái: {user?.trangThai}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowUserModal(false);
                    navigate('/dashboard/profile');
                  }}
                >
                  <HiOutlineUser />
                  <span>Xem hồ sơ</span>
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded shadow flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <HiOutlineLogout />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

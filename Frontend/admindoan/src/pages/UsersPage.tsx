import React, { useEffect, useState } from "react";
import {
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup
} from "react-icons/hi";
import {
  Sidebar,
  UserTable,
  WhiteButton,
} from "../components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { nguoiDungService } from "../api/nguoiDungApi";
import { NguoiDungDto } from "../types/nguoidung";

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [usersByRole, setUsersByRole] = useState<{
    quanLi: NguoiDungDto[];
    nhanVien: NguoiDungDto[];
    khachHang: NguoiDungDto[];
    khachHangVIP: NguoiDungDto[];
  }>({
    quanLi: [],
    nhanVien: [],
    khachHang: [],
    khachHangVIP: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsersByRole();
  }, []);

  const fetchUsersByRole = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [quanLi, nhanVien, khachHang, khachHangVIP] = await Promise.all([
        nguoiDungService.getUsersByRole("Quản Lí"),
        nguoiDungService.getUsersByRole("Nhân Viên"),
        nguoiDungService.getUsersByRole("Khách Hàng", false),
        nguoiDungService.getUsersByRole("Khách Hàng", true)
      ]);

      setUsersByRole({
        quanLi: quanLi || [],
        nhanVien: nhanVien || [],
        khachHang: khachHang || [],
        khachHangVIP: khachHangVIP || []
      });
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      toast.error(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      setUsersByRole({
        quanLi: [],
        nhanVien: [],
        khachHang: [],
        khachHangVIP: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/users/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      await nguoiDungService.delete(id);
      toast.success("Xóa người dùng thành công!");
      fetchUsersByRole(); // Refresh data
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa người dùng!");
    }
  };

  const getUsersForActiveTab = () => {
    switch (activeTab) {
      case "quanLi":
        return usersByRole.quanLi;
      case "nhanVien":
        return usersByRole.nhanVien;
      case "khachHang":
        return usersByRole.khachHang;
      case "khachHangVIP":
        return usersByRole.khachHangVIP;
      default:
        return [
          ...usersByRole.quanLi,
          ...usersByRole.nhanVien,
          ...usersByRole.khachHang,
          ...usersByRole.khachHangVIP
        ];
    }
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          {/* Header Section with Gradient */}
          <div className="relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 dark:from-blue-800/30 dark:to-purple-900/30 rounded-b-3xl transform -translate-y-1/2"></div>
            <div className="relative px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                      <HiOutlineUsers className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                      Quản lý người dùng
                    </h2>
                  </div>
                  <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                    <span>Bảng điều khiển</span>{" "}
                    <HiOutlineChevronRight className="text-lg" />{" "}
                    <span>Tất cả người dùng</span>
                  </p>
                </div>
                <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
                  <WhiteButton
                    link="/dashboard/users/create"
                    text="Thêm người dùng"
                    textSize="lg"
                    py="2"
                    width="48"
                    className="transform hover:scale-105 transition-transform duration-300 shadow-lg"
                  >
                    <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
                  </WhiteButton>
                </div>
              </div>
            </div>
          </div>

          {/* Role Statistics Cards */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab("quanLi")}
                className={`cursor-pointer ${activeTab === "quanLi" ? "ring-2 ring-blue-500" : ""} bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white`}
              >
                <div>
                  <h3 className="text-xl font-semibold">Quản Lí</h3>
                  <p className="text-3xl font-bold mt-1">{usersByRole.quanLi.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineOfficeBuilding className="h-8 w-8" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("nhanVien")}
                className={`cursor-pointer ${activeTab === "nhanVien" ? "ring-2 ring-purple-500" : ""} bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white`}
              >
                <div>
                  <h3 className="text-xl font-semibold">Nhân Viên</h3>
                  <p className="text-3xl font-bold mt-1">{usersByRole.nhanVien.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineUserGroup className="h-8 w-8" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("khachHang")}
                className={`cursor-pointer ${activeTab === "khachHang" ? "ring-2 ring-green-500" : ""} bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white`}
              >
                <div>
                  <h3 className="text-xl font-semibold">Khách Hàng</h3>
                  <p className="text-3xl font-bold mt-1">{usersByRole.khachHang.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineUser className="h-8 w-8" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("khachHangVIP")}
                className={`cursor-pointer ${activeTab === "khachHangVIP" ? "ring-2 ring-yellow-500" : ""} bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-700 dark:to-yellow-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white`}
              >
                <div>
                  <h3 className="text-xl font-semibold">Khách Hàng VIP</h3>
                  <p className="text-3xl font-bold mt-1">{usersByRole.khachHangVIP.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`${activeTab === "all"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Tất cả người dùng
                </button>
                <button
                  onClick={() => setActiveTab("quanLi")}
                  className={`${activeTab === "quanLi"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Quản Lí
                </button>
                <button
                  onClick={() => setActiveTab("nhanVien")}
                  className={`${activeTab === "nhanVien"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Nhân Viên
                </button>
                <button
                  onClick={() => setActiveTab("khachHang")}
                  className={`${activeTab === "khachHang"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Khách Hàng
                </button>
                <button
                  onClick={() => setActiveTab("khachHangVIP")}
                  className={`${activeTab === "khachHangVIP"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Khách Hàng VIP
                </button>
              </nav>
            </div>
          </div>

          {/* Loading and Error States */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <p className="font-bold">Lỗi</p>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <UserTable
                  users={getUsersForActiveTab()}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showVipStatus={activeTab === "all" || activeTab === "khachHangVIP"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;

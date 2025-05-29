import React, { useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineFilter,
  HiOutlineCalendar
} from "react-icons/hi";
import { Sidebar } from "../components";
import { useNavigate } from "react-router-dom";
import { useYeuCauDichVu } from "../contexts/YeuCauDichVuContext";
import { useAuth } from "../contexts/AuthContext";
import { yeucaudichvuApi } from "../api/yeucaudichvu";
import StatusBadge, { StatusType } from '../components/StatusBadge';
import { YeuCauDichVuDto } from "../types/yeucaudichvu";
import PhanCongDichVuModal from '../components/PhanCongDichVuModal';
import LichBaoTriTable from '../components/LichBaoTriTable';
import { LichBaoTriDto } from "../types/lichBaoTri";
import { getAllLichBaoTri, updateLichBaoTri, deleteLichBaoTri } from "../api/lichbaotri";
import { toast } from 'react-hot-toast';

// Table component tách riêng
const CustomYeuCauDichVuTable: React.FC<{
  services: YeuCauDichVuDto[],
  isLoading: boolean,
  onRefresh: () => void,
  userRole: string
}> = ({ services, isLoading, onRefresh, userRole }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<YeuCauDichVuDto | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [showPhanCongModal, setShowPhanCongModal] = useState(false);
  const [selectedYeuCau, setSelectedYeuCau] = useState<YeuCauDichVuDto | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa vĩnh viễn yêu cầu dịch vụ này không?")) {
      try {
        await yeucaudichvuApi.deleteYeuCau(id);
        alert("Xóa yêu cầu dịch vụ thành công!");
        onRefresh();
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa yêu cầu!");
      }
    }
  };

  const handleView = (id: string) => {
    navigate(`/dashboard/requestservice/view/${id}`);
  };

  const handleUpdate = (item: YeuCauDichVuDto) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    setUpdateModalOpen(false);
    onRefresh();
  };

  const handlePhanCong = (yeuCau: YeuCauDichVuDto) => {
    setSelectedYeuCau(yeuCau);
    setShowPhanCongModal(true);
  };

  const handleRefresh = async () => {
    try {
      const data = await yeucaudichvuApi.getYeuCauCuaToi();
      setSelectedYeuCau(null);
      onRefresh();
    } catch (err) {
      console.error("Lỗi khi làm mới dữ liệu:", err);
    }
  };

  const renderStatusBadge = (status: string) => {
    // Cast status to StatusType if it matches known statuses, otherwise default
    const statusAsStatusType = status as StatusType; // Explicit cast
    return <StatusBadge status={statusAsStatusType} />;
  };

  return (
    <div className="w-full">
      <PhanCongDichVuModal
        open={showPhanCongModal}
        onClose={() => {
          setShowPhanCongModal(false);
          setSelectedYeuCau(null);
        }}
        yeuCau={selectedYeuCau}
        onRefresh={handleRefresh}
      />
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                Sản phẩm
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                Loại Dịch vụ
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                Trạng thái
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                Ngày Hẹn
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-right w-[150px]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 dark:text-white text-gray-700">Đang tải dữ liệu...</td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 dark:text-white text-gray-700">Không có yêu cầu dịch vụ nào.</td>
              </tr>
            ) : (
              services.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 px-4 font-medium dark:text-white text-gray-700">
                    {item.tenSanPham || 'N/A'}
                  </td>
                  <td className="py-3 px-4 dark:text-white text-gray-700">
                    {item.loaiDichVu}
                  </td>
                  <td className="py-3 px-4 dark:text-white text-gray-700">
                    {renderStatusBadge(item.trangThaiYeuCau)}
                  </td>
                  <td className="py-3 px-4 dark:text-white text-gray-700">
                    {item.ngayHen ? new Date(item.ngayHen).toLocaleDateString('vi-VN') : ''}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="relative flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(item.id)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Xem chi tiết"
                      >
                        <HiOutlineEye size={18} />
                      </button>
                      <button
                        onClick={() => handleUpdate(item)}
                        className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                        title="Cập nhật"
                      >
                        <HiOutlinePencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Xóa"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                      {userRole === "Quản Lí" && !item.daPhanCong && item.trangThaiYeuCau === "Đã xác nhận" && (
                        <button
                          onClick={() => handlePhanCong(item)}
                          className="p-1.5 text-green-600 hover:bg-gray-100 dark:text-green-400 dark:hover:bg-gray-700 transition-colors"
                          title="Phân công"
                        >
                          <HiOutlinePencil size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const YeuCauDichVu = () => {
  const [serviceRequests, setServiceRequests] = useState<YeuCauDichVuDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string | null>(null);
  const { user } = useAuth();
  const { getYeuCauCuaToi, getAllYeuCau } = useYeuCauDichVu();
  const navigate = useNavigate();
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<LichBaoTriDto[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setLoadingSchedules(true);
    try {
      // Fetch service requests
      let data: YeuCauDichVuDto[] = [];

      if (user?.vaiTro === "Nhân Viên") {
        data = await yeucaudichvuApi.getYeuCauCuaNhanVien(user.maNguoiDung);
      } else if (user?.vaiTro === "Khách Hàng") {
        data = await getYeuCauCuaToi();
      } else {
        data = await getAllYeuCau(statusFilter || undefined, serviceTypeFilter || undefined);
      }

      if (searchKeyword) {
        data = data.filter(item =>
          item.tenSanPham?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.loaiDichVu.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      setServiceRequests(data);

      // Fetch all maintenance schedules
      const schedules = await getAllLichBaoTri();
      setMaintenanceSchedules(schedules);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    if (user?.vaiTro) {
      fetchData();
    }
  }, [statusFilter, serviceTypeFilter, user?.vaiTro]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleCreateRequest = () => {
    navigate("/yeu-cau-dich-vu/create");
  };

  const handleViewSchedule = (id: string) => {
    // TODO: Implement view schedule detail page
    navigate(`/lich-bao-tri/${id}`);
  };

  const handleEditSchedule = async (item: LichBaoTriDto) => {
    try {
      await updateLichBaoTri(item.id, item);
      fetchData(); // Refresh data after update
      alert("Cập nhật lịch bảo trì thành công!");
    } catch (error) {
      console.error("Error updating maintenance schedule:", error);
      alert("Có lỗi xảy ra khi cập nhật lịch bảo trì!");
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch bảo trì này không?")) {
      try {
        await deleteLichBaoTri(id);
        fetchData(); // Refresh data after deletion
        alert("Xóa lịch bảo trì thành công!");
      } catch (error) {
        console.error("Error deleting maintenance schedule:", error);
        alert("Có lỗi xảy ra khi xóa lịch bảo trì!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quản Lý Yêu Cầu Dịch Vụ</h2>
              <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Trang chủ</span>
                <HiOutlineChevronRight className="mx-2 h-4 w-4" />
                <span>Dịch vụ</span>
              </div>
            </div>
            {user?.vaiTro === "Khách hàng" && (
              <button
                onClick={handleCreateRequest}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-x-2 shadow-md"
              >
                <HiOutlinePlus />
                Tạo Yêu Cầu
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm yêu cầu..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                />
              </div>
            </form>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter || ""}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Chờ xác nhận">Đang chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <select
                value={serviceTypeFilter || ""}
                onChange={(e) => setServiceTypeFilter(e.target.value || null)}
                className="block w-full pl-3 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              >
                <option value="">Tất cả loại dịch vụ</option>
                <option value="Bảo hành">Bảo hành</option>
                <option value="Sửa chữa">Sửa chữa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Cards */}
        <div className="space-y-6">
          {/* Yêu Cầu Dịch Vụ Table */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <CustomYeuCauDichVuTable
              services={serviceRequests}
              isLoading={loading}
              onRefresh={fetchData}
              userRole={user?.vaiTro || ""}
            />
          </div>

          {/* Lịch Bảo Trì Table */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <LichBaoTriTable
              schedules={maintenanceSchedules}
              isLoading={loadingSchedules}
              onEdit={handleEditSchedule}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YeuCauDichVu;
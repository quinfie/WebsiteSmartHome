import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePhanCongDichVu } from "../contexts/PhanCongDichVuContext";
import { useYeuCauDichVu } from "../contexts/YeuCauDichVuContext";
import { useAuth } from "../contexts/AuthContext";
import { PhanCongDichVuDto } from "../types/phancongdichvu";
import { HiOutlineEye, HiOutlineCheckCircle, HiOutlineClipboardList, HiOutlineArchive, HiOutlineCheckCircle as HiCheckCircleIcon, HiOutlineClipboardCheck, HiOutlineCalendar } from "react-icons/hi";
import { Sidebar, TableWrapper } from "../components";
import { YeuCauDichVuDto } from "../types/yeucaudichvu";
import PhanCongDichVuModal from '../components/PhanCongDichVuModal';
import { phanCongDichVuApi } from '../api/phancongdichvu';

const PhanCongDichVu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log('Current user:', user);
  const { getByKyThuatVien } = usePhanCongDichVu();
  const { getYeuCauChuaPhanCong, getAllYeuCau } = useYeuCauDichVu();
  const [phanCongList, setPhanCongList] = useState<PhanCongDichVuDto[]>([]);
  const [unassignedRequests, setUnassignedRequests] = useState<YeuCauDichVuDto[]>([]);
  const [allRequests, setAllRequests] = useState<YeuCauDichVuDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPhanCongModal, setShowPhanCongModal] = useState(false);
  const [selectedYeuCau, setSelectedYeuCau] = useState<YeuCauDichVuDto | null>(null);

  interface PhanCongFilterOptions {
    trangThaiYeuCau?: string;
    loaiDichVu?: string;
    daPhanCong?: string;
  }
  const [filterOptions, setFilterOptions] = useState<PhanCongFilterOptions>({});

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const allData = await getAllYeuCau();
      setAllRequests(allData);

      if (user.vaiTro === "Nhân Viên") {
        if (user.id && user.id.trim() !== "") {
          const assignedData = await getByKyThuatVien(user.id);
          const filteredAssignedData = assignedData.filter(item =>
            item.yeuCauDichVu?.trangThaiYeuCau === 'Đã xác nhận'
          );
          setPhanCongList(filteredAssignedData);
        } else {
          console.warn("User id is empty, cannot fetch assignments for technician.");
          setPhanCongList([]);
        }
        setUnassignedRequests([]);
      } else if (user.vaiTro === "Quản Lí" || user.vaiTro === "Quản Trị Viên") {
        const unassignedData = await getYeuCauChuaPhanCong();
        setUnassignedRequests(unassignedData);
        setPhanCongList([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu phân công:", error);
      setAllRequests([]);
      setPhanCongList([]);
      setUnassignedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.vaiTro) {
      fetchData();
    }
  }, [user?.vaiTro]);

  const handlePhanCongClick = async (yeuCau: YeuCauDichVuDto) => {
    let phanCongHienTai = null;
    if (yeuCau.daPhanCong) {
      try {
        const res = await phanCongDichVuApi.getByYeuCau(yeuCau.id);
        phanCongHienTai = res && res.length > 0 ? res[0] : null;
      } catch (e) {
        phanCongHienTai = null;
      }
    }
    setSelectedYeuCau({ ...yeuCau, phanCongHienTai });
    setShowPhanCongModal(true);
  };

  const handlePhanCongSuccess = () => {
    setShowPhanCongModal(false);
    setSelectedYeuCau(null);
    fetchData();
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterOptions(prev => ({ ...prev, [name]: value }));
    console.log('Filter change:', name, value);
  };

  const handleApplyFilters = () => {
    console.log('Apply filters', filterOptions);
  };

  const handleClearFilters = () => {
    setFilterOptions({});
    console.log('Clear filters');
  };

  const renderTrangThai = (trangThai: string) => {
    let badgeClass = "";
    switch (trangThai) {
      case "Đã hoàn thành":
        badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        break;
      case "Đang xử lý":
        badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        break;
      default:
        badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }

    return (
      <span className={`px-2.5 py-1 rounded text-xs font-medium ${badgeClass}`}>
        {trangThai}
      </span>
    );
  };

  const hasData = user?.vaiTro === "Nhân Viên" ? phanCongList.length > 0 : unassignedRequests.length > 0 || allRequests.length > 0;

  const emptyStateMessage = () => {
    if (loading) return "Đang tải dữ liệu...";
    if (allRequests.length === 0) return "Hiện tại không có yêu cầu dịch vụ nào trong hệ thống.";

    if (user?.vaiTro === "Nhân Viên") {
      return phanCongList.length === 0 ? "Hiện tại bạn không có phân công dịch vụ nào." : "";
    } else if (user?.vaiTro === "Quản Lí" || user?.vaiTro === "Quản Trị Viên") {
      return unassignedRequests.length === 0 ? "Hiện tại không có yêu cầu dịch vụ nào chờ phân công." : "";
    }
    return "";
  };

  const statCards = [
    { title: 'Tổng yêu cầu', value: allRequests.length, icon: <HiOutlineClipboardList className="text-blue-500 dark:text-blue-400 text-xl" />, color: 'bg-blue-100 dark:bg-blue-900' },
    { title: 'Yêu cầu chưa phân công', value: unassignedRequests.length, icon: <HiOutlineArchive className="text-orange-500 dark:text-orange-400 text-xl" />, color: 'bg-orange-100 dark:bg-orange-900' },
    { title: 'Phân công của bạn', value: phanCongList.length, icon: <HiOutlineClipboardCheck className="text-purple-500 dark:text-purple-400 text-xl" />, color: 'bg-purple-100 dark:bg-purple-900' },
    { title: 'Yêu cầu đã hoàn thành', value: allRequests.filter(req => req.trangThaiYeuCau === 'Hoàn thành').length, icon: <HiCheckCircleIcon className="text-green-500 dark:text-green-400 text-xl" />, color: 'bg-green-100 dark:bg-green-900' },
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Phân công dịch vụ"
        subtitle="Quản lý phân công kỹ thuật viên"
        onSearch={() => { }}
        isLoading={loading}
        hasData={allRequests.length > 0}
        emptyStateMessage={emptyStateMessage()}
        statCards={statCards}
        contextType="donhang"
        itemLabel="yêu cầu dịch vụ"
        hideExportButton={true}
        customHeader={
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/assignrequest/calendar')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <HiOutlineCalendar className="mr-2 h-5 w-5" />
              Xem lịch phân công
            </button>
          </div>
        }
      >
        {/* BỘ LỌC TÙY CHỈNH */}
        <div className="flex flex-wrap items-end gap-4 mb-6 px-4">
          {/* Bộ lọc phân công */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">Phân công</label>
            <select
              value={filterOptions.daPhanCong ?? ""}
              onChange={e => handleFilterChange('daPhanCong', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tất cả</option>
              <option value="true">Đã phân công</option>
              <option value="false">Chưa phân công</option>
            </select>
          </div>
          {/* Trạng thái */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">Trạng thái</label>
            <select
              value={filterOptions.trangThaiYeuCau || ""}
              onChange={e => handleFilterChange('trangThaiYeuCau', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tất cả</option>
              <option value="Đang chờ xác nhận">Đang chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đã hủy">Đã hủy</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
          </div>
          {/* Loại dịch vụ */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">Loại dịch vụ</label>
            <select
              value={filterOptions.loaiDichVu || ""}
              onChange={e => handleFilterChange('loaiDichVu', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tất cả</option>
              <option value="Bảo hành">Bảo hành</option>
              <option value="Sửa chữa">Sửa chữa</option>
            </select>
          </div>
          {/* Nút lọc và xóa lọc */}
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Lọc
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Xóa lọc
            </button>
          </div>
        </div>

        {/* Lọc danh sách theo filterOptions */}
        {(() => {
          let filteredRequests = allRequests;
          if (filterOptions.daPhanCong === "true") {
            filteredRequests = filteredRequests.filter(x => x.daPhanCong);
          } else if (filterOptions.daPhanCong === "false") {
            filteredRequests = filteredRequests.filter(x => !x.daPhanCong);
          }
          if (filterOptions.trangThaiYeuCau) {
            filteredRequests = filteredRequests.filter(x => x.trangThaiYeuCau === filterOptions.trangThaiYeuCau);
          }
          if (filterOptions.loaiDichVu) {
            filteredRequests = filteredRequests.filter(x => x.loaiDichVu === filterOptions.loaiDichVu);
          }
          return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 px-4 pt-4">
                Danh sách Yêu cầu dịch vụ ({filteredRequests.length})
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 px-4 pb-4">
                Quản lý toàn bộ yêu cầu dịch vụ trong hệ thống. Sử dụng bộ lọc để tìm kiếm nhanh.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loại dịch vụ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày hẹn</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày xử lý</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Đã phân công</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-400 dark:text-gray-500">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50 dark:hover:bg-gray-700/20">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.id}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.loaiDichVu}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.ngayHen ? new Date(item.ngayHen).toLocaleDateString('vi-VN') : 'N/A'}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.ngayXuLy ? new Date(item.ngayXuLy).toLocaleDateString('vi-VN') : 'N/A'}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{renderTrangThai(item.trangThaiYeuCau)}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.daPhanCong ? 'Đã phân công' : 'Chưa phân công'}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.khachHang?.tenNguoiDung || 'N/A'}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => navigate(`/dashboard/requestservice/view/${item.id}`)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Xem chi tiết"
                              >
                                <HiOutlineEye className="h-5 w-5" />
                              </button>
                              {!item.daPhanCong && item.trangThaiYeuCau === "Đã xác nhận" ? (
                                <button
                                  onClick={() => handlePhanCongClick(item)}
                                  className="flex items-center text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors border border-green-400 rounded-md px-2 py-1 bg-green-50/10 dark:bg-green-900/10 ml-1"
                                  title="Phân công kỹ thuật viên"
                                >
                                  <HiOutlineCheckCircle className="h-5 w-5" />
                                  <span className="ml-1 text-xs font-semibold hidden md:inline">Phân công</span>
                                </button>
                              ) : item.daPhanCong ? (
                                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 ml-1">
                                  Đã phân công
                                </span>
                              ) : null}
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
        })()}
      </TableWrapper>

      <PhanCongDichVuModal
        open={showPhanCongModal}
        onClose={() => setShowPhanCongModal(false)}
        yeuCau={selectedYeuCau}
        onRefresh={handlePhanCongSuccess}
      />
    </div>
  );
};

export default PhanCongDichVu;

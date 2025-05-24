import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePhanCongDichVu } from "../contexts/PhanCongDichVuContext";
import { useYeuCauDichVu } from "../contexts/YeuCauDichVuContext";
import { useAuth } from "../contexts/AuthContext";
import { PhanCongDichVuDto } from "../types/phancongdichvu";
import { HiOutlinePlus, HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineClipboardList, HiOutlineArchive, HiOutlineCheckCircle as HiCheckCircleIcon, HiOutlineClipboardCheck, HiOutlineCalendar } from "react-icons/hi";
import { Sidebar, TableWrapper } from "../components";
import { YeuCauDichVuDto } from "../types/yeucaudichvu";
import PhanCongDichVuModal from '../components/PhanCongDichVuModal';

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

  const [searchTerm, setSearchTerm] = useState('');
  interface PhanCongFilterOptions {
    trangThaiYeuCau?: string;
    loaiDichVu?: string;
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

  const handlePhanCongClick = (yeuCau: YeuCauDichVuDto) => {
    setSelectedYeuCau(yeuCau);
    setShowPhanCongModal(true);
  };

  const handlePhanCongSuccess = () => {
    setShowPhanCongModal(false);
    setSelectedYeuCau(null);
    fetchData();
  };

  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
    console.log('Searching for:', keyword);
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

  const filterFields = [
    { name: 'trangThaiYeuCau', label: 'Trạng thái', type: 'select' as const, options: [{ value: '', label: 'Tất cả' }, { value: 'Đang chờ xác nhận', label: 'Đang chờ xác nhận' }, { value: 'Đã xác nhận', label: 'Đã xác nhận' }, { value: 'Đã hủy', label: 'Đã hủy' }, { value: 'Hoàn thành', label: 'Hoàn thành' }], value: filterOptions.trangThaiYeuCau },
    { name: 'loaiDichVu', label: 'Loại dịch vụ', type: 'select' as const, options: [{ value: '', label: 'Tất cả' }, { value: 'Bảo hành', label: 'Bảo hành' }, { value: 'Sửa chữa', label: 'Sửa chữa' }], value: filterOptions.loaiDichVu },
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Phân công dịch vụ"
        subtitle="Quản lý phân công kỹ thuật viên"
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm yêu cầu..."
        filters={{
          fields: filterFields,
          onFilterChange: handleFilterChange,
          onApplyFilters: handleApplyFilters,
          onResetFilters: handleClearFilters
        }}
        isLoading={loading}
        hasData={hasData}
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
        {allRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 px-4 pt-4">Tất cả Yêu cầu dịch vụ ({allRequests.length})</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 pb-4">Danh sách tất cả các yêu cầu dịch vụ.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loại dịch vụ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Đã phân công</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {allRequests.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.loaiDichVu}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {renderTrangThai(item.trangThaiYeuCau)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {item.daPhanCong ? 'Đã phân công' : 'Chưa phân công'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard/requestservice/view/${item.id}`)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Xem chi tiết"
                          >
                            <HiOutlineEye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(user?.vaiTro === "Quản Lí" || user?.vaiTro === "Quản Trị Viên") && unassignedRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 px-4 pt-4">Yêu cầu dịch vụ chưa phân công ({unassignedRequests.length})</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 pb-4">Chọn yêu cầu để phân công cho kỹ thuật viên.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loại dịch vụ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày hẹn</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {unassignedRequests.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.loaiDichVu}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {item.ngayHen ? new Date(item.ngayHen).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
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
                          <button
                            onClick={() => handlePhanCongClick(item)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Phân công"
                          >
                            <HiOutlineCheckCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {user?.vaiTro === "Nhân Viên" && phanCongList.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 px-4 pt-4">Phân công của bạn ({phanCongList.length})</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 pb-4">Các yêu cầu dịch vụ đã được phân công cho bạn.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Yêu cầu dịch vụ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày phân công
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trạng thái phân công
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {phanCongList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {item.yeuCauDichVu?.loaiDichVu || 'Không có tiêu đề'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {item.ngayPhanCong ? new Date(item.ngayPhanCong).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {renderTrangThai(item.trangThaiPhanCong)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {item.ghiChu || 'Không có ghi chú'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard/requestservice/view/${item.yeuCauDichVuId}`)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Xem chi tiết yêu cầu"
                          >
                            <HiOutlineEye className="h-5 w-5" />
                          </button>
                          {item.trangThaiPhanCong !== "Đã hoàn thành" && (
                            <button
                              onClick={() => navigate(`/phan-cong/edit/${item.id}`)}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              title="Cập nhật tiến độ"
                            >
                              <HiOutlinePencil className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

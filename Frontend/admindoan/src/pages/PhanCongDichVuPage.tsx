import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePhanCongDichVu } from "../contexts/PhanCongDichVuContext";
import { useYeuCauDichVu } from "../contexts/YeuCauDichVuContext";
import { useAuth } from "../contexts/AuthContext";
import { PhanCongDichVuDto } from "../types/phancongdichvu";
import { HiOutlineEye, HiOutlineCheckCircle, HiOutlineClipboardList, HiOutlineArchive, HiOutlineCheckCircle as HiCheckCircleIcon, HiOutlineClipboardCheck, HiOutlineCalendar, HiOutlinePencil, HiOutlineX } from "react-icons/hi";
import { Sidebar, TableWrapper } from "../components";
import { YeuCauDichVuDto } from "../types/yeucaudichvu";
import PhanCongDichVuModal from '../components/PhanCongDichVuModal';
import EditPhanCongModal from '../components/EditPhanCongModal';
import { phanCongDichVuApi } from '../api/phancongdichvu';
import { yeucaudichvuApi } from '../api/yeucaudichvu';
import { toast } from 'react-toastify';

const PhanCongDichVu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { getByKyThuatVien } = usePhanCongDichVu();
  const { getYeuCauChuaPhanCong, getAllYeuCau } = useYeuCauDichVu();
  const [phanCongList, setPhanCongList] = useState<PhanCongDichVuDto[]>([]);
  const [unassignedRequests, setUnassignedRequests] = useState<YeuCauDichVuDto[]>([]);
  const [allRequests, setAllRequests] = useState<YeuCauDichVuDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPhanCongModal, setShowPhanCongModal] = useState(false);
  const [selectedYeuCau, setSelectedYeuCau] = useState<YeuCauDichVuDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPhanCong, setEditingPhanCong] = useState<PhanCongDichVuDto | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  interface PhanCongFilterOptions {
    trangThaiYeuCau?: string;
    loaiDichVu?: string;
    daPhanCong?: string;
  }

  const [filterOptions, setFilterOptions] = useState<PhanCongFilterOptions>({});

  const isAdminOrManager = user?.vaiTro === "Quản Trị Viên" || user?.vaiTro === "Quản Lí";
  const isEmployee = user?.vaiTro === "Nhân Viên";

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (isEmployee) {
        if (user.maNguoiDung && user.maNguoiDung.trim() !== "") {
          const assignedData = await getByKyThuatVien(user.maNguoiDung);
          console.log('Employee - Assigned Data:', assignedData);
          setPhanCongList(assignedData);
        } else {
          console.warn("User maNguoiDung is empty, cannot fetch assignments for technician.");
          setPhanCongList([]);
        }
      } else if (isAdminOrManager) {
        const allData = await getAllYeuCau();
        console.log('Admin/Manager - All Data:', allData);
        setAllRequests(allData);
        const unassignedData = await getYeuCauChuaPhanCong();
        console.log('Admin/Manager - Unassigned Data:', unassignedData);
        setUnassignedRequests(unassignedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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


  const handleRefresh = () => {
    fetchData();
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    // Data fetching already happens in useEffect on role change or refresh
    // Filters are applied in the filteredRequests/filteredAssignments logic below
  };

  const handleClearFilters = () => {
    setFilterOptions({});
  };

  const renderTrangThai = (trangThai: string) => {
    let badgeClass = "";
    switch (trangThai) {
      case "Hoàn thành":
        badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        break;
      case "Đã xác nhận":
        badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        break;
      case "Đã hủy":
        badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        break;
      case "Đang chờ xác nhận":
        badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
    return (
      <span className={`px-2.5 py-1 rounded text-xs font-medium ${badgeClass}`}>
        {trangThai}
      </span>
    );
  };

  const filteredRequests = allRequests.filter(request => {
    const matchesSearch = searchTerm === '' ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.loaiDichVu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.trangThaiYeuCau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.khachHang?.tenNguoiDung.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filterOptions.daPhanCong === undefined || filterOptions.daPhanCong === '' ||
        (filterOptions.daPhanCong === 'true' && request.daPhanCong) ||
        (filterOptions.daPhanCong === 'false' && !request.daPhanCong)) &&
      (filterOptions.trangThaiYeuCau === undefined || filterOptions.trangThaiYeuCau === '' ||
        request.trangThaiYeuCau === filterOptions.trangThaiYeuCau) &&
      (filterOptions.loaiDichVu === undefined || filterOptions.loaiDichVu === '' ||
        request.loaiDichVu === filterOptions.loaiDichVu);

    return matchesSearch && matchesFilters;
  });

  const filteredAssignments = phanCongList.filter(assignment => {
    const matchesSearch = searchTerm === '' ||
      assignment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.yeuCauDichVu?.loaiDichVu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.trangThaiPhanCong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.yeuCauDichVu?.khachHang?.tenNguoiDung.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const hasData = isAdminOrManager ? filteredRequests.length > 0 : filteredAssignments.length > 0;

  const emptyStateMessage = () => {
    if (loading) return "Đang tải dữ liệu...";
    if (isAdminOrManager) {
      if (allRequests.length === 0) return "Hiện tại không có yêu cầu dịch vụ nào trong hệ thống.";
      if (filteredRequests.length === 0) return "Không tìm thấy yêu cầu dịch vụ phù hợp với bộ lọc.";
    } else if (isEmployee) {
      if (phanCongList.length === 0) return "Hiện tại bạn không có phân công dịch vụ nào.";
      if (filteredAssignments.length === 0) return "Không tìm thấy phân công phù hợp với tìm kiếm.";
    }
    return "";
  };

  const statCards = [
    { title: 'Tổng yêu cầu', value: allRequests.length, icon: <HiOutlineClipboardList className="text-blue-500 dark:text-blue-400 text-xl" />, color: 'bg-blue-100 dark:bg-blue-900' },
    { title: 'Yêu cầu chưa phân công', value: unassignedRequests.length, icon: <HiOutlineArchive className="text-orange-500 dark:text-orange-400 text-xl" />, color: 'bg-orange-100 dark:bg-orange-900' },
    { title: 'Phân công của bạn', value: phanCongList.length, icon: <HiOutlineClipboardCheck className="text-purple-500 dark:text-purple-400 text-xl" />, color: 'bg-purple-100 dark:bg-purple-900' },
    { title: 'Yêu cầu đã hoàn thành', value: allRequests.filter(req => req.trangThaiYeuCau === 'Hoàn thành').length, icon: <HiCheckCircleIcon className="text-green-500 dark:text-green-400 text-xl" />, color: 'bg-green-100 dark:bg-green-900' },
  ];

  const handleUpdateTrangThai = async (id: string, trangThai: string) => {
    try {
      if (isAdminOrManager) {
        if (trangThai === "Đã xác nhận") {
          await yeucaudichvuApi.xacNhanYeuCau(id);
        } else if (trangThai === "Đã hủy") {
          await yeucaudichvuApi.huyYeuCau(id);
        } else {
          await yeucaudichvuApi.updateTrangThai(id, trangThai);
        }
      } else if (isEmployee) {
        await phanCongDichVuApi.capNhatTrangThai(id, trangThai);
      }
      toast.success("Cập nhật trạng thái thành công");
      handleRefresh();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };


  const handleEditSubmit = async (data: { ghiChu?: string; trangThaiPhanCong?: string }) => {
    if (!editingPhanCong || !isEmployee) return;

    try {
      // Cập nhật ghi chú nếu có
      if (data.ghiChu !== undefined) {
        await phanCongDichVuApi.updateGhiChu(editingPhanCong.id, data.ghiChu);
      }

      // Cập nhật trạng thái nếu có
      if (data.trangThaiPhanCong) {
        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ["Đang chờ xác nhận", "Hoàn thành", "Đã xác nhận", "Đã hủy"];
        if (!validStatuses.includes(data.trangThaiPhanCong)) {
          toast.error("Trạng thái không hợp lệ");
          return;
        }

        await phanCongDichVuApi.capNhatTrangThai(editingPhanCong.id, data.trangThaiPhanCong);
      }

      toast.success("Cập nhật phân công thành công");
      setShowEditModal(false);
      setEditingPhanCong(null);
      handleRefresh();
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Có lỗi xảy ra khi cập nhật phân công");
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Phân công dịch vụ"
        subtitle={isAdminOrManager ? "Quản lý phân công kỹ thuật viên" : "Danh sách phân công của tôi"}
        onSearch={setSearchTerm}
        isLoading={loading}
        hasData={hasData}
        emptyStateMessage={emptyStateMessage()}
        statCards={statCards}
        contextType="donhang"
        itemLabel="yêu cầu dịch vụ"
        hideExportButton={true}
        filters={isAdminOrManager ? {
          fields: [
            {
              name: 'daPhanCong',
              label: 'Phân công',
              type: 'select',
              options: [
                { value: '', label: 'Tất cả' },
                { value: 'true', label: 'Đã phân công' },
                { value: 'false', label: 'Chưa phân công' },
              ],
              value: filterOptions.daPhanCong,
            },
            {
              name: 'trangThaiYeuCau',
              label: 'Trạng thái',
              type: 'select',
              options: [
                { value: '', label: 'Tất cả' },
                { value: 'Đang chờ xác nhận', label: 'Đang chờ xác nhận' },
                { value: 'Đã xác nhận', label: 'Đã xác nhận' },
                { value: 'Đã hủy', label: 'Đã hủy' },
                { value: 'Hoàn thành', label: 'Hoàn thành' },
              ],
              value: filterOptions.trangThaiYeuCau,
            },
            {
              name: 'loaiDichVu',
              label: 'Loại dịch vụ',
              type: 'select',
              options: [
                { value: '', label: 'Tất cả' },
                { value: 'Bảo hành', label: 'Bảo hành' },
                { value: 'Bảo trì', label: 'Bảo trì' },
                { value: 'Sửa chữa', label: 'Sửa chữa' },
              ],
              value: filterOptions.loaiDichVu,
            },
          ],
          onFilterChange: handleFilterChange,
          onApplyFilters: handleApplyFilters,
          onResetFilters: handleClearFilters,
        } : undefined}
        customHeader={
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(isAdminOrManager ? '/dashboard/assignrequest/calendar' : `/dashboard/calendar/${user?.maNguoiDung}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <HiOutlineCalendar className="mr-2 h-5 w-5" />
              {isAdminOrManager ? 'Xem lịch phân công' : 'Xem lịch của tôi'}
            </button>
          </div>
        }
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 px-4 pt-4">
            {isAdminOrManager ? 'Danh sách Yêu cầu dịch vụ' : 'Danh sách phân công của tôi'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 px-4 pb-4">
            {isAdminOrManager
              ? 'Quản lý toàn bộ yêu cầu dịch vụ trong hệ thống. Sử dụng bộ lọc và tìm kiếm nhanh.'
              : 'Danh sách các yêu cầu dịch vụ đã được phân công cho bạn.'}
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loại dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày hẹn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày xử lý</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                  {isAdminOrManager && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Đã phân công</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Khách hàng</th>
                    </>
                  )}
                  {isEmployee && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kỹ thuật viên</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ghi chú</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chi phí</th>
                    </>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {(isAdminOrManager ? filteredRequests : filteredAssignments).map((item) => {
                  if (isAdminOrManager) {
                    const yeuCau = item as YeuCauDichVuDto;
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{yeuCau.loaiDichVu}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{yeuCau.ngayHen ? new Date(yeuCau.ngayHen).toLocaleDateString('vi-VN') : 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{yeuCau.ngayXuLy ? new Date(yeuCau.ngayXuLy).toLocaleDateString('vi-VN') : 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{renderTrangThai(yeuCau.trangThaiYeuCau)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{yeuCau.daPhanCong ? 'Đã phân công' : 'Chưa phân công'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{yeuCau.khachHang?.tenNguoiDung || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (yeuCau?.id) {
                                  navigate(`/dashboard/requestservice/view/${yeuCau.id}`);
                                }
                              }}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                              title="Xem chi tiết yêu cầu"
                            >
                              <HiOutlineEye className="h-3.5 w-3.5" />
                            </button>
                            {isAdminOrManager && !yeuCau.daPhanCong && yeuCau.trangThaiYeuCau === "Đã xác nhận" && (
                              <button
                                onClick={() => handlePhanCongClick(yeuCau)}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                                title="Phân công kỹ thuật viên"
                              >
                                <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    const phanCong = item as PhanCongDichVuDto;
                    const yeuCau = phanCong.yeuCauDichVu;
                    console.log('Rendering Employee Row - PhanCong:', phanCong);
                    console.log('Rendering Employee Row - YeuCau:', yeuCau);
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{yeuCau?.loaiDichVu}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{phanCong.ngayPhanCong ? new Date(phanCong.ngayPhanCong).toLocaleDateString('vi-VN') : 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{phanCong.ngayHoanThanh ? new Date(phanCong.ngayHoanThanh).toLocaleDateString('vi-VN') : 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{renderTrangThai(phanCong.trangThaiPhanCong)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{phanCong.kyThuatVien?.tenNguoiDung || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{phanCong.ghiChu || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {phanCong.yeuCauDichVu?.chiPhiYeuCau
                            ? `${phanCong.yeuCauDichVu.chiPhiYeuCau.toLocaleString('vi-VN')} VNĐ`
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (yeuCau?.id) {
                                  navigate(`/dashboard/requestservice/view/${yeuCau.id}`);
                                }
                              }}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                              title="Xem chi tiết yêu cầu"
                            >
                              <HiOutlineEye className="h-3.5 w-3.5" />
                            </button>
                            {isEmployee && (
                              <>
                                {phanCong.trangThaiPhanCong === "Đang chờ xác nhận" && (
                                  <button
                                    onClick={() => handleUpdateTrangThai(phanCong.id, "Đã xác nhận")}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                                    title="Xác nhận phân công"
                                  >
                                    <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {phanCong.trangThaiPhanCong === "Đã xác nhận" && (
                                  <button
                                    onClick={() => handleUpdateTrangThai(phanCong.id, "Hoàn thành")}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                                    title="Hoàn thành phân công"
                                  >
                                    <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </TableWrapper>

      {showPhanCongModal && selectedYeuCau && (
        <PhanCongDichVuModal
          open={showPhanCongModal}
          onClose={() => setShowPhanCongModal(false)}
          yeuCau={selectedYeuCau}
          onRefresh={handleRefresh}
        />
      )}

      {showEditModal && editingPhanCong && (
        <EditPhanCongModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingPhanCong(null);
          }}
          phanCong={editingPhanCong}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default PhanCongDichVu;

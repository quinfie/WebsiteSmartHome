import React, { useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText
} from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { Sidebar, TableWrapper } from "../components";
import { useNavigate } from "react-router-dom";
import { yeuCauDichVuItems } from "../utils/data";
import { YeuCauDichVuDto } from "../types/yeucaudichvu";

// Custom YeuCauDichVuTable component
const CustomYeuCauDichVuTable: React.FC<{ services: any[], isLoading: boolean }> =
  ({ services, isLoading }) => {
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
      if (window.confirm("Bạn có chắc muốn xóa yêu cầu dịch vụ này không?")) {
        // Handle delete logic here
        alert(`Xóa yêu cầu: ${id}`);
      }
    };

    const handleEdit = (id: string) => {
      navigate(`/yeu-cau-dich-vu/edit/${id}`);
    };

    const handleView = (id: string) => {
      navigate(`/yeu-cau-dich-vu/view/${id}`);
    };

    // Function to render status badge
    const renderStatusBadge = (status: string) => {
      let bgColor;
      let textColor;

      switch (status) {
        case "Đang chờ xác nhận":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-800 dark:text-yellow-300 dark:bg-yellow-900";
          break;
        case "Đã xác nhận":
          bgColor = "bg-green-100";
          textColor = "text-green-800 dark:text-green-300 dark:bg-green-900";
          break;
        case "Đang xử lý":
          bgColor = "bg-blue-100";
          textColor = "text-blue-800 dark:text-blue-300 dark:bg-blue-900";
          break;
        case "Hoàn thành":
          bgColor = "bg-purple-100";
          textColor = "text-purple-800 dark:text-purple-300 dark:bg-purple-900";
          break;
        case "Đã hủy":
          bgColor = "bg-red-100";
          textColor = "text-red-800 dark:text-red-300 dark:bg-red-900";
          break;
        default:
          bgColor = "bg-gray-100";
          textColor = "text-gray-800 dark:text-gray-300 dark:bg-gray-900";
      }

      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
          {status}
        </span>
      );
    };

    return (
      <div className="w-full px-0">
        <div className="overflow-x-auto w-full px-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineDocumentText className="text-blue-500" /> Mã Chi Tiết ĐH
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineClipboardCheck className="text-green-500" /> Loại DV
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineClipboardCheck className="text-purple-500" /> Trạng Thái
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineCurrencyDollar className="text-orange-500" /> Chi Phí
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineCalendar className="text-indigo-500" /> Ngày Hẹn
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineDocumentText className="text-pink-500" /> Mô Tả
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-right">
                  <span className="inline-flex items-center gap-1">
                    Thao tác
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 dark:text-white text-gray-700">Đang tải dữ liệu...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 dark:text-white text-gray-700">Không có yêu cầu dịch vụ nào.</td>
                </tr>
              ) : (
                services.map((item) => (
                  <tr key={item.Id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4 font-medium dark:text-white text-gray-700">
                      #{item.MaChiTietDonHang}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      {item.LoaiDichVu}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      {renderStatusBadge(item.TrangThaiYeuCau)}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      {item.ChiPhiYeuCau.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      {item.NgayHen}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      <div className="max-w-xs truncate">
                        {item.MoTa}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                          title="Chỉnh sửa"
                          onClick={() => handleEdit(item.Id)}
                        >
                          <HiOutlinePencil size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/40 transition-colors"
                          title="Xem chi tiết"
                          onClick={() => handleView(item.Id)}
                        >
                          <HiOutlineEye size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                          title="Xóa"
                          onClick={() => handleDelete(item.Id)}
                        >
                          <HiOutlineTrash size={18} />
                        </button>
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
  const [serviceRequests, setServiceRequests] = useState(yeuCauDichVuItems);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const navigate = useNavigate();

  // Simulated loading data only once
  useEffect(() => {
    // Only load data if it hasn't been loaded yet
    if (!initialLoadDone) {
      setLoading(true);
      // Simulate API call delay
      const timeoutId = setTimeout(() => {
        setServiceRequests(yeuCauDichVuItems);
        setLoading(false);
        setInitialLoadDone(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [initialLoadDone]);

  const handleSearch = (keyword: string) => {
    // Skip if the search term is the same
    if (searchKeyword === keyword) return;

    setSearchKeyword(keyword);
    setLoading(true);

    // Simulate search functionality
    const timeoutId = setTimeout(() => {
      if (keyword.trim()) {
        const filtered = yeuCauDichVuItems.filter(
          item =>
            item.MaChiTietDonHang.toString().includes(keyword) ||
            item.LoaiDichVu.toLowerCase().includes(keyword.toLowerCase()) ||
            item.MoTa.toLowerCase().includes(keyword.toLowerCase())
        );
        setServiceRequests(filtered);
      } else {
        setServiceRequests(yeuCauDichVuItems);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSort = (value: string) => {
    // Skip if the sort option is the same
    if (sortOption === value) return;

    setSortOption(value);

    // Sort the service requests based on the selected option
    let sortedServices = [...serviceRequests];

    switch (value) {
      case 'newest':
        // Simulated sort by date
        // In a real app, you would parse dates and sort properly
        sortedServices = sortedServices.reverse();
        break;
      case 'oldest':
        // Original order is assumed to be oldest first
        break;
      case 'cost-high':
        sortedServices.sort((a, b) => b.ChiPhiYeuCau - a.ChiPhiYeuCau);
        break;
      case 'cost-low':
        sortedServices.sort((a, b) => a.ChiPhiYeuCau - b.ChiPhiYeuCau);
        break;
      default:
        // Keep default order
        break;
    }

    setServiceRequests(sortedServices);
  };

  // Prepare sort options for TableWrapper
  const sortOptionItems = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'cost-high', label: 'Chi phí cao nhất' },
    { value: 'cost-low', label: 'Chi phí thấp nhất' }
  ];

  // Calculate statistics for stat cards
  const pendingCount = serviceRequests.filter(s => s.TrangThaiYeuCau === "Đang chờ xác nhận").length;
  const confirmedCount = serviceRequests.filter(s => s.TrangThaiYeuCau === "Đã xác nhận").length;
  const totalCost = serviceRequests.reduce((sum, item) => sum + item.ChiPhiYeuCau, 0);

  // Prepare stat cards for TableWrapper
  const statCards = [
    {
      title: 'Tổng yêu cầu',
      value: serviceRequests.length,
      icon: <HiOutlineClipboardCheck className="text-blue-500 dark:text-blue-400 text-xl" />,
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Chờ xác nhận',
      value: pendingCount,
      icon: <HiOutlineDocumentText className="text-yellow-500 dark:text-yellow-400 text-xl" />,
      color: 'bg-yellow-100 dark:bg-yellow-900'
    },
    {
      title: 'Đã xác nhận',
      value: confirmedCount,
      icon: <HiOutlineClipboardCheck className="text-green-500 dark:text-green-400 text-xl" />,
      color: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Tổng chi phí',
      value: `${totalCost.toLocaleString('vi-VN')} VNĐ`,
      icon: <HiOutlineCurrencyDollar className="text-purple-500 dark:text-purple-400 text-xl" />,
      color: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Quản lý yêu cầu dịch vụ"
        subtitle="Tất cả yêu cầu dịch vụ"
        addButtonLink="/yeu-cau-dich-vu/create"
        addButtonLabel="Thêm yêu cầu mới"
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm yêu cầu dịch vụ..."
        onSort={handleSort}
        sortOptions={sortOptionItems}
        currentSortOption={sortOption}
        contextType="sanpham"
        itemLabel="yêu cầu dịch vụ"
        statCards={statCards}
        isLoading={loading}
        hasData={serviceRequests.length > 0}
        emptyStateMessage="Không có yêu cầu dịch vụ nào"
      >
        <CustomYeuCauDichVuTable
          services={serviceRequests}
          isLoading={loading}
        />
      </TableWrapper>
    </div>
  );
};

export default YeuCauDichVu;
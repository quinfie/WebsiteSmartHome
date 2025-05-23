import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DonHangTable,
  Pagination,
  RowsPerPage,
  Sidebar,
} from "../components";
import {
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineClipboardCheck,
  HiOutlineRefresh
} from "react-icons/hi";
import { useDonHang } from "../contexts/DonHangContext";
import { motion } from "framer-motion";

// Status option array
const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "Chờ xác nhận", label: "Chờ xác nhận" },
  { value: "Đã xác nhận", label: "Đã xác nhận" },
  { value: "Đang giao", label: "Đang giao" },
  { value: "Hoàn thành", label: "Hoàn thành" },
  { value: "Đã hủy", label: "Đã hủy" }
];

// Sort option array that is separate from the sortOptions state in context
const sortOptionItems = [
  { value: "ngayDat_desc", label: "Cũ nhất", ascending: false },
  { value: "ngayDat_asc", label: "Mới nhất", ascending: true }
];

const timeRangeOptions = [
  { value: "", label: "Tất cả thời gian" },
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "7 ngày qua" },
  { value: "month", label: "30 ngày qua" },
  { value: "quarter", label: "3 tháng qua" }
];

interface FilterOptions {
  keyword?: string;
  trangThai: string;
  tuNgay?: Date;
  denNgay?: Date;
}

interface LocalFilterOptions {
  trangThai: string;
  tuNgay: string;
  denNgay: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const {
    orders,
    isLoading,
    paginationInfo,
    filterOptions,
    sortOptions,
    setFilterOptions,
    setSortOptions,
    fetchOrders,
    searchAndSortOrders,
    remove
  } = useDonHang();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [localFilterOptions, setLocalFilterOptions] = useState<LocalFilterOptions>({
    trangThai: filterOptions.trangThai || "",
    tuNgay: filterOptions.tuNgay ? filterOptions.tuNgay.toISOString().split('T')[0] : "",
    denNgay: filterOptions.denNgay ? filterOptions.denNgay.toISOString().split('T')[0] : ""
  });

  // Order statistics
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      // Calculate statistics
      const pending = orders.filter(o => o.trangThaiDonHang === "Chờ xác nhận" || o.trangThaiDonHang === "Đã xác nhận" || o.trangThaiDonHang === "Đang giao").length;
      const completed = orders.filter(o => o.trangThaiDonHang === "Hoàn thành").length;
      const cancelled = orders.filter(o => o.trangThaiDonHang === "Đã hủy").length;

      setOrderStats({
        total: orders.length,
        pending,
        completed,
        cancelled
      });
    }
  }, [orders]);

  const handleEdit = (id: string) => {
    navigate(`/dashboard/orders/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa đơn hàng này không?");
    if (!confirmDelete) return;

    try {
      await remove(id);
      setMessage("Xóa đơn hàng thành công!");
      setTimeout(() => setMessage(""), 3000);
      fetchOrders(); // Refresh the list
    } catch (error: any) {
      console.error("Lỗi khi xóa đơn hàng:", error);

      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = "Không thể xóa đơn hàng. ";

      if (error?.message) {
        if (error.message.includes("invalid_status")) {
          errorMessage += "Chỉ có thể xóa đơn hàng ở trạng thái 'Chờ xác nhận'.";
        } else if (error.message.includes("invalid_permission")) {
          errorMessage += "Bạn không có quyền xóa đơn hàng này.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "Vui lòng thử lại sau.";
      }

      setError(errorMessage);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleViewDetail = async (orderId: string) => {
    if (openDetailId === orderId) {
      setOpenDetailId(null);
      return;
    }
    setOpenDetailId(orderId);
  };

  const handleViewLichBaoTri = (donHangId: string) => {
    navigate(`/dashboard/lich-bao-tri/${donHangId}`);
  };

  const getDateRangeFromOption = (option: string): { tuNgay?: Date; denNgay?: Date } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (option) {
      case "today":
        return {
          tuNgay: today,
          denNgay: now
        };
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return {
          tuNgay: weekAgo,
          denNgay: now
        };
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return {
          tuNgay: monthAgo,
          denNgay: now
        };
      case "quarter":
        const quarterAgo = new Date(today);
        quarterAgo.setDate(quarterAgo.getDate() - 90);
        return {
          tuNgay: quarterAgo,
          denNgay: now
        };
      default:
        return {
          tuNgay: undefined,
          denNgay: undefined
        };
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const dateRange = getDateRangeFromOption(timeRange);

    setFilterOptions({
      keyword: searchKeyword,
      trangThai: filterStatus,
      ...dateRange
    });
    searchAndSortOrders();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'trangThai':
        setFilterStatus(value);
        break;
      case 'timeRange':
        setTimeRange(value);
        break;
    }
  };

  const resetFilters = () => {
    setSearchKeyword("");
    setFilterStatus("");
    setTimeRange("");
    setFilterOptions({
      keyword: "",
      trangThai: "",
      tuNgay: undefined,
      denNgay: undefined
    });
    searchAndSortOrders();
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) {
      setSortOptions({
        sortBy: "ngayDat",
        ascending: true // Mặc định tăng dần
      });
      searchAndSortOrders();
      return;
    }

    // Mới nhất: ngayDat_desc -> ascending = false (để ngày lớn lên trên)
    // Cũ nhất: ngayDat_asc -> ascending = true (để ngày nhỏ lên trên)
    setSortOptions({
      sortBy: 'ngayDat',
      ascending: value === 'ngayDat_asc'
    });

    searchAndSortOrders();
  };

  // Get paginated data
  const { currentPage, pageSize, totalItems } = paginationInfo;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedOrders = orders.slice(startIndex, endIndex);

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        {/* Header section with gradient background */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-8 px-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">Quản lý đơn hàng</h2>
            <p className="opacity-80 flex items-center text-sm">
              <span>Bảng điều khiển</span>{" "}
              <HiOutlineChevronRight className="mx-2" />{" "}
              <span>Tất cả đơn hàng</span>
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total orders card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng đơn hàng</p>
                  <h3 className="text-2xl font-bold mt-1 dark:text-white">{orderStats.total}</h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <HiOutlineClipboardCheck className="text-blue-600 dark:text-blue-300 text-xl" />
                </div>
              </div>
            </motion.div>

            {/* Pending orders card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Đơn hàng đang xử lý</p>
                  <h3 className="text-2xl font-bold mt-1 dark:text-white">{orderStats.pending}</h3>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                  <HiOutlineRefresh className="text-yellow-600 dark:text-yellow-300 text-xl" />
                </div>
              </div>
            </motion.div>

            {/* Completed orders card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Đơn hàng hoàn thành</p>
                  <h3 className="text-2xl font-bold mt-1 dark:text-white">{orderStats.completed}</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <HiOutlineClipboardCheck className="text-green-600 dark:text-green-300 text-xl" />
                </div>
              </div>
            </motion.div>

            {/* Cancelled orders card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Đơn hàng đã hủy</p>
                  <h3 className="text-2xl font-bold mt-1 dark:text-white">{orderStats.cancelled}</h3>
                </div>
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                  <HiOutlineX className="text-red-600 dark:text-red-300 text-xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="py-6 px-8">
          {/* Action buttons row */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex gap-2">
              <Link
                to="/dashboard/orders/create"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-2 rounded-md shadow-md flex items-center justify-center gap-x-1 transition-all duration-200"
              >
                <HiOutlinePlus className="text-white" />
                <span className="font-medium">Thêm đơn hàng</span>
              </Link>
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${showFilters
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                } transition-all duration-200`}
            >
              <HiOutlineFilter />
              <span>Bộ lọc</span>
              {Object.values(localFilterOptions).some(val =>
                val !== "" && val !== undefined && val !== null
              ) && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {Object.values(localFilterOptions).filter(val =>
                      val !== "" && val !== undefined && val !== null
                    ).length}
                  </span>
                )}
            </button>
          </div>

          {/* Alerts */}
          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Filters panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tìm kiếm
                  </label>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="Tìm kiếm..."
                  />
                </div>

                {/* Status filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sắp xếp theo
                  </label>
                  <select
                    name="sortBy"
                    value={`${sortOptions.sortBy}_${sortOptions.ascending ? "asc" : "desc"}`}
                    onChange={handleSort}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  >
                    <option value="">-- Không sắp xếp --</option>
                    {sortOptionItems.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>


                {/* Time range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thời gian
                  </label>
                  <select
                    name="timeRange"
                    value={timeRange}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  >
                    {timeRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Đặt lại
                </button>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          )}

          {/* sort row */}
          <div className="flex flex-wrap justify-end items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Sắp xếp:</label>
              <select
                className="w-40 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onChange={handleSort}
                value={sortOptions.sortBy ? `ngayDat_${sortOptions.ascending ? 'asc' : 'desc'}` : ""}
              >
                <option value="">Mặc định</option>
                {sortOptionItems.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <DonHangTable
              data={paginatedOrders}
              loading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleViewDetail}
              onViewLichBaoTri={handleViewLichBaoTri}
              openDetailId={openDetailId}
            />
          </div>

          {/* Empty state */}
          {!isLoading && paginatedOrders.length === 0 && (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-4 border border-gray-200 dark:border-gray-700">
              <HiOutlineClipboardCheck className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Không có đơn hàng nào</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Không tìm thấy đơn hàng nào phù hợp với điều kiện lọc của bạn.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Pagination controls */}
          <div className="flex justify-between items-center py-6 flex-wrap gap-4">
            <RowsPerPage contextType="donhang" itemLabel="đơn hàng" showTotal={false} />
            <Pagination contextType="donhang" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

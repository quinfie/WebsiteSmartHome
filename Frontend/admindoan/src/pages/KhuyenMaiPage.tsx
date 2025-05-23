import React, { useState, useEffect } from "react";
import { Sidebar, TableWrapper } from "../components";
import {
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineTag,
  HiOutlineGift,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineTrash
} from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { KhuyenMaiDto } from "../types/khuyenmai";
import { getAllPromotions, deleteKhuyenMai } from "../api/khuyenmai";
import { toast } from "react-hot-toast";

// Custom PromotionTable component
const CustomPromotionTable: React.FC<{ promotions: KhuyenMaiDto[], isLoading: boolean }> =
  ({ promotions, isLoading }) => {
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc muốn xóa khuyến mãi này không?")) {
        try {
          await deleteKhuyenMai(id);
          toast.success("Xóa khuyến mãi thành công");
          // Refresh data after deletion
          window.location.reload();
        } catch (error) {
          toast.error("Không thể xóa khuyến mãi. Vui lòng thử lại sau.");
        }
      }
    };

    const handleEdit = (id: string) => {
      navigate(`/dashboard/promotions/${id}/edit`);
    };

    // Calculate status based on dates
    const getPromotionStatus = (startDate: string, endDate: string) => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (now < start) {
        return { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" };
      } else if (now > end) {
        return { label: "Đã kết thúc", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" };
      } else {
        return { label: "Đang diễn ra", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" };
      }
    };

    return (
      <div className="w-full px-0">
        <div className="overflow-x-auto w-full px-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineGift className="text-blue-500" /> Tên Khuyến Mãi
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineTag className="text-green-500" /> Mức Giảm (%)
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineCalendar className="text-purple-500" /> Ngày Bắt Đầu
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineCalendar className="text-orange-500" /> Ngày Kết Thúc
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    Trạng Thái
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
                  <td colSpan={6} className="text-center py-6 dark:text-white text-gray-700">Đang tải dữ liệu...</td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 dark:text-white text-gray-700">Không có khuyến mãi nào.</td>
                </tr>
              ) : (
                promotions.map((item) => {
                  const status = getPromotionStatus(item.ngayBatDau, item.ngayKetThuc);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-4 font-medium dark:text-white text-gray-700">
                        <div className="flex items-center gap-2">
                          <HiOutlineGift className="text-blue-500 dark:text-blue-400" />
                          {item.tenKhuyenMai}
                        </div>
                      </td>
                      <td className="py-4 px-4 dark:text-white text-gray-700">
                        <div className="flex items-center gap-2">
                          <HiOutlineTag className="text-green-500 dark:text-green-400" />
                          {item.phanTramGiam}%
                        </div>
                      </td>
                      <td className="py-4 px-4 dark:text-white text-gray-700">
                        {new Date(item.ngayBatDau).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4 px-4 dark:text-white text-gray-700">
                        {new Date(item.ngayKetThuc).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4 px-4 dark:text-white text-gray-700">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                            title="Chỉnh sửa"
                            onClick={() => handleEdit(item.id)}
                          >
                            <HiOutlinePencil size={18} />
                          </button>
                          <button
                            className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                            title="Xóa"
                            onClick={() => handleDelete(item.id)}
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

const KhuyenMaiPage = () => {
  const [promotions, setPromotions] = useState<KhuyenMaiDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    startDate: "",
    endDate: "",
    minDiscount: "",
    maxDiscount: ""
  });
  const navigate = useNavigate();

  // Load promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const data = await getAllPromotions(); // Use getAllPromotions instead
        setPromotions(data);
      } catch (error) {
        toast.error("Không thể tải danh sách khuyến mãi. Vui lòng kiểm tra kết nối và thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleSearch = () => {
    // Implement search logic here
    const filtered = promotions.filter(
      item => item.tenKhuyenMai.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setPromotions(filtered);
  };

  const handleSort = (value: string) => {
    setSortOption(value);
    let sorted = [...promotions];

    switch (value) {
      case "name":
        sorted.sort((a, b) => a.tenKhuyenMai.localeCompare(b.tenKhuyenMai));
        break;
      case "discount":
        sorted.sort((a, b) => b.phanTramGiam - a.phanTramGiam);
        break;
      case "startDate":
        sorted.sort((a, b) => new Date(a.ngayBatDau).getTime() - new Date(b.ngayBatDau).getTime());
        break;
      case "endDate":
        sorted.sort((a, b) => new Date(a.ngayKetThuc).getTime() - new Date(b.ngayKetThuc).getTime());
        break;
      default:
        break;
    }

    setPromotions(sorted);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    let filtered = [...promotions];

    if (filterOptions.startDate) {
      filtered = filtered.filter(item =>
        new Date(item.ngayBatDau) >= new Date(filterOptions.startDate)
      );
    }

    if (filterOptions.endDate) {
      filtered = filtered.filter(item =>
        new Date(item.ngayKetThuc) <= new Date(filterOptions.endDate)
      );
    }

    if (filterOptions.minDiscount) {
      filtered = filtered.filter(item =>
        item.phanTramGiam >= Number(filterOptions.minDiscount)
      );
    }

    if (filterOptions.maxDiscount) {
      filtered = filtered.filter(item =>
        item.phanTramGiam <= Number(filterOptions.maxDiscount)
      );
    }

    setPromotions(filtered);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilterOptions({
      startDate: "",
      endDate: "",
      minDiscount: "",
      maxDiscount: ""
    });
    // Reload original data
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllPromotions(); // Use getAllPromotions here too
        setPromotions(data);
      } catch (error) {
        toast.error("Không thể tải danh sách khuyến mãi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  // Calculate statistics
  const getStatistics = () => {
    const now = new Date();
    const active = promotions.filter(p => {
      const start = new Date(p.ngayBatDau);
      const end = new Date(p.ngayKetThuc);
      return now >= start && now <= end;
    });
    const upcoming = promotions.filter(p => new Date(p.ngayBatDau) > now);
    const expired = promotions.filter(p => new Date(p.ngayKetThuc) < now);

    return { active: active.length, upcoming: upcoming.length, expired: expired.length };
  };

  const stats = getStatistics();

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
                      <HiOutlineGift className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                      Quản lý khuyến mãi
                    </h2>
                  </div>
                  <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                    <span>Bảng điều khiển</span>{" "}
                    <HiOutlineChevronRight className="text-lg" />{" "}
                    <span>Khuyến mãi</span>
                  </p>
                </div>
                <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
                  <button className="dark:bg-blackPrimary bg-white/80 backdrop-blur-sm border border-gray-600 w-32 py-2 text-lg hover:border-gray-500 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-x-2 rounded-lg shadow-md">
                    <AiOutlineExport className="dark:text-whiteSecondary text-blackPrimary text-base" />
                    <span className="dark:text-whiteSecondary text-blackPrimary font-medium">Xuất</span>
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/promotions/create")}
                    className="bg-blue-600 text-white w-48 py-2 text-lg rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-x-2 transform hover:scale-105 shadow-lg"
                  >
                    <HiOutlinePlus />
                    Thêm khuyến mãi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Summary */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white">
                <div>
                  <h3 className="text-xl font-semibold">Đang diễn ra</h3>
                  <p className="text-3xl font-bold mt-1">{stats.active}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineGift className="h-8 w-8" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white">
                <div>
                  <h3 className="text-xl font-semibold">Sắp diễn ra</h3>
                  <p className="text-3xl font-bold mt-1">{stats.upcoming}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineCalendar className="h-8 w-8" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white">
                <div>
                  <h3 className="text-xl font-semibold">Đã kết thúc</h3>
                  <p className="text-3xl font-bold mt-1">{stats.expired}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineTag className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Sort Bar */}
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
                <input
                  type="text"
                  className="w-60 h-10 border dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 rounded-lg transition-all duration-300"
                  placeholder="Tìm kiếm khuyến mãi..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="h-10 px-4 bg-blue-600 text-white rounded-lg flex items-center gap-1 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                <HiOutlineSearch />
                Tìm
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-4 border rounded-lg flex items-center gap-1 transform hover:scale-105 transition-all duration-200 shadow-md
                  ${showFilters
                    ? 'bg-blue-100 border-blue-500 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400'}`}
              >
                <HiOutlineFilter />
                Bộ lọc
              </button>
            </div>
            <div>
              <select
                className="w-60 h-10 dark:bg-gray-800 bg-white border border-gray-300 dark:border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer hover:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 rounded-lg transition-all duration-300"
                value={sortOption}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="">Sắp xếp theo</option>
                <option value="name">Tên A-Z</option>
                <option value="discount">Mức giảm giá</option>
                <option value="startDate">Ngày bắt đầu</option>
                <option value="endDate">Ngày kết thúc</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="px-4 sm:px-6 lg:px-8 mt-3 bg-white dark:bg-gray-800 p-6 rounded-xl transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <HiOutlineFilter className="text-blue-500" />
                  Lọc khuyến mãi nâng cao
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={filterOptions.startDate}
                    onChange={handleFilterChange}
                    className="w-full h-10 border dark:bg-gray-700 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-900 rounded-lg px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={filterOptions.endDate}
                    onChange={handleFilterChange}
                    className="w-full h-10 border dark:bg-gray-700 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-900 rounded-lg px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mức giảm tối thiểu (%)
                  </label>
                  <input
                    type="number"
                    name="minDiscount"
                    value={filterOptions.minDiscount}
                    onChange={handleFilterChange}
                    min="0"
                    max="100"
                    className="w-full h-10 border dark:bg-gray-700 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-900 rounded-lg px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mức giảm tối đa (%)
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={filterOptions.maxDiscount}
                    onChange={handleFilterChange}
                    min="0"
                    max="100"
                    className="w-full h-10 border dark:bg-gray-700 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-900 rounded-lg px-3"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <CustomPromotionTable promotions={promotions} isLoading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhuyenMaiPage;

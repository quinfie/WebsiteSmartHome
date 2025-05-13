import React, { useState, useEffect } from "react";
import { Sidebar, TableWrapper } from "../components";
import {
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineGift,
  HiOutlineTag,
  HiOutlineCalendar
} from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface Promotion {
  id: number;
  tenKhuyenMai: string;
  mucGiam: number;
  ngayBatDau: string;
  ngayKetThuc: string;
}

const mockPromotions: Promotion[] = [
  { id: 1, tenKhuyenMai: "Giảm giá Tết", mucGiam: 20, ngayBatDau: "2025-02-01", ngayKetThuc: "2025-02-10" },
  { id: 2, tenKhuyenMai: "Hè rực rỡ", mucGiam: 15, ngayBatDau: "2025-06-01", ngayKetThuc: "2025-06-30" },
];

// Custom PromotionTable component
const CustomPromotionTable: React.FC<{ promotions: Promotion[], isLoading: boolean }> =
  ({ promotions, isLoading }) => {
    const navigate = useNavigate();

    const handleDelete = (id: number) => {
      if (window.confirm("Bạn có chắc muốn xóa khuyến mãi này không?")) {
        // Handle delete logic here
        alert(`Xóa khuyến mãi: ${id}`);
      }
    };

    const handleEdit = (id: number) => {
      navigate(`/promotions/edit/${id}`);
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
                          {item.mucGiam}%
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

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const navigate = useNavigate();

  // Simulated loading data only once
  useEffect(() => {
    if (!initialLoadDone) {
      setLoading(true);
      // Simulate API call delay
      const timeoutId = setTimeout(() => {
        setPromotions(mockPromotions);
        setLoading(false);
        setInitialLoadDone(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [initialLoadDone]);

  const handleSearch = (keyword: string) => {
    if (searchKeyword === keyword) return;

    setSearchKeyword(keyword);
    setLoading(true);

    // Simulate search functionality
    const timeoutId = setTimeout(() => {
      if (keyword.trim()) {
        const filtered = mockPromotions.filter(
          item =>
            item.tenKhuyenMai.toLowerCase().includes(keyword.toLowerCase())
        );
        setPromotions(filtered);
      } else {
        setPromotions(mockPromotions);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSort = (value: string) => {
    if (sortOption === value) return;

    setSortOption(value);

    // Sort the promotions based on the selected option
    let sortedPromotions = [...promotions];

    switch (value) {
      case 'az':
        sortedPromotions.sort((a, b) => a.tenKhuyenMai.localeCompare(b.tenKhuyenMai));
        break;
      case 'za':
        sortedPromotions.sort((a, b) => b.tenKhuyenMai.localeCompare(a.tenKhuyenMai));
        break;
      case 'discount-high':
        sortedPromotions.sort((a, b) => b.mucGiam - a.mucGiam);
        break;
      case 'discount-low':
        sortedPromotions.sort((a, b) => a.mucGiam - b.mucGiam);
        break;
      case 'newest':
        sortedPromotions.sort((a, b) => new Date(b.ngayBatDau).getTime() - new Date(a.ngayBatDau).getTime());
        break;
      case 'oldest':
        sortedPromotions.sort((a, b) => new Date(a.ngayBatDau).getTime() - new Date(b.ngayBatDau).getTime());
        break;
      default:
        // Keep default order
        break;
    }

    setPromotions(sortedPromotions);
  };

  // Get current date for calculating active promotions
  const now = new Date();

  // Calculate stats for stat cards
  const activePromotions = promotions.filter(p => {
    const start = new Date(p.ngayBatDau);
    const end = new Date(p.ngayKetThuc);
    return now >= start && now <= end;
  }).length;

  const upcomingPromotions = promotions.filter(p => {
    const start = new Date(p.ngayBatDau);
    return now < start;
  }).length;

  const expiredPromotions = promotions.filter(p => {
    const end = new Date(p.ngayKetThuc);
    return now > end;
  }).length;

  // Prepare sort options for TableWrapper
  const sortOptionItems = [
    { value: 'az', label: 'Tên A-Z' },
    { value: 'za', label: 'Tên Z-A' },
    { value: 'discount-high', label: 'Giảm giá cao nhất' },
    { value: 'discount-low', label: 'Giảm giá thấp nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' }
  ];

  // Prepare stat cards for TableWrapper
  const statCards = [
    {
      title: 'Tổng khuyến mãi',
      value: promotions.length,
      icon: <HiOutlineGift className="text-blue-500 dark:text-blue-400 text-xl" />,
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Đang diễn ra',
      value: activePromotions,
      icon: <HiOutlineTag className="text-green-500 dark:text-green-400 text-xl" />,
      color: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Sắp diễn ra',
      value: upcomingPromotions,
      icon: <HiOutlineCalendar className="text-purple-500 dark:text-purple-400 text-xl" />,
      color: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Đã kết thúc',
      value: expiredPromotions,
      icon: <HiOutlineCalendar className="text-gray-500 dark:text-gray-400 text-xl" />,
      color: 'bg-gray-100 dark:bg-gray-900'
    }
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Quản lý khuyến mãi"
        subtitle="Tất cả khuyến mãi"
        addButtonLink="/promotions/create-promotion"
        addButtonLabel="Thêm khuyến mãi"
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm khuyến mãi..."
        onSort={handleSort}
        sortOptions={sortOptionItems}
        currentSortOption={sortOption}
        contextType="sanpham"
        itemLabel="khuyến mãi"
        statCards={statCards}
        isLoading={loading}
        hasData={promotions.length > 0}
        emptyStateMessage="Không có khuyến mãi nào"
      >
        <CustomPromotionTable
          promotions={promotions}
          isLoading={loading}
        />
      </TableWrapper>
    </div>
  );
};

export default Promotions;

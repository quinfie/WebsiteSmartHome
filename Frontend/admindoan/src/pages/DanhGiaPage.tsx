// src/pages/DanhGiaPage.tsx
import React, { useState, useEffect } from "react";
import { Sidebar, TableWrapper } from "../components";
import {
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineStar,
  HiOutlineChat,
  HiOutlineCalendar
} from "react-icons/hi";
import { useDanhGia } from "../contexts/DanhGiaContext";
import { DanhGiaDto } from "../types/danhgia";
import { useNavigate } from "react-router-dom";

// Custom DanhGiaTable component with props
const CustomDanhGiaTable: React.FC<{ reviews: DanhGiaDto[], isLoading: boolean }> =
  ({ reviews, isLoading }) => {
    const { deleteDanhGia, fetchAllDanhGia } = useDanhGia();
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) {
        try {
          await deleteDanhGia(id);
          fetchAllDanhGia();
        } catch (error) {
          console.error("Lỗi khi xóa đánh giá:", error);
        }
      }
    };

    const handleView = (id: string) => {
      navigate(`/dashboard/reviews/${id}`);
    };

    // Function to render star rating
    const renderStarRating = (rating: number) => {
      return (
        <div className="flex items-center">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            {rating} <HiOutlineStar className="inline ml-1" />
          </span>
        </div>
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
                    <HiOutlineCalendar className="text-blue-500" /> Mã đơn hàng
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineCalendar className="text-green-500" /> Mã sản phẩm
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineStar className="text-yellow-500" /> Số sao
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineChat className="text-purple-500" /> Nội dung
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineCalendar className="text-orange-500" /> Ngày đánh giá
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
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
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 dark:text-white text-gray-700">Không có đánh giá nào.</td>
                </tr>
              ) : (
                reviews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4 font-medium dark:text-white text-gray-700">
                      {item.maDonHang || "N/A"}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      {item.maSanPham || "N/A"}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      {renderStarRating(item.soSao)}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      <div className="max-w-xs truncate">
                        {item.noiDung || "Không có nội dung"}
                      </div>
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      {item.ngayDanhGia ? new Date(item.ngayDanhGia).toLocaleDateString('vi-VN') : "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                          title="Xem chi tiết"
                          onClick={() => handleView(item.id!)}
                        >
                          <HiOutlineEye size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                          title="Xóa"
                          onClick={() => handleDelete(item.id!)}
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

const DanhGiaPage = () => {
  const {
    danhGiaList: reviews,
    fetchAllDanhGia,
    searchDanhGia
  } = useDanhGia();

  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState<DanhGiaDto[]>([]);

  // Load data only once when component mounts
  useEffect(() => {
    let isMounted = true;

    if (!initialLoadDone) {
      setLoading(true);
      fetchAllDanhGia()
        .then(() => {
          if (isMounted) {
            setInitialLoadDone(true);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error("Error fetching reviews:", error);
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [fetchAllDanhGia, initialLoadDone]);

  // Update displayed reviews when the reviews from context change
  useEffect(() => {
    setDisplayedReviews(reviews);
  }, [reviews]);

  const handleSearch = async (keyword: string) => {
    if (searchKeyword === keyword) return;

    setSearchKeyword(keyword);
    setLoading(true);

    try {
      if (keyword.trim()) {
        const results = await searchDanhGia(keyword);
        setDisplayedReviews(results);
      } else {
        setDisplayedReviews(reviews);
      }
    } catch (error) {
      console.error("Error searching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (value: string) => {
    if (sortOption === value) return;

    setSortOption(value);

    // Sort the reviews based on the selected option
    let sortedReviews = [...displayedReviews];

    switch (value) {
      case 'sao-cao':
        sortedReviews.sort((a, b) => b.soSao - a.soSao);
        break;
      case 'sao-thap':
        sortedReviews.sort((a, b) => a.soSao - b.soSao);
        break;
      case 'moi-nhat':
        sortedReviews.sort((a, b) =>
          new Date(b.ngayDanhGia || "").getTime() - new Date(a.ngayDanhGia || "").getTime()
        );
        break;
      case 'cu-nhat':
        sortedReviews.sort((a, b) =>
          new Date(a.ngayDanhGia || "").getTime() - new Date(b.ngayDanhGia || "").getTime()
        );
        break;
      default:
        // Keep default order
        break;
    }

    setDisplayedReviews(sortedReviews);
  };

  // Prepare sort options for TableWrapper
  const sortOptionItems = [
    { value: 'sao-cao', label: 'Sao cao nhất' },
    { value: 'sao-thap', label: 'Sao thấp nhất' },
    { value: 'moi-nhat', label: 'Mới nhất' },
    { value: 'cu-nhat', label: 'Cũ nhất' }
  ];

  // Prepare stat cards for TableWrapper
  const statCards = [
    {
      title: 'Tổng đánh giá',
      value: reviews.length,
      icon: <HiOutlineChat className="text-blue-500 dark:text-blue-400 text-xl" />,
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Đánh giá 5 sao',
      value: reviews.filter(r => r.soSao === 5).length,
      icon: <HiOutlineStar className="text-yellow-500 dark:text-yellow-400 text-xl" />,
      color: 'bg-yellow-100 dark:bg-yellow-900'
    },
    {
      title: 'Điểm trung bình',
      value: reviews.length ? (reviews.reduce((acc, r) => acc + r.soSao, 0) / reviews.length).toFixed(1) : '0',
      icon: <HiOutlineStar className="text-green-500 dark:text-green-400 text-xl" />,
      color: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Đánh giá gần đây',
      value: reviews.filter(r => r.ngayDanhGia && new Date(r.ngayDanhGia).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
      icon: <HiOutlineCalendar className="text-purple-500 dark:text-purple-400 text-xl" />,
      color: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Quản lý đánh giá"
        subtitle="Tất cả đánh giá"
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm đánh giá..."
        onSort={handleSort}
        sortOptions={sortOptionItems}
        currentSortOption={sortOption}
        contextType="sanpham"
        itemLabel="đánh giá"
        statCards={statCards}
        isLoading={loading}
        hasData={displayedReviews.length > 0}
        emptyStateMessage="Không có đánh giá nào"
      >
        <CustomDanhGiaTable
          reviews={displayedReviews}
          isLoading={loading}
        />
      </TableWrapper>
    </div>
  );
};

export default DanhGiaPage;

// src/pages/DanhGiaPage.tsx
import React, { useState, useEffect } from "react";
import { Sidebar, TableWrapper } from "../components";
import {
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
const CustomDanhGiaTable: React.FC<{
  reviews: DanhGiaDto[],
  isLoading: boolean,
  setDisplayedReviews: (reviews: DanhGiaDto[]) => void
}> = ({
  reviews,
  isLoading,
  setDisplayedReviews
}) => {
    const { deleteDanhGia, fetchAllDanhGia, getDetailById } = useDanhGia();
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) {
        try {
          const success = await deleteDanhGia(id);
          if (success) {
            const response = await fetchAllDanhGia();
            setDisplayedReviews(response);
          }
        } catch (error) {
          console.error("Lỗi khi xóa đánh giá:", error);
        }
      }
    };

    const handleView = async (id: string) => {
      try {
        const detail = await getDetailById(id);
        // Lưu detail vào localStorage hoặc state quản lý toàn cục nếu muốn, ở đây sẽ truyền qua route state
        navigate(`/dashboard/reviews/${id}`, { state: { detail } });
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đánh giá:", error);
        navigate(`/dashboard/reviews/${id}`); // fallback
      }
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
  const [displayedReviews, setDisplayedReviews] = useState<DanhGiaDto[]>([]);

  // Load data only once when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchAllDanhGia();
        setDisplayedReviews(response);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array to run only once

  const handleSearch = async (keyword: string) => {
    if (searchKeyword === keyword) return;

    setSearchKeyword(keyword);
    setLoading(true);

    try {
      if (keyword.trim()) {
        const results = await searchDanhGia(keyword);
        setDisplayedReviews(results);
      } else {
        const response = await fetchAllDanhGia();
        setDisplayedReviews(response);
      }
    } catch (error) {
      console.error("Error searching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare stat cards for TableWrapper
  const statCards = [
    {
      title: 'Tổng đánh giá',
      value: displayedReviews.length,
      icon: <HiOutlineChat className="text-blue-500 dark:text-blue-400 text-xl" />,
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Đánh giá 5 sao',
      value: displayedReviews.filter(r => r.soSao === 5).length,
      icon: <HiOutlineStar className="text-yellow-500 dark:text-yellow-400 text-xl" />,
      color: 'bg-yellow-100 dark:bg-yellow-900'
    },
    {
      title: 'Điểm trung bình',
      value: displayedReviews.length ? (displayedReviews.reduce((acc, r) => acc + r.soSao, 0) / displayedReviews.length).toFixed(1) : '0',
      icon: <HiOutlineStar className="text-green-500 dark:text-green-400 text-xl" />,
      color: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Đánh giá gần đây',
      value: displayedReviews.filter(r => r.ngayDanhGia && new Date(r.ngayDanhGia).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
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
          setDisplayedReviews={setDisplayedReviews}
        />
      </TableWrapper>
    </div>
  );
};

export default DanhGiaPage;

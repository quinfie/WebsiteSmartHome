import { useSanPham } from '../contexts/SanPhamContext';
import { useDonHang } from '../contexts/DonHangContext';
import { useNguoiDung } from '../contexts/NguoiDungContext';
import React from 'react';

// Common pagination interface that all contexts should have
interface PaginationContextProps {
  paginationInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  setPageSize: (size: number) => void;
}

interface RowsPerPageProps {
  contextType?: 'sanpham' | 'donhang' | 'nguoidung';
  itemLabel?: string;
  showTotal?: boolean;
}

const RowsPerPage: React.FC<RowsPerPageProps> = ({
  contextType = 'sanpham',
  itemLabel = 'sản phẩm',
  showTotal = false
}) => {
  // Choose the appropriate context based on the type
  let context: PaginationContextProps;

  try {
    switch (contextType) {
      case 'donhang':
        context = useDonHang();
        break;
      case 'nguoidung':
        context = useNguoiDung();
        break;
      case 'sanpham':
      default:
        context = useSanPham();
        break;
    }
  } catch (error) {
    console.error("Context not available:", error);
    // Fallback to empty context if needed
    context = {
      paginationInfo: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 10
      },
      setPageSize: () => { }
    };
  }

  const { paginationInfo, setPageSize } = context;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
  };

  return (
    <div className="flex gap-2 items-center">
      <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Số dòng một trang:</p>
      <select
        className="w-24 h-9 dark:bg-gray-800 bg-white border border-gray-300 dark:border-gray-600 dark:text-white text-gray-700 rounded-md px-2 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        name="rows"
        id="rows"
        value={paginationInfo.pageSize}
        onChange={handleChange}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      {showTotal && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          Tổng số: {paginationInfo.totalItems} {itemLabel}
        </span>
      )}
    </div>
  );
};

export default RowsPerPage;

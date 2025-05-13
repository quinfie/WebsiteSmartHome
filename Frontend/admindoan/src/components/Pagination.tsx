import { useSanPham } from '../contexts/SanPhamContext';
import { useDonHang } from '../contexts/DonHangContext';
import { useNguoiDung } from '../contexts/NguoiDungContext';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import React from 'react';

// Common pagination interface that all contexts should have
interface PaginationContextProps {
  paginationInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  setCurrentPage: (page: number) => void;
}

interface PaginationProps {
  contextType?: 'sanpham' | 'donhang' | 'nguoidung';
}

// Support multiple context types for pagination
const Pagination: React.FC<PaginationProps> = ({ contextType = 'sanpham' }) => {
  // Choose the appropriate context based on the type
  let context: PaginationContextProps;

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

  const { paginationInfo, setCurrentPage } = context;
  const { currentPage, totalPages } = paginationInfo;

  // Tính toán phạm vi các trang cần hiển thị
  let startPage = currentPage - 1;
  if (startPage <= 0) startPage = 1;
  let endPage = startPage + 2;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = totalPages - 2 > 0 ? totalPages - 2 : 1;
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 items-center">
      <button
        className="flex items-center justify-center dark:bg-gray-800 bg-white border border-gray-300 dark:border-gray-600 dark:text-white text-gray-700 py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <HiOutlineChevronLeft className="mr-1" /> Trước
      </button>

      {pageNumbers.map(number => (
        <button
          key={number}
          className={`flex items-center justify-center h-9 w-9 border rounded-md ${currentPage === number
            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
            : 'dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-colors`}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </button>
      ))}

      <button
        className="flex items-center justify-center dark:bg-gray-800 bg-white border border-gray-300 dark:border-gray-600 dark:text-white text-gray-700 py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Sau <HiOutlineChevronRight className="ml-1" />
      </button>

      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
};

export default Pagination;

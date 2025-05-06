import { useState } from 'react';

const Pagination = () => {
  const totalPages = 10; // Tổng số trang
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <div className="flex gap-2 items-center">
      <button
        className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trước
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`border border-gray-600 py-1 px-3 hover:border-gray-500 ${
            currentPage === number
              ? 'dark:bg-whiteSecondary bg-blackPrimary dark:text-blackPrimary text-whiteSecondary'
              : 'dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary'
          }`}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </button>
      ))}
      <button
        className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;

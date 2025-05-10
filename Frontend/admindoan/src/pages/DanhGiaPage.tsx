// src/pages/DanhGiaPage.tsx
import DanhGiaTable from "../components/DanhGiaTable";
import {

  Pagination,
  RowsPerPage,
  Sidebar,
} from "../components";
import {
  HiOutlineChevronRight,
  HiOutlineSearch,
} from "react-icons/hi";

const DanhGiaPage = () => {
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tất cả đánh giá
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Bảng điều khiển</span>{" "}
                <HiOutlineChevronRight className="text-lg mx-1" />{" "}
                <span>Tất cả đánh giá</span>
              </p>
            </div>
          </div>

          {/* Search + Sort */}
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Tìm đánh giá..."
              />
            </div>
            <div>
              <select
                className="w-60 h-10 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                name="sort"
              >
                <option value="default">Sắp xếp</option>
                <option value="sao-cao">Sao cao nhất</option>
                <option value="sao-thap">Sao thấp nhất</option>
                <option value="moi-nhat">Mới nhất</option>
                <option value="cu-nhat">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <DanhGiaTable />

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
            <RowsPerPage />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DanhGiaPage;

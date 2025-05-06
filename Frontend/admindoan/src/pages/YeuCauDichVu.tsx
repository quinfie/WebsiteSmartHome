import React from "react";
import { HiOutlinePlus, HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { Sidebar, WhiteButton, Pagination, RowsPerPage } from "../components";
import YeuCauDichVuTable from "../components/YeuCauDichVuTable";

const YeuCauDichVu = () => (
  <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
    <Sidebar />
    <div className="w-full py-10">
      {/* header */}
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Yêu Cầu Dịch Vụ</h2>
          <p className="text-base flex items-center dark:text-whiteSecondary text-blackPrimary">
            Bảng điều khiển <HiOutlineChevronRight className="mx-2" /> Yêu Cầu DV
          </p>
        </div>
        <div className="flex gap-x-2">
          <button className="bg-whiteSecondary dark:bg-blackPrimary border border-gray-600 w-32 py-2 hover:border-gray-500 flex items-center justify-center gap-x-2">
            <AiOutlineExport className="text-base dark:text-whiteSecondary text-blackPrimary" />
            <span className="font-medium dark:text-whiteSecondary text-blackPrimary">Xuất</span>
          </button>
          <WhiteButton link="/yeu-cau-dich-vu/create" text="Thêm mới" width="48" py="2" textSize="lg">
            <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary text-xl" />
          </WhiteButton>
        </div>
      </div>

      {/* filter/search */}
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5">
        <div className="relative">
          <HiOutlineSearch className="absolute top-3 left-3 text-gray-400 text-lg" />
          <input
            type="text"
            className="w-60 h-10 pl-10 border dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary outline-none"
            placeholder="Tìm kiếm..."
          />
        </div>
        <select className="w-60 h-10 border dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary px-3">
          <option value="default">Sắp xếp theo</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {/* table */}
      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        <YeuCauDichVuTable />
      </div>

      {/* pagination */}
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6">
        <RowsPerPage />
        <Pagination />
      </div>
    </div>
  </div>
);

export default YeuCauDichVu;
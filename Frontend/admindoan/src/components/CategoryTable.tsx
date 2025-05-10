import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useDanhMuc } from "@/contexts/DanhMucContexts";
import { DanhMucDto } from "@/types/danhmuc";

const CategoryTable = () => {
  const { danhMucs, fetchDanhMucs, remove } = useDanhMuc();
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const detailRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    fetchDanhMucs();
  }, [fetchDanhMucs]);

  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [openDetailId]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
      await remove(id);
    }
  };

  const handleToggleDetail = (id: string) => {
    setOpenDetailId((prev) => (prev === id ? null : id));
  };

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-2/12" />
        <col className="w-6/12" />
        <col className="w-3/12" />
        <col className="w-1/12" />
      </colgroup>
      <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 pl-0 pr-8 font-semibold">Tên Danh Mục</th>
          <th className="py-2 pl-0 pr-4 font-semibold">Mô Tả</th>
          <th className="py-2 pl-0 pr-4 text-right font-semibold">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {danhMucs.length === 0 ? (
          <tr>
            <td colSpan={3} className="text-center py-6">
              Không có danh mục nào.
            </td>
          </tr>
        ) : (
          danhMucs.map((item: DanhMucDto) => (
            <React.Fragment key={item.id}>
              <tr>
                <td className="py-4 pl-4 pr-8">
                  <div className="flex items-center gap-x-3">
                    <img
                      alt={item.tenDanhMuc}
                      className="h-10 w-10 rounded-full object-cover bg-gray-200"
                    />
                    <span className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary">
                      {item.tenDanhMuc}
                    </span>
                  </div>
                </td>
                <td className="py-4 pl-0 pr-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                  {item.moTa}
                </td>
                <td className="py-4 pl-0 pr-4 text-right">
                  <div className="flex gap-x-1 justify-end">
                    <Link
                      to={`/danh-muc/sua/${item.id}`}
                      className="btn-icon"
                      title="Chỉnh sửa"
                    >
                      <HiOutlinePencil />
                    </Link>
                    <button
                      className="btn-icon"
                      title="Xem chi tiết"
                      onClick={() => handleToggleDetail(item.id)}
                    >
                      <HiOutlineEye />
                    </button>
                    <button
                      className="btn-icon"
                      title="Xóa"
                      onClick={() => handleDelete(item.id)}
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>

              {openDetailId === item.id && (
                <tr
                  ref={detailRef}
                  className="transition-all duration-300 bg-gray-50 dark:bg-gray-900"
                >
                  <td colSpan={3} className="px-4 py-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-black dark:text-whiteSecondary">
                      <p>
                        <strong>ID:</strong> {item.id}
                      </p>
                      <p>
                        <strong>Tên danh mục:</strong> {item.tenDanhMuc}
                      </p>
                      <p>
                        <strong>Mô tả:</strong> {item.moTa}
                      </p>
                    
                      
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
  );
};

export default CategoryTable;

// src/components/DanhGiaTable.tsx
import { useEffect } from "react";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDanhGia } from "../contexts/DanhGiaContext";

const DanhGiaTable = () => {
  const { danhGiaList, fetchAllDanhGia, deleteDanhGia } = useDanhGia();

  useEffect(() => {
    fetchAllDanhGia();
  }, []);

  return (
    <div className="overflow-x-auto w-full">
      <table className="mt-6 w-full table-auto text-left">
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th className="py-2 px-4 font-semibold">Mã Đơn Hàng</th>
            <th className="py-2 px-4 font-semibold">Mã Sản Phẩm</th>
            <th className="py-2 px-4 font-semibold">Số Sao</th>
            <th className="py-2 px-4 font-semibold">Nội Dung</th>
            <th className="py-2 px-4 font-semibold">Ngày Đánh Giá</th>
            <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {danhGiaList.map((item) => (
            <tr key={item.id}>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.maDonHang}</td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.maSanPham}</td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.soSao}</td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.noiDung}</td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.ngayDanhGia ? new Date(item.ngayDanhGia).toLocaleDateString() : ""}
              </td>
              <td className="py-4 px-4 text-right text-sm dark:text-whiteSecondary text-blackPrimary">
                <div className="flex justify-end gap-x-2">
                  <Link to={`/reviews/${item.id}`} className="btn-icon" title="Xem">
                    <HiOutlineEye />
                  </Link>
                  <button
                    className="btn-icon"
                    title="Xóa"
                    onClick={() => {
                      if (confirm("Bạn có chắc muốn xóa đánh giá này?")) {
                        deleteDanhGia(item.id!);
                      }
                    }}
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DanhGiaTable;

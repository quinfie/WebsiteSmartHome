import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { yeuCauDichVuItems } from "../utils/data";

const YeuCauDichVuTable = () => (
  <div className="overflow-x-auto w-full">
    <table className="mt-6 w-full table-auto text-left">
      <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 px-4 font-semibold">Mã Chi Tiết ĐH</th>
          <th className="py-2 px-4 font-semibold">Loại DV</th>
          <th className="py-2 px-4 font-semibold">Trạng Thái</th>
          <th className="py-2 px-4 font-semibold">Chi Phí</th>
          <th className="py-2 px-4 font-semibold">Ngày Hẹn</th>
          <th className="py-2 px-4 font-semibold">Mô Tả</th>
          <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {yeuCauDichVuItems.map(item => (
          <tr key={item.Id}>
            <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.MaChiTietDonHang}</td>
            <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.LoaiDichVu}</td>
            <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.TrangThaiYeuCau}</td>
            <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.ChiPhiYeuCau.toFixed(2)}</td>
            <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.NgayHen}</td>
            <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">{item.MoTa}</td>
            <td className="py-4 px-4 text-right text-sm dark:text-whiteSecondary text-blackPrimary">
              <div className="flex justify-end gap-x-2">
                <Link to={`/yeu-cau-dich-vu/edit/${item.Id}`} className="btn-icon" title="Chỉnh sửa">
                  <HiOutlinePencil />
                </Link>
                <Link to={`/yeu-cau-dich-vu/view/${item.Id}`} className="btn-icon" title="Xem">
                  <HiOutlineEye />
                </Link>
                <button className="btn-icon" title="Xóa" onClick={() => alert(`Xóa yêu cầu: ${item.Id}`)}>
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

export default YeuCauDichVuTable;
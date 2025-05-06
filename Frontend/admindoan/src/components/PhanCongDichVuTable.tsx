import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { phanCongDichVuItems } from "../utils/data";

const PhanCongDichVuTable = () => (
  <div className="overflow-x-auto w-full">
    <table className="mt-6 w-full table-auto text-left">
      <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 px-4 font-semibold">Mã Yêu Cầu</th>
          <th className="py-2 px-4 font-semibold">Mã Kỹ Thuật Viên</th>
          <th className="py-2 px-4 font-semibold">Ngày Phân Công</th>
          <th className="py-2 px-4 font-semibold">Trạng Thái</th>
          <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {phanCongDichVuItems.map((item) => (
          <tr key={nanoid()}>
            <td className="py-4 px-4 text-sm">{item.MaYeuCau}</td>
            <td className="py-4 px-4 text-sm">{item.MaKyThuatVien}</td>
            <td className="py-4 px-4 text-sm">{item.NgayPhanCong}</td>
            <td className="py-4 px-4 text-sm">{item.TrangThaiPhanCong}</td>
            <td className="py-4 px-4 text-right text-sm">
              <div className="flex justify-end gap-x-2">
                <Link to={`/phan-cong-dich-vu/edit/${item.Id}`} className="btn-icon" title="Chỉnh sửa">
                  <HiOutlinePencil />
                </Link>
                <Link to={`/phan-cong-dich-vu/view/${item.Id}`} className="btn-icon" title="Xem">
                  <HiOutlineEye />
                </Link>
                <button
                  className="btn-icon"
                  title="Xóa"
                  onClick={() => alert(`Xóa phân công: ${item.Id}`)}
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

export default PhanCongDichVuTable;

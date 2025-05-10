import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { nhaCungCapItems } from "../utils/data";

const NhaCungCapTable = () => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="mt-6 w-full table-auto text-left">
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th className="py-2 px-4 font-semibold">Tên nhà cung cấp</th>
            <th className="py-2 px-4 font-semibold">Số điện thoại</th>
            <th className="py-2 px-4 font-semibold">Email</th>
            <th className="py-2 px-4 font-semibold">Địa chỉ</th>
            <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {nhaCungCapItems.map((item) => (
            <tr key={nanoid()}>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.TenNhaCungCap}
              </td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.SoDienThoai}
              </td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.Email}
              </td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.DiaChi}
              </td>
              <td className="py-4 px-4 text-right text-sm dark:text-whiteSecondary text-blackPrimary">
                <div className="flex justify-end gap-x-2">
                  <Link
                    to={`/nha-cung-cap/edit/${item.Id}`}
                    className="btn-icon"
                    title="Chỉnh sửa"
                  >
                    <HiOutlinePencil />
                  </Link>
                  <Link
                    to={`/nha-cung-cap/view/${item.Id}`}
                    className="btn-icon"
                    title="Xem chi tiết"
                  >
                    <HiOutlineEye />
                  </Link>
                  <button
                    className="btn-icon"
                    title="Xóa"
                    onClick={() => alert(`Xóa nhà cung cấp: ${item.Id}`)}
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

export default NhaCungCapTable;

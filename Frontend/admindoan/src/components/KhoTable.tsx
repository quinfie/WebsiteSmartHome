// src/components/KhoTable.tsx
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useKho } from "../contexts/KhoContext";

const KhoTable = () => {
  const { khoList } = useKho();

  return (
    <div className="overflow-x-auto w-full">
      <table className="mt-6 w-full table-auto text-left">
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th className="py-2 px-4 font-semibold">Tên Kho</th>
            <th className="py-2 px-4 font-semibold">Địa Chỉ</th>
            <th className="py-2 px-4 font-semibold">SĐT</th>
            <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {khoList.map((item) => (
            <tr key={item.id}>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.tenKho}
              </td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.diaChi}
              </td>
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.soDienThoai}
              </td>
              <td className="py-4 px-4 text-right text-sm dark:text-whiteSecondary text-blackPrimary">
                <div className="flex justify-end gap-x-2">
                  <Link to={`/kho/edit/${item.id}`} className="btn-icon" title="Chỉnh sửa">
                    <HiOutlinePencil />
                  </Link>
                  <Link to={`/kho/view/${item.id}`} className="btn-icon" title="Xem">
                    <HiOutlineEye />
                  </Link>
                  <button
                    className="btn-icon"
                    title="Xóa"
                    onClick={() => alert(`Xóa kho ${item.id}`)}
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

export default KhoTable;

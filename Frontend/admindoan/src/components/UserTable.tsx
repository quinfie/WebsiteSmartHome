import { nanoid } from "nanoid";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

interface UserTableProps {
  users: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-full sm:w-2/12" />
        <col className="sm:w-1/12" />
        <col className="sm:w-2/12" />
        <col className="sm:w-2/12" />
        <col className="sm:w-2/12" />
        <col className="sm:w-2/12" />
        <col className="sm:w-2/12" />
      </colgroup>
      <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th scope="col" className="py-2 pl-4 pr-4 font-semibold sm:pl-6 lg:pl-8">Tên người dùng</th>
          <th scope="col" className="py-2 px-4 font-semibold">Giới tính</th>
          <th scope="col" className="py-2 px-4 font-semibold">Ngày sinh</th>
          <th scope="col" className="py-2 px-4 font-semibold">CCCD</th>
          <th scope="col" className="py-2 px-4 font-semibold">Số điện thoại</th>
          <th scope="col" className="py-2 px-4 font-semibold">Địa chỉ</th>
          <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-6 lg:pr-8">Hành động</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {users.map((user) => (
          <tr key={user.id || nanoid()}>
            <td className="py-4 pl-4 pr-4 sm:pl-6 lg:pl-8">
              <span className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                {user.tenNguoiDung}
              </span>
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {user.gioiTinh}
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {user.ngaySinh ? new Date(user.ngaySinh).toLocaleDateString() : ""}
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {user.cccd}
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {user.soDienThoai}
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {user.diaChi}
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary sm:pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <button
                  className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                  aria-label="Chỉnh sửa"
                  onClick={() => onEdit(user.id)}
                >
                  <HiOutlinePencil className="text-lg" />
                </button>
                <button
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                  aria-label="Xóa"
                  onClick={() => onDelete(user.id)}
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;

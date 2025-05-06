import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { userAdminItems } from "../utils/data";

const UserTable = () => {
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
          <th scope="col" className="py-2 px-4 font-semibold">SĐT</th>
          <th scope="col" className="py-2 px-4 font-semibold">Địa chỉ</th>
          <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-6 lg:pr-8">Hành động</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {userAdminItems.map((item) => (
          <tr key={nanoid()}>
            <td className="py-4 pl-4 pr-4 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <img
                  src={item.user.imageUrl}
                  alt={item.user.name}
                  className="h-8 w-8 rounded-full bg-gray-800"
                />
                <span className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {item.user.name}
                </span>
              </div>
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {item.gioiTinh}
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {item.ngaySinh}
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {item.cccd}
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {item.soDienThoai}
            </td>
            <td className="py-4 px-4 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
              {item.diaChi}
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary sm:pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to={`/users/${item.id}`}
                  className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                  aria-label="Chỉnh sửa"
                >
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <Link
                  to={`/users/${item.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                  aria-label="Xem"
                >
                  <HiOutlineEye className="text-lg" />
                </Link>
                <button
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                  aria-label="Xóa"
                  onClick={() => console.log('Xóa người dùng', item.id)}
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

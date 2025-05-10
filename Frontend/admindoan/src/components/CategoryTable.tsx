import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { categories } from "../utils/data";

const CategoryTable = () => {
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
        {categories.map((item) => (
          <tr key={nanoid()}>
            <td className="py-4 pl-4 pr-8">
              <div className="flex items-center gap-x-3">
                <img
                  src={item.imageUrl}
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
                  to= "/categories/1"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-500"
                >
                  <HiOutlinePencil className="text-lg" title="Chỉnh sửa" />
                </Link>
                <Link
                  to="/categories/1"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-500"
                >
                  <HiOutlineEye className="text-lg" title="Xem chi tiết" />
                </Link>
                <Link
                  to="#"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-500"
                >
                  <HiOutlineTrash className="text-lg" title="Xóa" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;

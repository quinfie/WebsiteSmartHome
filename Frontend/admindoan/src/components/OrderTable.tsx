import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { orderAdminItems } from "../utils/data";

const OrderTable = () => {
  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
      </colgroup>
      <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Khách hàng
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Trạng thái
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Tổng tiền
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20"
          >
            Ngày đặt
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
          >
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {orderAdminItems.map((item) => (
          <tr key={nanoid()}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <img
                  src={item.user.imageUrl}
                  alt=""
                  className="h-8 w-8 rounded-full bg-gray-800"
                />
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {item.user.name}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 table-cell pr-8">
              <div className="flex gap-x-3">
                <div
                  className={`text-sm leading-6 py-1 px-2 ${
                    item.status === "Completed" &&
                    "dark:bg-green-900 bg-green-700 text-whiteSecondary font-semibold"
                  } ${
                    item.status === "On hold" &&
                    "dark:bg-yellow-900 bg-yellow-700 text-whiteSecondary font-semibold"
                  } ${
                    item.status === "Cancelled" &&
                    "dark:bg-red-900 bg-red-700 text-whiteSecondary font-semibold"
                  } ${
                    item.status === "Processing" &&
                    "dark:bg-blue-900 bg-blue-700 text-whiteSecondary font-semibold"
                  }`}
                >
                  {item.status === "Completed" && "Hoàn thành"}
                  {item.status === "On hold" && "Tạm hoãn"}
                  {item.status === "Cancelled" && "Đã hủy"}
                  {item.status === "Processing" && "Đang xử lý"}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div className="flex items-center gap-x-2 justify-start">
                <div className="dark:text-rose-200 text-rose-500 block font-bold">
                  {item.total}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell lg:pr-20">
              {item.date}
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to="/orders/1"
                  className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-500"
                >
                  <HiOutlinePencil className="text-lg" title="Chỉnh sửa" />
                </Link>
                <Link
                  to="/orders/1"
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

export default OrderTable;

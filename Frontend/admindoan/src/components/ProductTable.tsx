import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { productAdminItems } from "../utils/data";

const inStockClass =
  "text-green-400 bg-green-400/10 flex-none rounded-full p-1";
const outOfStockClass =
  "text-rose-400 bg-rose-400/10 flex-none rounded-full p-1";

const ProductTable = () => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="mt-6 w-full table-auto text-left">
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th className="py-2 px-4 font-semibold">Tên sản phẩm</th>
            <th className="py-2 px-4 font-semibold">Giá</th>
            <th className="py-2 px-4 font-semibold">Số lượng tồn</th>
            <th className="py-2 px-4 font-semibold">Bảo hành (tháng)</th>
            <th className="py-2 px-4 font-semibold">Mô tả</th>
            <th className="py-2 px-4 font-semibold">Ngày sản xuất</th>
            <th className="py-2 px-4 font-semibold">Danh mục</th>
            <th className="py-2 px-4 font-semibold">Nhà cung cấp</th>
            <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {productAdminItems.map((item) => (
            <tr key={nanoid()}>
              {/* Tên + ảnh */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-x-3">
                  <img
                    src={item.imageUrl ?? "/default-image.png"}
                    alt={item.TenSanPham}
                    className="h-8 w-8 rounded-full object-cover bg-gray-200"
                  />
                  <span className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary">
                    {item.TenSanPham}
                  </span>
                </div>
              </td>

              {/* Giá */}
              <td className="py-4 px-4 font-mono text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.Gia}
              </td>

              {/* Số lượng tồn */}
              <td className="py-4 px-4 text-sm">
                <div className="flex items-center gap-x-2">
                  <span className={item.SoLuongTon > 0 ? inStockClass : outOfStockClass}>
                    <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <span className="dark:text-whiteSecondary text-blackPrimary">
                    {item.SoLuongTon > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
              </td>

              {/* Bảo hành */}
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.ThoiGianBaoHanh}
              </td>

              {/* Mô tả */}
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.MoTa}
              </td>

              {/* Ngày sản xuất */}
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.NgaySanXuat}
              </td>

              {/* Danh mục */}
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.MaDanhMuc}
              </td>

              {/* Nhà cung cấp */}
              <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.MaNhaCungCap}
              </td>

              {/* Thao tác */}
              <td className="py-4 px-4 text-right text-sm dark:text-whiteSecondary text-blackPrimary">
                <div className="flex justify-end gap-x-2">
                  <Link
                    to={`/products/${item.MaKho}`}
                    className="btn-icon"
                    title="Chỉnh sửa"
                  >
                    <HiOutlinePencil />
                  </Link>
                  <Link
                    to={`/products/${item.MaKho}`}
                    className="btn-icon"
                    title="Xem chi tiết"
                  >
                    <HiOutlineEye />
                  </Link>
                  <Link
                    to="#"
                    className="btn-icon"
                    title="Xóa"
                  >
                    <HiOutlineTrash />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

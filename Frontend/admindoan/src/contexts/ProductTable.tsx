import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useSanPham } from "../contexts/SanPhamContext";

const inStockClass =
  "text-green-400 bg-green-400/10 flex-none rounded-full p-1";
const outOfStockClass =
  "text-rose-400 bg-rose-400/10 flex-none rounded-full p-1";

const ProductTable = () => {
  const { products, loading, fetchProducts, deleteProduct } = useSanPham();
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    }
  };

  const handleToggleDetail = (id: string) => {
    setOpenDetailId(prev => (prev === id ? null : id));
  };

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
            <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-6">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : (
            products.map((item) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-x-3">
                      <img
                        src={item.hinhAnh || "/default-image.png"}
                        alt={item.tenSanPham}
                        className="h-8 w-8 rounded-full object-cover bg-gray-200"
                      />
                      <span className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary">
                        {item.tenSanPham}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-sm dark:text-whiteSecondary text-blackPrimary">
                    {item.donGia.toLocaleString()} đ
                  </td>

                  <td className="py-4 px-4 text-sm">
                    <div className="flex items-center gap-x-2">
                      <span className={item.soLuongTon > 0 ? inStockClass : outOfStockClass}>
                        <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                      </span>
                      <span className="dark:text-whiteSecondary text-blackPrimary">
                        {item.soLuongTon > 0 ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                    {item.thoiGianBaoHanh}
                  </td>

                  <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                    {item.moTa}
                  </td>

                  <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                    {new Date(item.ngaySanXuat).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="py-4 px-4 text-right text-sm dark:text-whiteSecondary text-blackPrimary">
                    <div className="flex justify-end gap-x-2">
                      <Link to={`/dashboard/products/edit/${item.id}`} className="btn-icon" title="Chỉnh sửa">
                        <HiOutlinePencil />
                      </Link>
                      <button
                        className="btn-icon"
                        title="Xem chi tiết"
                        onClick={() => handleToggleDetail(item.id)}
                      >
                        <HiOutlineEye />
                      </button>
                      <button
                        className="btn-icon"
                        title="Xóa"
                        onClick={() => handleDelete(item.id)}
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>

                {openDetailId === item.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 dark:bg-gray-900 px-4 py-4 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-black dark:text-whiteSecondary">
                        <p><strong>Mã sản phẩm:</strong> {item.id}</p>
                        <p><strong>Tên sản phẩm:</strong> {item.tenSanPham }</p>
                        <p><strong>Đơn giá:</strong> {item.donGia}</p>
                        <p><strong>Số lượng tồn:</strong> {item.soLuongTon} </p>
                        <p><strong>Thời gian bảo hành:</strong> {item.thoiGianBaoHanh}</p>
                        <p><strong>Ngày sản xuất:</strong> {new Date(item.ngaySanXuat).toLocaleDateString("vi-VN")}</p>
                        <p><strong>Mô tả:</strong> {item.moTa}</p>
                        <p><strong>Hình ảnh:</strong> {item.hinhAnh}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

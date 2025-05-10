import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useNhaCungCap } from "../contexts/NhaCungCapContext";

const NhaCungCapTable = () => {
  const { suppliers, loading, fetchSuppliers, deleteSupplier } = useNhaCungCap();
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này không?")) {
      try {
        await deleteSupplier(id);
        fetchSuppliers();
      } catch (error) {
        console.error("Lỗi khi xóa nhà cung cấp:", error);
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
            <th className="py-2 px-4 font-semibold">Tên nhà cung cấp</th>
            <th className="py-2 px-4 font-semibold">Địa chỉ</th>
            <th className="py-2 px-4 font-semibold">Số điện thoại</th>
            <th className="py-2 px-4 font-semibold">Email</th>
            <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-6">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : (
            suppliers.map((item) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                    {item.tenNhaCungCap}
                  </td>
                  <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                    {item.diaChi}
                  </td>
                  <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                    {item.sdt}
                  </td>
                  <td className="py-4 px-4 text-sm dark:text-whiteSecondary text-blackPrimary">
                    {item.email}
                  </td>
                  <td className="py-4 px-4 text-right text-sm dark:text-whiteSecondary text-blackPrimary">
                    <div className="flex justify-end gap-x-2">
                      <Link to={`/suppliers/edit/${item.id}`} className="btn-icon" title="Chỉnh sửa">
                        <HiOutlinePencil />
                      </Link>
                      <button className="btn-icon" title="Xem chi tiết" onClick={() => handleToggleDetail(item.id)}>
                        <HiOutlineEye />
                      </button>
                      <button className="btn-icon" title="Xóa" onClick={() => handleDelete(item.id)}>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>

                {openDetailId === item.id && (
                  <tr>
                    <td colSpan={5} className="bg-gray-50 dark:bg-gray-900 px-4 py-4 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-black dark:text-whiteSecondary">
                        <p><strong>ID:</strong> {item.id}</p>
                        <p><strong>Tên:</strong> {item.tenNhaCungCap}</p>
                        <p><strong>Địa chỉ:</strong> {item.diaChi}</p>
                        <p><strong>Số điện thoại:</strong> {item.sdt}</p>
                        <p><strong>Email:</strong> {item.email}</p>

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

export default NhaCungCapTable;

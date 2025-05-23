import React, { useState, useEffect, useRef } from "react";
import { Sidebar, TableWrapper } from "../components";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineOfficeBuilding,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useNhaCungCap } from "../contexts/NhaCungCapContext";
import { NhaCungCapDto } from "../types/nhacungcap";

// Custom NhaCungCapTable component
const CustomNhaCungCapTable: React.FC<{ suppliers: NhaCungCapDto[], isLoading: boolean }> =
  ({ suppliers, isLoading }) => {
    const navigate = useNavigate();
    const { deleteSupplier, fetchSuppliers } = useNhaCungCap();

    const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này không?")) {
        try {
          await deleteSupplier(id);
          fetchSuppliers();
        } catch (error) {
          console.error("Lỗi khi xóa nhà cung cấp:", error);
          alert("Có lỗi xảy ra khi xóa nhà cung cấp");
        }
      }
    };

    const handleEdit = (id: string) => {
      navigate(`/dashboard/suppliers/${id}/edit`);
    };

    return (
      <div className="w-full px-0">
        <div className="overflow-x-auto w-full px-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineOfficeBuilding className="text-blue-500" /> Tên Nhà Cung Cấp
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlinePhone className="text-green-500" /> Số Điện Thoại
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineMail className="text-purple-500" /> Email
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineLocationMarker className="text-orange-500" /> Địa Chỉ
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 dark:text-white text-gray-700">Đang tải dữ liệu...</td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 dark:text-white text-gray-700">Không có nhà cung cấp nào.</td>
                </tr>
              ) : (
                suppliers.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4 font-medium dark:text-white text-gray-700">
                      <div className="flex items-center gap-2">
                        <HiOutlineOfficeBuilding className="text-blue-500 dark:text-blue-400" />
                        {item.tenNhaCungCap}
                      </div>
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      <div className="flex items-center gap-2">
                        <HiOutlinePhone className="text-green-500 dark:text-green-400" />
                        {item.sdt}
                      </div>
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      <div className="flex items-center gap-2">
                        <HiOutlineMail className="text-purple-500 dark:text-purple-400" />
                        {item.email}
                      </div>
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="text-orange-500 dark:text-orange-400" />
                        {item.diaChi}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                          title="Chỉnh sửa"
                          onClick={() => handleEdit(item.id)}
                        >
                          <HiOutlinePencil size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                          title="Xóa"
                          onClick={() => handleDelete(item.id)}
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

const NhaCungCap = () => {
  const { suppliers, loading, error, fetchSuppliers } = useNhaCungCap();
  const [displayedSuppliers, setDisplayedSuppliers] = useState<NhaCungCapDto[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      fetchSuppliers();
      isMounted.current = true;
    }
  }, [fetchSuppliers]);

  useEffect(() => {
    const filtered = suppliers.filter(supplier =>
      searchKeyword.trim() === "" ? true :
        supplier.tenNhaCungCap.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        supplier.sdt.includes(searchKeyword) ||
        supplier.diaChi.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setDisplayedSuppliers(filtered);
  }, [suppliers, searchKeyword]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Quản lý nhà cung cấp"
        subtitle="Danh sách nhà cung cấp"
        addButtonLink="/dashboard/suppliers/create"
        addButtonLabel="Thêm nhà cung cấp"
        contextType="sanpham"
        itemLabel="nhà cung cấp"
        isLoading={loading}
        hasData={displayedSuppliers.length > 0}
        emptyStateMessage={error || "Không có nhà cung cấp nào"}
        onSearch={handleSearch}
      >
        <CustomNhaCungCapTable
          suppliers={displayedSuppliers}
          isLoading={loading}
        />
      </TableWrapper>
    </div>
  );
};

export default NhaCungCap;

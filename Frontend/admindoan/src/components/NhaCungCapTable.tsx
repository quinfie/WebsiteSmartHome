import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineCog } from "react-icons/hi";
import { useNhaCungCap } from "../contexts/NhaCungCapContext";
import { sanPhamService } from "../api/sanpham";

const NhaCungCapTable = () => {
  const { suppliers, loading, fetchSuppliers, deleteSupplier } = useNhaCungCap();
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setCheckingId(id);

      // Kiểm tra xem nhà cung cấp có sản phẩm không
      const products = await sanPhamService.getByNhaCungCapId(id);

      if (products && products.length > 0) {
        alert("Không thể xóa nhà cung cấp này vì còn chứa sản phẩm. Vui lòng xóa các sản phẩm trước.");
        setCheckingId(null);
        return;
      }

      // Nếu không có sản phẩm, tiếp tục xóa
      if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này không?")) {
        try {
          setDeletingId(id);
          await deleteSupplier(id);
          setDeletingId(null);
          fetchSuppliers();
        } catch (error) {
          console.error("Lỗi khi xóa nhà cung cấp:", error);
          setDeletingId(null);
          alert("Có lỗi xảy ra khi xóa nhà cung cấp");
        }
      }

      setCheckingId(null);
    } catch (error) {
      console.error("Lỗi khi kiểm tra sản phẩm:", error);
      setCheckingId(null);
      alert("Có lỗi xảy ra khi kiểm tra dữ liệu sản phẩm");
    }
  };

  const handleToggleDetail = (id: string) => {
    setOpenDetailId(prev => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto w-full px-0 mt-8">
      <table className="w-full table-auto text-left rounded-lg overflow-hidden shadow-md bg-[#181A20]">
        <thead>
          <tr className="bg-[#23272F] text-white">
            <th className="py-3 px-4 font-bold text-left">
              <span className="inline-flex items-center gap-1">
                <HiOutlineOfficeBuilding className="text-blue-400 text-lg" /> Tên nhà cung cấp
              </span>
            </th>
            <th className="py-3 px-4 font-bold text-left">
              <span className="inline-flex items-center gap-1">
                <HiOutlineLocationMarker className="text-green-400 text-lg" /> Địa chỉ
              </span>
            </th>
            <th className="py-3 px-4 font-bold text-left">
              <span className="inline-flex items-center gap-1">
                <HiOutlineCog className="text-cyan-400 text-lg" /> Thao tác
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={5} className="text-left py-6 text-white">Đang tải dữ liệu...</td>
            </tr>
          ) : suppliers.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-left py-6 text-white">Không có nhà cung cấp nào.</td>
            </tr>
          ) : (
            suppliers.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="hover:bg-[#23272F] transition-colors group">
                  <td className="py-3 px-4 text-left text-white font-semibold">{item.tenNhaCungCap}</td>
                  <td className="py-3 px-4 text-left text-gray-300">{item.diaChi}</td>
                  <td className="py-3 px-4 text-left">
                    <div className="flex gap-x-2">
                      <Link to={`/dashboard/suppliers/${item.id}/edit`} className="p-2 rounded hover:bg-blue-600 transition-colors text-blue-400 hover:text-white" title="Chỉnh sửa">
                        <HiOutlinePencil size={18} />
                      </Link>
                      <button className={`p-2 rounded hover:bg-cyan-600 transition-colors text-cyan-400 hover:text-white ${openDetailId === item.id ? 'ring-2 ring-cyan-400' : ''}`} title={openDetailId === item.id ? "Đóng chi tiết" : "Xem chi tiết"} onClick={() => handleToggleDetail(item.id)}>
                        <HiOutlineEye size={18} className={openDetailId === item.id ? 'text-cyan-400' : ''} />
                      </button>
                      <button
                        className="p-2 rounded hover:bg-red-600 transition-colors text-red-400 hover:text-white"
                        title="Xóa"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id || checkingId === item.id}
                      >
                        {deletingId === item.id || checkingId === item.id ? (
                          <div className="h-[18px] w-[18px] border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <HiOutlineTrash size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                {openDetailId === item.id && (
                  <tr>
                    <td colSpan={5} className="bg-gradient-to-r from-[#20232a] to-[#23272F] px-10 py-7 text-base rounded-b-xl shadow-lg border-b-2 border-blue-900 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-white">
                        <div className="flex items-center gap-2">
                          <HiOutlineOfficeBuilding className="text-blue-400" />
                          <span className="uppercase text-xs text-blue-300 font-bold tracking-wider">Tên nhà cung cấp:</span>
                          <span className="ml-2 text-lg font-semibold text-white">{item.tenNhaCungCap}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiOutlineLocationMarker className="text-green-400" />
                          <span className="uppercase text-xs text-green-300 font-bold tracking-wider">Địa chỉ:</span>
                          <span className="ml-2 text-lg text-gray-300">{item.diaChi}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiOutlinePhone className="text-yellow-400" />
                          <span className="uppercase text-xs text-yellow-300 font-bold tracking-wider">Số điện thoại:</span>
                          <span className="ml-2 text-lg text-gray-300">{item.sdt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiOutlineMail className="text-purple-400" />
                          <span className="uppercase text-xs text-purple-300 font-bold tracking-wider">Email:</span>
                          <span className="ml-2 text-lg text-gray-300">{item.email}</span>
                        </div>
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

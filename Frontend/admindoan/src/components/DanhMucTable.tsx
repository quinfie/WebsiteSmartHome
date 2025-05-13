import { HiOutlineTrash, HiOutlineEye, HiOutlineFolderOpen, HiOutlineDocumentText, HiOutlineCog, HiOutlineCollection } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDanhMuc } from "../contexts/DanhMucContexts";
import { useState } from "react";
import { sanPhamService } from "../api/sanpham";

type DanhMucTableProps = {
  onViewProducts?: (categoryId: string) => void;
};

const DanhMucTable = ({ onViewProducts }: DanhMucTableProps) => {
  const { filteredDanhMucs, loading, remove } = useDanhMuc();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      setCheckingId(id);

      // Kiểm tra xem danh mục có sản phẩm không
      const products = await sanPhamService.getByDanhMucId(id);

      if (products && products.length > 0) {
        alert("Không thể xóa danh mục này vì còn chứa sản phẩm. Vui lòng xóa các sản phẩm trước.");
        setCheckingId(null);
        return;
      }

      // Nếu không có sản phẩm, tiếp tục xóa
      if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
        try {
          setDeletingId(id);
          await remove(id);
          setDeletingId(null);
        } catch (error) {
          console.error("Lỗi khi xóa danh mục:", error);
          setDeletingId(null);
          alert("Có lỗi xảy ra khi xóa danh mục");
        }
      }

      setCheckingId(null);
    } catch (error) {
      console.error("Lỗi khi kiểm tra sản phẩm:", error);
      setCheckingId(null);
      alert("Có lỗi xảy ra khi kiểm tra dữ liệu sản phẩm");
    }
  };

  return (
    <div className="overflow-x-auto w-full px-0 mt-8">
      <table className="w-full table-auto text-left rounded-lg overflow-hidden shadow-md bg-[#181A20]">
        <thead>
          <tr className="bg-[#23272F] text-white">
            <th className="py-3 px-4 font-bold text-left">
              <span className="inline-flex items-center gap-1">
                <HiOutlineFolderOpen className="text-blue-400 text-lg" /> Tên danh mục
              </span>
            </th>
            <th className="py-3 px-4 font-bold text-left">
              <span className="inline-flex items-center gap-1">
                <HiOutlineDocumentText className="text-green-400 text-lg" /> Mô tả
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
          {filteredDanhMucs.length === 0 ? (
            <tr className="hover:bg-[#23272F]">
              <td colSpan={3} className="py-4 px-4 text-center text-gray-400">
                Không có danh mục nào
              </td>
            </tr>
          ) : (
            filteredDanhMucs.map((item) => (
              <tr key={item.id} className="hover:bg-[#23272F] transition-colors group">
                <td className="py-3 px-4 text-left text-white font-semibold">{item.tenDanhMuc}</td>
                <td className="py-3 px-4 text-left text-gray-300">{item.moTa || 'Không có mô tả'}</td>
                <td className="py-3 px-4 text-left">
                  <div className="flex gap-x-2">
                    <Link
                      to={`/dashboard/categories/${item.id}/edit`}
                      className="p-2 rounded hover:bg-blue-600 transition-colors text-blue-400 hover:text-white"
                      title="Chỉnh sửa"
                    >
                      <HiOutlineEye size={18} />
                    </Link>
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
                    <Link
                      to="#"
                      className="p-2 rounded hover:bg-purple-600 transition-colors text-purple-400 hover:text-white"
                      title="Xem sản phẩm"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Viewing products for category ID:', item.id);
                        if (onViewProducts) {
                          onViewProducts(item.id);
                        }
                      }}
                    >
                      <HiOutlineCollection size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DanhMucTable;

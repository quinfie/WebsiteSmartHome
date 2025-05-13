import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineCurrencyDollar, HiOutlineCube, HiOutlineHashtag, HiOutlineShieldCheck, HiOutlineCalendar, HiOutlineCog, HiOutlinePhotograph } from "react-icons/hi";
import { useSanPham } from "../contexts/SanPhamContext";
import { useState, useEffect } from "react";
import React from "react";

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

  // Hàm chuyển đổi đường dẫn ảnh từ DB sang đường dẫn thực tế
  const getImagePath = (imgPath: string | null | undefined) => {
    if (!imgPath) return '/placeholder-image.png';

    try {
      // Kiểm tra xem đường dẫn đã có http hoặc https chưa
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        return imgPath;
      }

      // Nếu đường dẫn bắt đầu bằng 'public/'
      if (imgPath.startsWith('public/')) {
        // Đường dẫn tương đối trong src/assets
        return `/src/assets/${imgPath}`;
      }

      // Nếu đường dẫn bắt đầu bằng '/'
      if (imgPath.startsWith('/')) {
        return imgPath;
      }

      return `/src/assets/${imgPath}`;
    } catch (error) {
      console.error("Lỗi khi xử lý đường dẫn ảnh:", error);
      return '/placeholder-image.png';
    }
  };

  return (
    <div className="w-full mt-10 px-0">
      {/* Table full width */}
      <div className="overflow-x-auto w-full px-0">
        <table className="w-full mt-2 table-auto text-left rounded-lg overflow-hidden shadow-md bg-[#181A20]">
          <thead>
            <tr className="bg-[#23272F] text-white">
              <th className="py-3 px-4 font-bold text-left" style={{ width: '50%' }}>
                <span className="inline-flex items-center gap-1">
                  <HiOutlineCube className="text-blue-400 text-lg" /> Sản phẩm
                </span>
              </th>
              <th className="py-3 px-4 font-bold text-left">
                <span className="inline-flex items-center gap-1">
                  <HiOutlineCurrencyDollar className="text-green-400 text-lg" /> Giá
                </span>
              </th>
              <th className="py-3 px-4 font-bold text-left">
                <span className="inline-flex items-center gap-1">
                  <HiOutlineHashtag className="text-yellow-400 text-lg" /> Số lượng tồn
                </span>
              </th>
              <th className="py-3 px-4 font-bold text-left">
                <span className="inline-flex items-center gap-1">
                  <HiOutlineCog className="text-cyan-400 text-lg" /> Thao tác
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-white">Đang tải dữ liệu...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-white">Không có sản phẩm nào.</td>
              </tr>
            ) : (
              products.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-[#23272F] transition-colors group">
                    <td className="py-3 px-4 text-left text-white font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700 product-image-container">
                          {item.img ? (
                            <img
                              src={getImagePath(item.img)}
                              alt={item.tenSanPham}
                              className="w-full h-full object-contain product-image"
                              loading="lazy"
                              onError={(e) => {
                                console.error(`Failed to load image: ${item.img}`);
                                (e.target as HTMLImageElement).onerror = null;
                                (e.target as HTMLImageElement).src = '/placeholder-image.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                              <HiOutlinePhotograph size={24} />
                            </div>
                          )}
                        </div>
                        <span>{item.tenSanPham}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-left font-mono text-green-400 font-bold">
                      <span className="inline-flex items-center gap-1">
                        <HiOutlineCurrencyDollar className="text-green-400 text-lg" />
                        {item.donGia.toLocaleString()} đ
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left">
                      <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold shadow ${item.soLuongTon > 0 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {item.soLuongTon > 0 ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                            {item.soLuongTon} Còn hàng
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                            Hết hàng
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex justify-center gap-x-2">
                        <Link to={`/dashboard/products/${item.id}/edit`} className="p-2 rounded hover:bg-blue-600 transition-colors text-blue-400 hover:text-white btn-hover-effect" title="Chỉnh sửa">
                          <HiOutlinePencil size={18} />
                        </Link>
                        <button
                          className={`p-2 rounded hover:bg-cyan-600 transition-colors text-cyan-400 hover:text-white btn-hover-effect ${openDetailId === item.id ? 'ring-2 ring-cyan-400' : ''}`}
                          title={openDetailId === item.id ? "Đóng chi tiết" : "Xem chi tiết"}
                          onClick={() => handleToggleDetail(item.id)}
                        >
                          <HiOutlineEye size={18} className={openDetailId === item.id ? 'text-cyan-400' : ''} />
                        </button>
                        <button
                          className="p-2 rounded hover:bg-red-600 transition-colors text-red-400 hover:text-white btn-hover-effect"
                          title="Xóa"
                          onClick={() => handleDelete(item.id)}
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {openDetailId === item.id && (
                    <tr key={`${item.id}-details`}>
                      <td colSpan={6} className="bg-gradient-to-r from-[#20232a] to-[#23272F] px-10 py-7 text-base rounded-b-xl shadow-lg border-b-2 border-blue-900 product-detail-animation">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1">
                            <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 shadow-lg zoom-on-hover">
                              {item.img ? (
                                <img
                                  src={getImagePath(item.img)}
                                  alt={item.tenSanPham}
                                  className="w-full h-full object-contain product-image"
                                  loading="lazy"
                                  onError={(e) => {
                                    console.error(`Failed to load detail image: ${item.img}`);
                                    (e.target as HTMLImageElement).onerror = null;
                                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                  <HiOutlinePhotograph size={48} />
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mt-2 text-center">
                              {item.img ? item.img : 'Không có hình ảnh'}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-white">
                              <div className="flex items-center gap-2">
                                <HiOutlineCube className="text-blue-400" />
                                <span className="uppercase text-xs text-blue-300 font-bold tracking-wider">Tên sản phẩm:</span>
                                <span className="ml-2 text-lg font-semibold text-white">{item.tenSanPham}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <HiOutlineCurrencyDollar className="text-green-400" />
                                <span className="uppercase text-xs text-green-300 font-bold tracking-wider">Đơn giá:</span>
                                <span className="ml-2 text-lg font-mono text-green-400">{item.donGia.toLocaleString()} đ</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                                <span className="uppercase text-xs text-green-300 font-bold tracking-wider">Số lượng tồn:</span>
                                <span className="ml-2 text-lg">{item.soLuongTon}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="uppercase text-xs text-cyan-300 font-bold tracking-wider">Bảo hành:</span>
                                <span className="ml-2 text-lg">{item.thoiGianBaoHanh} tháng</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="uppercase text-xs text-yellow-300 font-bold tracking-wider">Ngày sản xuất:</span>
                                <span className="ml-2 text-lg">{new Date(item.ngaySanXuat).toLocaleDateString("vi-VN")}</span>
                              </div>
                              <div className="sm:col-span-2 pt-2 border-t border-[#2d3340] mt-2">
                                <span className="uppercase text-xs text-purple-300 font-bold tracking-wider">Mô tả:</span>
                                <span className="ml-2 text-gray-300">{item.moTa}</span>
                              </div>
                            </div>
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
    </div>
  );
};

export default ProductTable;

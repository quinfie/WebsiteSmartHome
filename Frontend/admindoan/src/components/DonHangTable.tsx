import { useEffect, useState } from "react";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiOutlineUser, HiOutlineCurrencyDollar, HiOutlineCheckCircle, HiOutlineCalendar, HiOutlineTag, HiOutlineCog, HiOutlineClock } from "react-icons/hi";
import { useDonHang } from "../contexts/DonHangContext";
import { DonHangDto, ChiTietDonHangDto } from "../types/donhang";
import { LichBaoTriDto } from "../types/lichBaoTri";
import { getLichBaoTriByDonHangId } from "../api/lichbaotri";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Extended type with details
interface OrderDetails extends DonHangDto {
  chiTietSanPham?: any[];
}

type DonHangTableProps = {
  data: DonHangDto[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onViewLichBaoTri?: (id: string) => void;
  openDetailId?: string | null;
};

const DonHangTable = ({ data, loading, onEdit, onDelete, onView, onViewLichBaoTri, openDetailId }: DonHangTableProps) => {
  const [detailsMap, setDetailsMap] = useState<{ [id: string]: OrderDetails }>({});
  const [lichBaoTriMap, setLichBaoTriMap] = useState<{ [id: string]: LichBaoTriDto[] }>({});
  const [loadingLichBaoTri, setLoadingLichBaoTri] = useState<{ [id: string]: boolean }>({});
  const { getById } = useDonHang();

  useEffect(() => {
    // Load details for the open order
    if (openDetailId && !detailsMap[openDetailId]) {
      fetchOrderDetails(openDetailId);
    }
  }, [openDetailId]);

  const fetchOrderDetails = async (id: string) => {
    if (loadingLichBaoTri[id]) return;

    setLoadingLichBaoTri(prev => ({ ...prev, [id]: true }));

    try {
      // Fetch order details
      const detail = await getById(id);
      setDetailsMap(prev => ({
        ...prev,
        [id]: {
          ...detail,
          chiTietSanPham: detail.chiTietDonHangs || []
        }
      }));

      // Fetch maintenance schedules
      try {
        const lichBaoTriList = await getLichBaoTriByDonHangId(id);
        setLichBaoTriMap(prev => ({
          ...prev,
          [id]: lichBaoTriList || []
        }));
      } catch (lichError) {
        console.error("Lỗi khi lấy lịch bảo trì:", lichError);
        setLichBaoTriMap(prev => ({ ...prev, [id]: [] }));
      }
    } catch (e) {
      console.error("Error fetching details:", e);
    } finally {
      setLoadingLichBaoTri(prev => ({ ...prev, [id]: false }));
    }
  };

  // Nhóm lịch bảo trì theo mã chi tiết đơn hàng
  const getLichBaoTriByChiTietId = (donHangId: string, chiTietId: number): LichBaoTriDto[] => {
    if (!lichBaoTriMap[donHangId]) return [];
    return lichBaoTriMap[donHangId].filter(item => item.maChiTietDonHang === chiTietId) || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Đang giao':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Đã xác nhận':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Đã thông báo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Chưa thông báo':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getLoaiBaoTriColor = (loai: string) => {
    switch (loai) {
      case 'Bảo hành':
        return 'text-blue-500 dark:text-blue-400';
      case 'Bảo trì':
        return 'text-purple-500 dark:text-purple-400';
      case 'Sữa chữa':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="overflow-x-auto w-full">
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null; // Empty state is handled in the parent component
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto text-left">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th className="py-3.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <HiOutlineUser className="text-blue-500" /> Người đặt
              </div>
            </th>
            <th className="py-3.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <HiOutlineCurrencyDollar className="text-green-500" /> Tổng tiền
              </div>
            </th>
            <th className="py-3.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="text-purple-500" /> Trạng thái
              </div>
            </th>
            <th className="py-3.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <HiOutlineCalendar className="text-orange-500" /> Ngày đặt
              </div>
            </th>
            <th className="py-3.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <HiOutlineCog className="text-indigo-500" /> Thao tác
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-9 w-9 flex-shrink-0 mr-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center">
                      <HiOutlineUser size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{row.tenNguoiDung}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">Mã: {row.id.substring(0, 8).toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-medium text-green-600 dark:text-green-400">
                    {row.tongTien.toLocaleString()}₫
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(row.trangThaiDonHang)}`}>
                    {row.trangThaiDonHang}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {new Date(row.ngayDat).toLocaleDateString("vi-VN", {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(row.ngayDat).toLocaleTimeString("vi-VN", {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                      title="Chỉnh sửa"
                      onClick={() => onEdit && onEdit(row.id)}
                    >
                      <HiOutlinePencil size={18} />
                    </button>
                    <button
                      className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                      title="Xóa"
                      onClick={() => onDelete && onDelete(row.id)}
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                    <button
                      className={`p-1.5 rounded-full ${openDetailId === row.id
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                        : "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/40"
                        } transition-colors`}
                      title={openDetailId === row.id ? "Đóng chi tiết" : "Xem chi tiết"}
                      onClick={() => onView && onView(row.id)}
                    >
                      <HiOutlineEye size={18} />
                    </button>
                    <button
                      className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900/40 transition-colors"
                      title="Xem lịch bảo trì"
                      onClick={() => onViewLichBaoTri && onViewLichBaoTri(row.id)}
                    >
                      <HiOutlineClock size={18} />
                    </button>
                  </div>
                </td>
              </tr>

              <AnimatePresence>
                {openDetailId === row.id && (
                  <motion.tr
                    key={`${row.id}-details`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td colSpan={5} className="py-0">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 shadow-inner border-t border-b border-blue-100 dark:border-blue-900"
                      >
                        {loadingLichBaoTri[row.id] ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải chi tiết...</span>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-500 dark:text-blue-400 font-semibold mb-1">
                                  <HiOutlineUser /> Người đặt
                                </div>
                                <div className="text-gray-900 dark:text-white font-medium">{row.tenNguoiDung}</div>
                              </div>

                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-green-500 dark:text-green-400 font-semibold mb-1">
                                  <HiOutlineCurrencyDollar /> Tổng tiền
                                </div>
                                <div className="text-green-600 dark:text-green-400 font-medium">{row.tongTien.toLocaleString()}₫</div>
                              </div>

                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-500 dark:text-orange-400 font-semibold mb-1">
                                  <HiOutlineCheckCircle /> Trạng thái
                                </div>
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.trangThaiDonHang)}`}>
                                  {row.trangThaiDonHang}
                                </span>
                              </div>

                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-purple-500 dark:text-purple-400 font-semibold mb-1">
                                  <HiOutlineCalendar /> Ngày đặt
                                </div>
                                <div className="text-gray-900 dark:text-white">
                                  {new Date(row.ngayDat).toLocaleDateString("vi-VN", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Danh sách sản phẩm đã mua */}
                            {detailsMap[row.id]?.chiTietSanPham && detailsMap[row.id]?.chiTietSanPham.length > 0 && (
                              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center gap-2">
                                    <HiOutlineCog className="text-indigo-500" /> Danh sách sản phẩm đã mua
                                  </div>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900/30">
                                      <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tên sản phẩm</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số lượng</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đơn giá</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thành tiền</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                      {detailsMap[row.id]?.chiTietSanPham?.map((sp: any) => (
                                        <React.Fragment key={sp.id}>
                                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{sp.tenSanPham}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{sp.soLuong}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{sp.donGia.toLocaleString()}₫</td>
                                            <td className="py-3 px-4 text-sm font-medium text-green-600 dark:text-green-400">{(sp.soLuong * sp.donGia).toLocaleString()}₫</td>
                                          </tr>

                                          {/* Lịch bảo trì */}
                                          {lichBaoTriMap[row.id] && getLichBaoTriByChiTietId(row.id, sp.id).length > 0 && (
                                            <tr>
                                              <td colSpan={4} className="p-0">
                                                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 border-t border-b border-orange-100 dark:border-orange-900/50">
                                                  <div className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
                                                    <HiOutlineClock /> Lịch bảo trì cho sản phẩm này
                                                  </div>
                                                  <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-orange-200 dark:divide-orange-900/30 rounded-lg overflow-hidden border border-orange-200 dark:border-orange-900/30">
                                                      <thead className="bg-orange-100 dark:bg-orange-900/40">
                                                        <tr>
                                                          <th className="py-2 px-3 text-left text-xs font-medium text-orange-800 dark:text-orange-300 uppercase tracking-wider">Ngày bảo trì</th>
                                                          <th className="py-2 px-3 text-left text-xs font-medium text-orange-800 dark:text-orange-300 uppercase tracking-wider">Loại bảo trì</th>
                                                          <th className="py-2 px-3 text-left text-xs font-medium text-orange-800 dark:text-orange-300 uppercase tracking-wider">Trạng thái</th>
                                                          <th className="py-2 px-3 text-left text-xs font-medium text-orange-800 dark:text-orange-300 uppercase tracking-wider">Nguồn phát sinh</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-orange-100 dark:divide-orange-900/20">
                                                        {getLichBaoTriByChiTietId(row.id, sp.id).map((lich: LichBaoTriDto) => (
                                                          <tr key={lich.id} className="hover:bg-orange-50 dark:hover:bg-orange-900/10">
                                                            <td className="py-2 px-3 text-xs text-gray-900 dark:text-white">
                                                              {new Date(lich.ngayBaoTri).toLocaleDateString("vi-VN", {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                              })}
                                                            </td>
                                                            <td className="py-2 px-3 text-xs">
                                                              <span className={`${getLoaiBaoTriColor(lich.loaiBaoTri)} font-medium`}>
                                                                {lich.loaiBaoTri}
                                                              </span>
                                                            </td>
                                                            <td className="py-2 px-3 text-xs">
                                                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lich.trangThai)}`}>
                                                                {lich.trangThai}
                                                              </span>
                                                            </td>
                                                            <td className="py-2 px-3 text-xs text-gray-900 dark:text-white">
                                                              {lich.nguonPhatSinh}
                                                            </td>
                                                          </tr>
                                                        ))}
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </React.Fragment>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonHangTable;

import { useEffect, useState } from "react";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDonHang } from "@/contexts/DonHangContext";
import { DonHangDto } from "@/types/donhang";
import { lichBaoTriService} from "@/api/lichbaotri";
import { CreateLichBaoTriDto } from "@/types/lichBaoTri";

const OrderTable = () => {
  const { getAll, remove: deleteDonHang } = useDonHang();
  const [orders, setOrders] = useState<DonHangDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [lichBaoTri, setLichBaoTri] = useState<Record<string, CreateLichBaoTriDto[]>>({});

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAll();
    setOrders(data);
    setLoading(false);
  };

  const fetchLichBaoTri = async (donHangId: string) => {
    try {
      const res = await lichBaoTriService.getLichBaoTriByDonHangId(Number(donHangId));
      setLichBaoTri(prev => ({ ...prev, [donHangId]: res.data }));
    } catch (error) {
      console.error("Lỗi khi lấy lịch bảo trì:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
      try {
        await deleteDonHang(id);
        fetchOrders();
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
      }
    }
  };

  const handleToggleDetail = (id: string) => {
    if (openDetailId === id) {
      setOpenDetailId(null);
    } else {
      setOpenDetailId(id);
      if (!lichBaoTri[id]) {
        fetchLichBaoTri(id);
      }
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="mt-6 w-full table-auto text-left">
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th className="py-2 px-4 font-semibold">Người đặt</th>
            <th className="py-2 px-4 font-semibold">Tổng tiền</th>
            <th className="py-2 px-4 font-semibold">Trạng thái</th>
            <th className="py-2 px-4 font-semibold">Ngày đặt</th>
            <th className="py-2 px-4 font-semibold">Khuyến mãi</th>
            <th className="py-2 px-4 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-6">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : (
            orders.flatMap((order) => [
              <tr key={order.id}>
                <td className="py-4 px-4">{order.tenNguoiDung}</td>
                <td className="py-4 px-4 font-semibold text-green-600">
                  {order.tongTien.toLocaleString()}₫
                </td>
                <td className="py-4 px-4">{order.trangThaiDonHang}</td>
                <td className="py-4 px-4">
                  {new Date(order.ngayDat).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-4 px-4">{order.tenKhuyenMai || "—"}</td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-x-2">
                    <Link
                      to={`/dashboard/orders/edit/${order.id}`}
                      className="btn-icon"
                      title="Chỉnh sửa"
                    >
                      <HiOutlinePencil />
                    </Link>
                    <button
                      className="btn-icon"
                      title="Xem chi tiết"
                      onClick={() => handleToggleDetail(order.id)}
                    >
                      <HiOutlineEye />
                    </button>
                    <button
                      className="btn-icon"
                      title="Xóa"
                      onClick={() => handleDelete(order.id)}
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>,
              openDetailId === order.id && (
                <tr key={`detail-${order.id}`}>
                  <td colSpan={6} className="bg-gray-50 dark:bg-gray-900 px-4 py-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-black dark:text-whiteSecondary">
                      <p><strong>Mã đơn hàng:</strong> {order.id}</p>
                      <p><strong>Người đặt:</strong> {order.tenNguoiDung}</p>
                      <p><strong>Tổng tiền:</strong> {order.tongTien.toLocaleString()}₫</p>
                      <p><strong>Trạng thái:</strong> {order.trangThaiDonHang}</p>
                      <p><strong>Ngày đặt:</strong> {new Date(order.ngayDat).toLocaleDateString("vi-VN")}</p>
                      <p><strong>Khuyến mãi:</strong> {order.tenKhuyenMai || "Không có"}</p>
                    </div>

                    {lichBaoTri[order.id]?.length ? (
                     <div className="mt-2 border-t pt-2">
                   <h4 className="font-semibold mb-2">Lịch bảo trì:</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {lichBaoTri[order.id].map((lich) => (
                      <li key={lich.id}>
                     <strong>{new Date(lich.ngayBaoTri).toLocaleDateString("vi-VN")}:</strong>{" "}
                      {lich.loaiBaoTri} - {lich.trangThai} ({lich.nguonPhatSinh})
                     </li>
                        ))}
                        </ul>
                      </div>
                      ) : (
                        <p className="text-gray-500 italic">Không có lịch bảo trì nào.</p>
                      )}
                  </td>
                </tr>
              ),
            ])
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

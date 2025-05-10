import { useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { PhanCongDichVuDto } from "@/types/phancongdichvu";

const fakeData: PhanCongDichVuDto[] = [
  {
    id: "1",
    maYeuCau: "REQ001",
    maKyThuatVien: "TECH001",
    ngayPhanCong: new Date().toISOString(),
    ngayHoanThanh: new Date().toISOString(),
    trangThaiPhanCong: "Đang thực hiện",
    ghiChu: "",
  },
  {
    id: "2",
    maYeuCau: "REQ002",
    maKyThuatVien: "TECH002",
    ngayPhanCong: new Date().toISOString(),
    ngayHoanThanh: new Date().toISOString(),
    trangThaiPhanCong: "Đã hoàn thành",
    ghiChu: "",
  },
];

const PhanCongDichVuTable = () => {
  const navigate = useNavigate();
  const phanCongList = fakeData; // ← Dùng dữ liệu mock tạm thời

  return (
    <div className="overflow-x-auto rounded border mt-6">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Mã yêu cầu</th>
            <th className="p-3">Kỹ thuật viên</th>
            <th className="p-3">Ngày phân công</th>
            <th className="p-3">Ngày hoàn thành</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {phanCongList.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{item.maYeuCau}</td>
              <td className="p-3">{item.maKyThuatVien}</td>
              <td className="p-3">{new Date(item.ngayPhanCong).toLocaleDateString()}</td>
              <td className="p-3">
                {item.ngayHoanThanh
                  ? new Date(item.ngayHoanThanh).toLocaleDateString()
                  : "—"}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${item.trangThaiPhanCong === "Đã hoàn thành"
                      ? "bg-green-500"
                      : item.trangThaiPhanCong === "Đang thực hiện"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                >
                  {item.trangThaiPhanCong}
                </span>
              </td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => navigate(`/phan-cong/view/${item.id}`)}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="Xem"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/phan-cong/edit/${item.id}`)}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="Chỉnh sửa"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {phanCongList.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                Không có phân công nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PhanCongDichVuTable;

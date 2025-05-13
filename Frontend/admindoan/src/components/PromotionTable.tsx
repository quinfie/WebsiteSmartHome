// src/components/PromotionTable.tsx
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineGift, HiOutlineTag } from "react-icons/hi";

interface Promotion {
  id: number;
  tenKhuyenMai: string;
  mucGiam: number;
  ngayBatDau: string;
  ngayKetThuc: string;
}

const mockPromotions: Promotion[] = [
  { id: 1, tenKhuyenMai: "Giảm giá Tết", mucGiam: 20, ngayBatDau: "2025-02-01", ngayKetThuc: "2025-02-10" },
  { id: 2, tenKhuyenMai: "Hè rực rỡ", mucGiam: 15, ngayBatDau: "2025-06-01", ngayKetThuc: "2025-06-30" },
];

const PromotionTable: React.FC<{ data?: Promotion[] }> = ({ data = mockPromotions }) => (
  <div className="overflow-x-auto w-full mt-6 rounded-xl shadow-lg bg-[#181A20] dark:bg-[#181A20]">
    <table className="w-full table-auto text-center rounded-xl overflow-hidden">
      <thead>
        <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white text-base font-bold">
          <th className="py-3 px-4 align-middle">#</th>
          <th className="py-3 px-4 align-middle"><span className="inline-flex items-center gap-2 justify-center"><HiOutlineGift className="inline text-xl" />Tên khuyến mãi</span></th>
          <th className="py-3 px-4 align-middle"><span className="inline-flex items-center gap-2 justify-center"><HiOutlineTag className="inline text-xl" />Giảm (%)</span></th>
          <th className="py-3 px-4 align-middle">Bắt đầu</th>
          <th className="py-3 px-4 align-middle">Kết thúc</th>
          <th className="py-3 px-4 align-middle">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {data.map((km, i) => (
          <tr key={km.id} className="hover:bg-blue-950 transition-colors group rounded-xl">
            <td className="py-3 px-4 text-center text-white align-middle font-medium">{i + 1}</td>
            <td className="py-3 px-4 text-center text-white align-middle font-semibold">
              <span className="inline-flex items-center gap-2 justify-center">
                <HiOutlineGift className="text-blue-400 text-lg" />
                <span>{km.tenKhuyenMai}</span>
              </span>
            </td>
            <td className="py-3 px-4 text-center align-middle font-semibold" style={{ color: '#4ade80' }}>
              <span className="inline-flex items-center gap-1 justify-center">
                <HiOutlineTag className="text-green-400 text-lg" />
                <span>{km.mucGiam}%</span>
              </span>
            </td>
            <td className="py-3 px-4 text-center text-white align-middle font-medium">{km.ngayBatDau}</td>
            <td className="py-3 px-4 text-center text-white align-middle font-medium">{km.ngayKetThuc}</td>
            <td className="py-3 px-4 text-center align-middle">
              <div className="flex justify-center gap-2">
                <Link to={`/promotions/edit/${km.id}`} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors shadow" title="Chỉnh sửa">
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors shadow" title="Xóa">
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PromotionTable;

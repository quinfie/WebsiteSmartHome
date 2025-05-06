// src/components/PromotionTable.tsx
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

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
  <div className="px-4 sm:px-6 lg:px-8 mt-6 overflow-x-auto">
    <table className="w-full border dark:border-gray-700">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-700 text-left">
          <th className="p-2 border dark:border-gray-700">#</th>
          <th className="p-2 border dark:border-gray-700">Tên khuyến mãi</th>
          <th className="p-2 border dark:border-gray-700">Giảm (%)</th>
          <th className="p-2 border dark:border-gray-700">Bắt đầu</th>
          <th className="p-2 border dark:border-gray-700">Kết thúc</th>
          <th className="p-2 border dark:border-gray-700">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((km, i) => (
          <tr key={km.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-2 border dark:border-gray-700">{i + 1}</td>
            <td className="p-2 border dark:border-gray-700">{km.tenKhuyenMai}</td>
            <td className="p-2 border dark:border-gray-700">{km.mucGiam}%</td>
            <td className="p-2 border dark:border-gray-700">{km.ngayBatDau}</td>
            <td className="p-2 border dark:border-gray-700">{km.ngayKetThuc}</td>
            <td className="p-2 border dark:border-gray-700">
              <div className="flex gap-2">
                <Link to={`/promotions/edit/${km.id}`} className="text-blue-600 hover:underline">
                  <HiOutlinePencil />
                </Link>
                <button className="text-red-600 hover:underline">
                  <HiOutlineTrash />
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

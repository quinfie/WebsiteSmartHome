import { useState } from "react";
import { usePhanCongDichVu } from "@/contexts/PhanCongDichVuContext";
import { useNavigate } from "react-router-dom";

const CreatePhanCongDichVu = () => {
  const { create } = usePhanCongDichVu();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    maYeuCau: "",
    maKyThuatVien: "",
    ghiChu: "",
    ngayPhanCong: new Date().toISOString().split("T")[0],
    ngayHoanThanh: "",
    trangThaiPhanCong: "Chưa hoàn thành",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create(form);
    navigate("/phan-cong");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Tạo phân công dịch vụ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Mã yêu cầu</label>
          <input
            type="text"
            name="maYeuCau"
            value={form.maYeuCau}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mã kỹ thuật viên</label>
          <input
            type="text"
            name="maKyThuatVien"
            value={form.maKyThuatVien}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Ghi chú (tuỳ chọn)</label>
          <textarea
            name="ghiChu"
            value={form.ghiChu}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Ngày phân công</label>
          <input
            type="date"
            name="ngayPhanCong"
            value={form.ngayPhanCong}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Ngày hoàn thành (nếu có)</label>
          <input
            type="date"
            name="ngayHoanThanh"
            value={form.ngayHoanThanh}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Trạng thái phân công</label>
          <select
            name="trangThaiPhanCong"
            value={form.trangThaiPhanCong}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option>Chưa hoàn thành</option>
            <option>Đã hoàn thành</option>
            <option>Đang xử lý</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Tạo phân công
        </button>
      </form>
    </div>
  );
};

export default CreatePhanCongDichVu;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNhaCungCap } from "../contexts/NhaCungCapContext";
import { NhaCungCapCreateDto } from "../types/nhacungcap";

const CreateNhaCungCap = () => {
  const [form, setForm] = useState<NhaCungCapCreateDto>({
    tenNhaCungCap: "",
    sdt: "",
    email: "",
    diaChi: "",
  });

  const [loading, setLoading] = useState(false);
  const { createSupplier } = useNhaCungCap();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tenNhaCungCap || !form.sdt) {
      alert("Vui lòng nhập tên và số điện thoại!");
      return;
    }
    setLoading(true);
    await createSupplier(form);
    setLoading(false);
    navigate("/dashboard/nha-cung-cap");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-6">Tạo nhà cung cấp</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà cung cấp</label>
          <input
            name="tenNhaCungCap"
            value={form.tenNhaCungCap}
            onChange={handleChange}
            placeholder="Tên nhà cung cấp"
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input
            name="sdt"
            value={form.sdt}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <input
            name="diaChi"
            value={form.diaChi}
            onChange={handleChange}
            placeholder="Địa chỉ"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4 disabled:opacity-50"
        >
          {loading ? "Đang tạo..." : "Tạo nhà cung cấp"}
        </button>
      </form>
    </div>
  );
};

export default CreateNhaCungCap;

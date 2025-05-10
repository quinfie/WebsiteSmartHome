import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNhaCungCap } from "../contexts/NhaCungCapContext";
import { NhaCungCapCreateDto } from "../types/nhacungcap";

const EditNhaCungCap = () => {
  const { id } = useParams();
  const { getSupplierById, updateSupplier } = useNhaCungCap();
  const [form, setForm] = useState<NhaCungCapCreateDto>({
    tenNhaCungCap: "",
    sdt: "",
    email: "",
    diaChi: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getSupplierById(id)
        .then((data) => {
          setForm({
            tenNhaCungCap: data.tenNhaCungCap,
            sdt: data.sdt,
            email: data.email,
            diaChi: data.diaChi,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!form.tenNhaCungCap || !form.sdt) {
      alert("Vui lòng nhập tên và số điện thoại!");
      return;
    }

    setSubmitting(true);
    await updateSupplier(id, form);
    setSubmitting(false);
    navigate("/dashboard/nha-cung-cap");
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa nhà cung cấp</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà cung cấp</label>
          <input
            name="tenNhaCungCap"
            value={form.tenNhaCungCap}
            onChange={handleChange}
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
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mt-4 disabled:opacity-50"
        >
          {submitting ? "Đang cập nhật..." : "Cập nhật nhà cung cấp"}
        </button>
      </form>
    </div>
  );
};

export default EditNhaCungCap;

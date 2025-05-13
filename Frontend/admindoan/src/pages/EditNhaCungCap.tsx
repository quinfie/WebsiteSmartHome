import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useNhaCungCap } from "../contexts/NhaCungCapContext";
import { NhaCungCapCreateDto } from "../types/nhacungcap";
import { Sidebar, InputWithLabel, SimpleInput } from "../components";
import {
  HiOutlineChevronRight,
  HiOutlineOfficeBuilding,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
} from "react-icons/hi";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
        .catch((err) => {
          console.error("Lỗi khi tải dữ liệu:", err);
          setError("Không thể tải thông tin nhà cung cấp. Vui lòng thử lại sau!");
        })
        .finally(() => setLoading(false));
    }
  }, [id, getSupplierById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Simple validation
    if (!form.tenNhaCungCap.trim()) {
      setError("Vui lòng nhập tên nhà cung cấp!");
      return;
    }

    if (!form.sdt.trim()) {
      setError("Vui lòng nhập số điện thoại!");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await updateSupplier(id, form);
      setSuccess("Cập nhật nhà cung cấp thành công!");
      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/dashboard/suppliers");
      }, 1500);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setError("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
              Chỉnh sửa nhà cung cấp
            </h2>
            <p className="dark:text-whiteSecondary text-blackPrimary flex items-center text-base">
              <Link to="/dashboard" className="hover:underline">Bảng điều khiển</Link>
              <HiOutlineChevronRight className="mx-1" />
              <Link to="/dashboard/suppliers" className="hover:underline">Nhà cung cấp</Link>
              <HiOutlineChevronRight className="mx-1" />
              <span>Chỉnh sửa</span>
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Thành công! </strong>
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="dark:text-whiteSecondary text-blackPrimary">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputWithLabel label="Tên nhà cung cấp">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineOfficeBuilding className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <SimpleInput
                      name="tenNhaCungCap"
                      value={form.tenNhaCungCap}
                      onChange={handleChange}
                      placeholder="Nhập tên nhà cung cấp..."
                      className="pl-10"
                      required
                    />
                  </div>
                </InputWithLabel>

                <InputWithLabel label="Số điện thoại">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlinePhone className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <SimpleInput
                      name="sdt"
                      value={form.sdt}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại..."
                      className="pl-10"
                      required
                    />
                  </div>
                </InputWithLabel>

                <InputWithLabel label="Email">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineMail className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <SimpleInput
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Nhập email..."
                      type="email"
                      className="pl-10"
                    />
                  </div>
                </InputWithLabel>

                <InputWithLabel label="Địa chỉ">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineLocationMarker className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <SimpleInput
                      name="diaChi"
                      value={form.diaChi}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ..."
                      className="pl-10"
                    />
                  </div>
                </InputWithLabel>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <Link
                  to="/dashboard/suppliers"
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang cập nhật...
                    </div>
                  ) : "Cập nhật nhà cung cấp"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditNhaCungCap;

import { Sidebar } from "../components";
import { HiOutlineChevronRight, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useState } from "react";
import { useDanhMuc } from "../contexts/DanhMucContexts";
import { useNavigate } from "react-router-dom";

const CreateDanhMuc = () => {
  const { create: createDanhMuc, fetchDanhMucs } = useDanhMuc();
  const navigate = useNavigate();

  const [tenDanhMuc, setTenDanhMuc] = useState("");
  const [moTa, setMoTa] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tenDanhMuc.trim()) {
      setMessage("Vui lòng nhập tên danh mục");
      setMessageType("error");
      setShowMessage(true);
      return;
    }

    setLoading(true);
    setShowMessage(false);

    try {
      // Create category
      await createDanhMuc({
        tenDanhMuc: tenDanhMuc.trim(),
        moTa: moTa.trim(),
      });

      setMessage("Tạo danh mục thành công");
      setMessageType("success");
      setShowMessage(true);

      // Refresh categories list
      fetchDanhMucs();

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard/categories");
      }, 1500);

    } catch (error) {
      console.error("Error creating category:", error);
      setMessage("Lỗi khi tạo danh mục");
      setMessageType("error");
      setShowMessage(true);
    } finally {
      setLoading(false);
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
              Thêm danh mục mới
            </h2>
            <p className="dark:text-whiteSecondary text-blackPrimary flex items-center text-base">
              <span>Bảng điều khiển</span>
              <HiOutlineChevronRight className="mx-1" />
              <span>Danh mục</span>
              <HiOutlineChevronRight className="mx-1" />
              <span>Thêm mới</span>
            </p>
          </div>
        </div>

        {/* Status message */}
        {showMessage && (
          <div
            className={`p-4 mb-6 rounded-md ${messageType === "success" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" :
              "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              } flex items-center`}
          >
            {messageType === "success" ? (
              <HiCheckCircle className="mr-2 text-green-500 text-xl" />
            ) : (
              <HiXCircle className="mr-2 text-red-500 text-xl" />
            )}
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-[#23272F] rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-white mb-2">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tenDanhMuc}
                onChange={(e) => setTenDanhMuc(e.target.value)}
                required
                placeholder="Nhập tên danh mục"
                className="w-full px-4 py-3 bg-[#181A20] border border-gray-700 text-white focus:outline-none focus:border-blue-500 rounded-md"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-white mb-2">
                Mô tả
              </label>
              <textarea
                value={moTa}
                onChange={(e) => setMoTa(e.target.value)}
                rows={5}
                placeholder="Nhập mô tả cho danh mục"
                className="w-full px-4 py-3 bg-[#181A20] border border-gray-700 text-white focus:outline-none focus:border-blue-500 rounded-md resize-none"
              />
            </div>
          </form>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Đang xử lý..." : "Lưu danh mục"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/categories")}
            className="px-6 py-3 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 transition-all"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDanhMuc;

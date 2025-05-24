import { Sidebar } from "../components";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDanhMuc } from "../contexts/DanhMucContexts";

const EditDanhMuc = () => {
  const { id } = useParams();
  const { getById: getDanhMucById, update: updateDanhMuc } = useDanhMuc();

  const [tenDanhMuc, setTenDanhMuc] = useState("");
  const [moTa, setMoTa] = useState(""); // Thêm nếu cần mô tả

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getDanhMucById(id.toString());
        if (data) {
          setTenDanhMuc(data.tenDanhMuc);
          setMoTa(data.moTa || ""); // Nếu có moTa từ server
        }
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("tenDanhMuc", tenDanhMuc);
    formData.append("moTa", moTa);

    await updateDanhMuc(formData); // Giả định API nhận FormData
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
              Sửa danh mục
            </h2>
            <p className="dark:text-whiteSecondary text-blackPrimary flex items-center text-base">
              <span>Bảng điều khiển</span>
              <HiOutlineChevronRight className="mx-1" />
              <span>Danh mục</span>
              <HiOutlineChevronRight className="mx-1" />
              <span>Sửa</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">
          {/* Left */}
          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium dark:text-whiteSecondary text-blackPrimary mb-2">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tenDanhMuc}
                onChange={(e) => setTenDanhMuc(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-600 dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-base font-medium dark:text-whiteSecondary text-blackPrimary mb-2">
                Mô tả
              </label>
              <textarea
                value={moTa}
                onChange={(e) => setMoTa(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-600 dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="lg:col-span-1 mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white text-base font-medium hover:bg-blue-500 transition-all"
            >
              Cập nhật danh mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDanhMuc;

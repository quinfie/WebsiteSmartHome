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
  const [hinhAnh, setHinhAnh] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getDanhMucById(id.toString());
        if (data) {
          setTenDanhMuc(data.tenDanhMuc);
          setMoTa(data.moTa || ""); // Nếu có moTa từ server
          setPreviewImage(data.hinhAnh??null);
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
    formData.append("moTa", moTa); // Nếu có
    if (hinhAnh) {
      formData.append("hinhAnh", hinhAnh);
    }

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
        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
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

          {/* Right */}
          <div className="space-y-4">
            <label className="block text-base font-medium dark:text-whiteSecondary text-blackPrimary mb-2">
              Hình ảnh
            </label>
            <div className="w-full aspect-square border border-gray-600 flex items-center justify-center overflow-hidden">
              {hinhAnh ? (
                <img
                  src={URL.createObjectURL(hinhAnh)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Chưa có ảnh</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setHinhAnh(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />
          </div>

          {/* Submit button */}
          <div className="lg:col-span-3 mt-6">
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

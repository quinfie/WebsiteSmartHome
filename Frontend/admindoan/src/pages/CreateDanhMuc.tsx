import { Sidebar } from "../components";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useState } from "react";
import { useDanhMuc } from "../contexts/DanhMucContexts";



const CreateDanhMuc = () => {
  const { create:createDanhMuc } = useDanhMuc();
  const [tenDanhMuc, setTenDanhMuc] = useState("");
  const [moTa, setMoTa] = useState("");
  const [hinhAnh, setHinhAnh] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    await createDanhMuc({
      tenDanhMuc,
      moTa: "", // nếu cần thêm mô tả
    });
  };
  

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
              Thêm danh mục
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section */}
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
          </div>
          <div>
            <label className="block text-base font-medium dark:text-whiteSecondary text-blackPrimary mb-2">
            Mô tả
            </label>
            <textarea
                value={moTa}
                      onChange={(e) => setMoTa(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-600 dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>
          

          {/* Right section - Upload image */}
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
              ) : (
                <span className="text-gray-400">Chưa chọn ảnh</span>
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
        </form>

        {/* Submit Button */}
        <div className="mt-10">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white text-base font-medium hover:bg-blue-500 transition-all"
          >
            Lưu danh mục
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDanhMuc;

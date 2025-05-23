import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSave, HiOutlineGift, HiOutlineChevronRight } from "react-icons/hi";
import { InputWithLabel, Sidebar, SimpleInput } from "../components";
import { createKhuyenMai } from "../api/khuyenmai";
import { toast } from "react-hot-toast";

const CreateKhuyenMai = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tenKhuyenMai: "",
    phanTramGiam: "",
    ngayBatDau: "",
    ngayKetThuc: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate dữ liệu
      if (!formData.tenKhuyenMai || !formData.phanTramGiam || !formData.ngayBatDau || !formData.ngayKetThuc) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      const phanTramGiam = parseFloat(formData.phanTramGiam);
      if (isNaN(phanTramGiam) || phanTramGiam <= 0 || phanTramGiam > 100) {
        toast.error("Phần trăm giảm phải từ 1-100%");
        return;
      }

      const ngayBatDau = new Date(formData.ngayBatDau);
      const ngayKetThuc = new Date(formData.ngayKetThuc);
      const now = new Date();

      if (ngayBatDau >= ngayKetThuc) {
        toast.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
        return;
      }

      if (ngayKetThuc < now) {
        toast.error("Ngày kết thúc không được nhỏ hơn ngày hiện tại");
        return;
      }

      await createKhuyenMai({
        tenKhuyenMai: formData.tenKhuyenMai,
        phanTramGiam: phanTramGiam,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc
      });

      toast.success("Tạo khuyến mãi thành công!");
      setTimeout(() => navigate("/dashboard/promotions"), 1500);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.errorMessage || "Tạo khuyến mãi thất bại";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary min-h-screen">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thêm khuyến mãi mới
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Bảng điều khiển</span>{" "}
                <HiOutlineChevronRight className="text-lg mx-1" />{" "}
                <span>Khuyến mãi</span>{" "}
                <HiOutlineChevronRight className="text-lg mx-1" />{" "}
                <span>Thêm mới</span>
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6 border-b pb-3 dark:border-gray-600">
                <HiOutlineGift className="text-2xl text-blue-500" />
                <h3 className="text-xl font-bold dark:text-white text-gray-800">
                  Thông tin khuyến mãi
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWithLabel label="Tên khuyến mãi">
                  <SimpleInput
                    type="text"
                    name="tenKhuyenMai"
                    placeholder="Nhập tên khuyến mãi..."
                    value={formData.tenKhuyenMai}
                    onChange={handleChange}
                  />
                </InputWithLabel>

                <InputWithLabel label="Phần trăm giảm (%)">
                  <SimpleInput
                    type="number"
                    name="phanTramGiam"
                    placeholder="Nhập phần trăm giảm..."
                    value={formData.phanTramGiam}
                    onChange={handleChange}
                    min="1"
                    max="100"
                  />
                </InputWithLabel>

                <InputWithLabel label="Ngày bắt đầu">
                  <SimpleInput
                    type="date"
                    name="ngayBatDau"
                    value={formData.ngayBatDau}
                    onChange={handleChange}
                  />
                </InputWithLabel>

                <InputWithLabel label="Ngày kết thúc">
                  <SimpleInput
                    type="date"
                    name="ngayKetThuc"
                    value={formData.ngayKetThuc}
                    onChange={handleChange}
                  />
                </InputWithLabel>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/promotions")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <HiOutlineSave />
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateKhuyenMai;

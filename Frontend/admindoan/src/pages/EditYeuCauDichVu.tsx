// src/pages/EditYeuCauDichVu.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sidebar,
  InputWithLabel,
  SimpleInput,
  TextAreaInput,
  WhiteButton,
} from "../components";
import { yeuCauDichVuItems } from "../utils/data";

const EditYeuCauDichVu = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    MaChiTietDonHang: "",
    LoaiDichVu: "",
    TrangThaiYeuCau: "",
    ChiPhiYeuCau: "",
    NgayHen: "",
    MoTa: "",
  });

  useEffect(() => {
    const found = yeuCauDichVuItems.find(item => item.Id === id);
    if (found) {
      setForm({
        MaChiTietDonHang: String(found.MaChiTietDonHang),
        LoaiDichVu: found.LoaiDichVu,
        TrangThaiYeuCau: found.TrangThaiYeuCau,
        ChiPhiYeuCau: String(found.ChiPhiYeuCau),
        NgayHen: found.NgayHen,
        MoTa: found.MoTa || "",
      });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cập nhật yêu cầu dịch vụ:", id, form);
    // TODO: gọi API PUT cập nhật dữ liệu
    setTimeout(() => {
      window.location.href = "/yeu-cau-dich-vu"; // full reload
    }, 1500);
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <form onSubmit={handleSubmit} className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary mb-6">
          Chỉnh sửa Yêu Cầu Dịch Vụ
        </h2>
        <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
          <InputWithLabel label="Mã Chi Tiết Đơn Hàng">
            <SimpleInput
              name="MaChiTietDonHang"
              value={form.MaChiTietDonHang}
              disabled
            />
          </InputWithLabel>

          <InputWithLabel label="Loại Dịch Vụ">
            <select
              name="LoaiDichVu"
              value={form.LoaiDichVu}
              onChange={handleChange}
              className="w-full h-10 border dark:bg-blackPrimary bg-whiteSecondary p-2"
            >
              <option>Bảo hành</option>
              <option>Sửa chữa</option>
            </select>
          </InputWithLabel>

          <InputWithLabel label="Trạng Thái Yêu Cầu">
            <select
              name="TrangThaiYeuCau"
              value={form.TrangThaiYeuCau}
              onChange={handleChange}
              className="w-full h-10 border dark:bg-blackPrimary bg-whiteSecondary p-2"
            >
              <option>Đang chờ xác nhận</option>
              <option>Đã xác nhận</option>
              <option>Hoàn thành</option>
              <option>Đã hủy</option>
            </select>
          </InputWithLabel>

          <InputWithLabel label="Chi Phí Yêu Cầu">
            <SimpleInput
              type="number"
              name="ChiPhiYeuCau"
              value={form.ChiPhiYeuCau}
              onChange={handleChange}
              min="0"
            />
          </InputWithLabel>

          <InputWithLabel label="Ngày Hẹn">
            <SimpleInput
              type="date"
              name="NgayHen"
              value={form.NgayHen}
              onChange={handleChange}
            />
          </InputWithLabel>

          <InputWithLabel label="Mô Tả (tuỳ chọn)">
            <TextAreaInput
              name="MoTa"
              rows={4}
              value={form.MoTa}
              onChange={handleChange}
            />
          </InputWithLabel>
        </div>

        <div className="mt-8 flex gap-x-2">
          <WhiteButton
            link="/yeu-cau-dich-vu"
            text="Hủy"
            width="32"
            py="2"
            textSize="lg"
          />
          <button
            type="submit"
            className="bg-blackPrimary dark:bg-whiteSecondary text-whiteSecondary dark:text-blackPrimary px-6 py-2 rounded-lg hover:bg-gray-800 duration-200"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditYeuCauDichVu;
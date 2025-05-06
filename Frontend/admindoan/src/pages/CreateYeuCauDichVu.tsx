import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, InputWithLabel, SimpleInput, WhiteButton } from "../components";

const CreateYeuCauDichVu = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    MaChiTietDonHang: "",
    LoaiDichVu: "Bảo hành",
    TrangThaiYeuCau: "Đang chờ xác nhận",
    ChiPhiYeuCau: "0",
    NgayHen: "",
    MoTa: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API POST tạo mới
    console.log("Tạo yêu cầu:", data);
    navigate("/yeu-cau-dich-vu");
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <form onSubmit={handleSubmit} className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary mb-6">
          Thêm Yêu Cầu Dịch Vụ
        </h2>
        <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
          <InputWithLabel label="Mã Chi Tiết Đơn Hàng">
            <SimpleInput
              type="text"
              placeholder="Nhập mã..."
              value={data.MaChiTietDonHang}
              onChange={e => setData({ ...data, MaChiTietDonHang: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Loại Dịch Vụ">
            <select
              className="w-full h-10 border p-2"
              value={data.LoaiDichVu}
              onChange={e => setData({ ...data, LoaiDichVu: e.target.value })}
            >
              <option>Bảo hành</option>
              <option>Sửa chữa</option>
            </select>
          </InputWithLabel>
          <InputWithLabel label="Trạng Thái Yêu Cầu">
            <select
              className="w-full h-10 border p-2"
              value={data.TrangThaiYeuCau}
              onChange={e => setData({ ...data, TrangThaiYeuCau: e.target.value })}
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
              min="0"
              placeholder="0"
              value={data.ChiPhiYeuCau}
              onChange={e => setData({ ...data, ChiPhiYeuCau: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Ngày Hẹn">
            <SimpleInput
              type="date"
              value={data.NgayHen}
              onChange={e => setData({ ...data, NgayHen: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Mô Tả (tuỳ chọn)">
            <textarea
              className="w-full border p-2 h-24"
              value={data.MoTa}
              onChange={e => setData({ ...data, MoTa: e.target.value })}
            />
          </InputWithLabel>
        </div>
        <div className="mt-8 flex gap-3">
          <WhiteButton link="/yeu-cau-dich-vu" text="Hủy" width="32" py="2" textSize="lg" />
          <button type="submit" className="bg-blackPrimary dark:bg-whiteSecondary text-whiteSecondary dark:text-blackPrimary px-6 py-2 rounded-lg">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateYeuCauDichVu;
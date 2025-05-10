import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, InputWithLabel, SimpleInput, WhiteButton } from "../components";

const CreatePhanCongDichVu = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    MaYeuCau: "",
    MaKyThuatVien: "",
    NgayPhanCong: "",
    TrangThaiPhanCong: "Đang chờ xử lý",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API POST /phan-cong-dich-vu với `data`
    console.log("Tạo phân công:", data);
    navigate("/phan-cong-dich-vu");
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <form onSubmit={handleSubmit} className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary mb-6">
          Thêm phân công dịch vụ
        </h2>
        <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
          <InputWithLabel label="Mã Yêu Cầu">
            <SimpleInput
              type="text"
              placeholder="Nhập mã yêu cầu..."
              value={data.MaYeuCau}
              onChange={e => setData({ ...data, MaYeuCau: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Mã Kỹ Thuật Viên">
            <SimpleInput
              type="text"
              placeholder="Nhập mã kỹ thuật viên..."
              value={data.MaKyThuatVien}
              onChange={e => setData({ ...data, MaKyThuatVien: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Ngày Phân Công">
            <SimpleInput
              type="date"
              value={data.NgayPhanCong}
              onChange={e => setData({ ...data, NgayPhanCong: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Trạng Thái">
            <select
              className="w-full h-10 border p-2"
              value={data.TrangThaiPhanCong}
              onChange={e => setData({ ...data, TrangThaiPhanCong: e.target.value })}
            >
              <option>Đang chờ xử lý</option>
              <option>Đã tiếp nhận</option>
              <option>Đang thực hiện</option>
              <option>Hoàn thành</option>
            </select>
          </InputWithLabel>
        </div>
        <div className="mt-8 flex gap-3">
          <WhiteButton text="Hủy" width="32" py="2" textSize="lg" link="/phan-cong-dich-vu" />
          <button
            type="submit"
            className="bg-blackPrimary dark:bg-whiteSecondary text-whiteSecondary dark:text-blackPrimary px-6 py-2 rounded-lg"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePhanCongDichVu;

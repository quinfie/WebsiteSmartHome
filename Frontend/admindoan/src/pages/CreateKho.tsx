import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, InputWithLabel, SimpleInput, WhiteButton } from "../components";
import { useKho } from "../contexts/KhoContext";

const CreateKho = () => {
  const navigate = useNavigate();
  const { createKho } = useKho();
  const [data, setData] = useState({
    tenKho: "",
    diaChi: "",
    soDienThoai: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createKho(data);
      navigate("/kho");
    } catch (error) {
      console.error("Tạo kho thất bại:", error);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <form onSubmit={handleSubmit} className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary mb-6">
          Thêm Kho
        </h2>
        <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
          <InputWithLabel label="Tên Kho">
            <SimpleInput
              type="text"
              placeholder="Nhập tên kho..."
              value={data.tenKho}
              onChange={e => setData({ ...data, tenKho: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Địa Chỉ">
            <SimpleInput
              type="text"
              placeholder="Nhập địa chỉ..."
              value={data.diaChi}
              onChange={e => setData({ ...data, diaChi: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Số Điện Thoại">
            <SimpleInput
              type="text"
              placeholder="Nhập số điện thoại..."
              value={data.soDienThoai}
              onChange={e => setData({ ...data, soDienThoai: e.target.value })}
            />
          </InputWithLabel>
        </div>
        <div className="mt-8 flex gap-3">
          <WhiteButton link="/kho" text="Hủy" width="32" py="2" textSize="lg" />
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

export default CreateKho;

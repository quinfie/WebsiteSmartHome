// src/pages/EditKho.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar, InputWithLabel, SimpleInput, WhiteButton } from "../components";
import { khoItems } from "../utils/data";

const EditKho = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ TenKho: "", DiaChi: "", SoDienThoai: "" });

  useEffect(() => {
    const found = khoItems.find(x => x.Id === id);
    if (found) {
      setData({ TenKho: found.TenKho, DiaChi: found.DiaChi, SoDienThoai: found.SoDienThoai });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cập nhật kho:", id, data);
    navigate("/kho");
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <form onSubmit={handleSubmit} className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary mb-6">
          Chỉnh sửa Kho
        </h2>
        <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
          <InputWithLabel label="Tên Kho">
            <SimpleInput
              type="text"
              value={data.TenKho}
              onChange={e => setData({ ...data, TenKho: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Địa Chỉ">
            <SimpleInput
              type="text"
              value={data.DiaChi}
              onChange={e => setData({ ...data, DiaChi: e.target.value })}
            />
          </InputWithLabel>
          <InputWithLabel label="Số Điện Thoại">
            <SimpleInput
              type="text"
              value={data.SoDienThoai}
              onChange={e => setData({ ...data, SoDienThoai: e.target.value })}
            />
          </InputWithLabel>
        </div>
        <div className="mt-8 flex gap-3">
          <WhiteButton link="/kho" text="Hủy" width="32" py="2" textSize="lg" />
          <button
            type="submit"
            className="bg-blackPrimary dark:bg-whiteSecondary text-whiteSecondary dark:text-blackPrimary px-6 py-2 rounded-lg"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditKho;

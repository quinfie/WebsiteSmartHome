import React from "react";
import { Sidebar, InputWithLabel } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";

const CreateNhaCungCap = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tạo nhà cung cấp mới");
    navigate("/nha-cung-cap");
  };

  return (
    <div className="h-auto border-t border-blackSecondary flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
                Thêm nhà cung cấp mới
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button
                type="button"
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-48 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2"
              >
                <AiOutlineSave className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Lưu nháp
                </span>
              </button>
              <button
                onClick={handleSubmit}
                className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black duration-200 flex items-center justify-center gap-x-2"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  Lưu & Thoát
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
              <div>
                <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary">
                  Thông tin nhà cung cấp
                </h3>

                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Tên nhà cung cấp">
                    <SimpleInput type="text" placeholder="Nhập tên..." />
                  </InputWithLabel>

                  <InputWithLabel label="Số điện thoại">
                    <SimpleInput type="text" placeholder="Nhập số điện thoại..." />
                  </InputWithLabel>

                  <InputWithLabel label="Email">
                    <SimpleInput type="email" placeholder="Nhập email..." />
                  </InputWithLabel>

                  <InputWithLabel label="Địa chỉ">
                    <TextAreaInput placeholder="Nhập địa chỉ..." rows={3} cols={50} />
                  </InputWithLabel>
                </div>
              </div>

              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNhaCungCap;

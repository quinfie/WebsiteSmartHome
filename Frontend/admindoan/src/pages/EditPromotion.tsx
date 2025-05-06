import { AiOutlineSave } from "react-icons/ai";
import { HiOutlineSave } from "react-icons/hi";
import {
  InputWithLabel,
  Sidebar,
  SimpleInput,
  TextAreaInput,
  WhiteButton,
} from "../components";
import { useEffect, useState } from "react";

const EditPromotion = () => {

  const [ inputObject, setInputObject ] = useState({
    promotionName: "Giảm giá mùa hè",
    description: "Giảm giá 20% cho tất cả sản phẩm trong mùa hè",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    discountPercentage: 20,
  });

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Chỉnh sửa khuyến mãi
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-48 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineSave className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Lưu nháp
                </span>
              </button>
              <WhiteButton
                link="/promotions/edit-promotion"
                textSize="lg"
                width="48"
                py="2"
                text="Cập nhật khuyến mãi"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              </WhiteButton>
            </div>
          </div>

          {/* Thông tin khuyến mãi */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* left div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin khuyến mãi
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tên khuyến mãi">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tên khuyến mãi..."
                    value={inputObject.promotionName}
                    onChange={(e) => setInputObject({ ...inputObject, promotionName: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Mô tả khuyến mãi">
                  <TextAreaInput
                    placeholder="Nhập mô tả khuyến mãi..."
                    value={inputObject.description}
                    onChange={(e) => setInputObject({ ...inputObject, description: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Ngày bắt đầu">
                  <SimpleInput
                    type="date"
                    value={inputObject.startDate}
                    onChange={(e) => setInputObject({ ...inputObject, startDate: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Ngày kết thúc">
                  <SimpleInput
                    type="date"
                    value={inputObject.endDate}
                    onChange={(e) => setInputObject({ ...inputObject, endDate: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Phần trăm giảm giá">
                  <SimpleInput
                    type="number"
                    placeholder="Nhập phần trăm giảm giá..."
                    value={inputObject.discountPercentage}
                    onChange={(e) => setInputObject({ ...inputObject, discountPercentage: Number(e.target.value) })}
                  />
                </InputWithLabel>
              </div>
            </div>

            {/* right div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tổng quan khuyến mãi
              </h3>
              <div className="mt-4 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <span className="dark:text-whiteSecondary text-blackPrimary">Tên khuyến mãi</span>
                  <span className="dark:text-whiteSecondary text-blackPrimary">{inputObject.promotionName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-whiteSecondary text-blackPrimary">Phần trăm giảm giá</span>
                  <span className="dark:text-whiteSecondary text-blackPrimary">{inputObject.discountPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-whiteSecondary text-blackPrimary">Ngày bắt đầu</span>
                  <span className="dark:text-whiteSecondary text-blackPrimary">{inputObject.startDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-whiteSecondary text-blackPrimary">Ngày kết thúc</span>
                  <span className="dark:text-whiteSecondary text-blackPrimary">{inputObject.endDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPromotion;

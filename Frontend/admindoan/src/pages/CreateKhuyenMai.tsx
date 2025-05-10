import { AiOutlineSave } from "react-icons/ai";
import { HiOutlineSave } from "react-icons/hi";
import {
  ImageUpload,
  InputWithLabel,
  Sidebar,
  SimpleInput,
  WhiteButton,
  TextAreaInput,
} from "../components";

const CreatePromotion = () => {
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thêm Khuyến Mãi Mới
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-48 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineSave className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Lưu Nháp
                </span>
              </button>
              <WhiteButton
                link="/promotions"
                textSize="lg"
                width="48"
                py="2"
                text="Đăng Khuyến Mãi"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              </WhiteButton>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Chi Tiết Khuyến Mãi */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Chi Tiết Khuyến Mãi
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tên Khuyến Mãi">
                  <SimpleInput type="text" placeholder="Nhập tên khuyến mãi..." />
                </InputWithLabel>

                <InputWithLabel label="Mã Giảm Giá">
                  <SimpleInput type="text" placeholder="Nhập mã giảm giá..." />
                </InputWithLabel>

                <InputWithLabel label="Phần Trăm Giảm Giá">
                  <SimpleInput type="number" placeholder="Nhập phần trăm giảm giá..." />
                </InputWithLabel>

                <InputWithLabel label="Ngày Bắt Đầu">
                  <SimpleInput type="date" />
                </InputWithLabel>

                <InputWithLabel label="Ngày Kết Thúc">
                  <SimpleInput type="date" />
                </InputWithLabel>

                <InputWithLabel label="Điều Kiện">
                  <TextAreaInput placeholder="Nhập điều kiện khuyến mãi..." />
                </InputWithLabel>
              </div>
            </div>

            {/* Tải Lên Hình Ảnh Khuyến Mãi */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tải Hình Ảnh Khuyến Mãi
              </h3>
              <ImageUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePromotion;

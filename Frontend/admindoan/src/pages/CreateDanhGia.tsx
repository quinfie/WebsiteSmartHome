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

const CreateReview = () => {
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thêm Đánh Giá Mới
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
                link="/reviews"
                textSize="lg"
                width="48"
                py="2"
                text="Đăng Đánh Giá"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              </WhiteButton>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Chi Tiết Đánh Giá */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Chi Tiết Đánh Giá
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Sản phẩm cần đánh giá">
                  <SimpleInput type="text" placeholder="Tìm sản phẩm để đánh giá..." />
                </InputWithLabel>

                <InputWithLabel label="Điểm Đánh Giá">
                  <SimpleInput type="number" placeholder="Nhập điểm đánh giá (1-5)..." />
                </InputWithLabel>

                <InputWithLabel label="Nội Dung Đánh Giá">
                  <TextAreaInput placeholder="Nhập nội dung đánh giá..."  />
                </InputWithLabel>
              </div>
            </div>

            {/* Tải Lên Hình Ảnh Đánh Giá */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tải Hình Ảnh Đánh Giá
              </h3>
              <ImageUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateReview;

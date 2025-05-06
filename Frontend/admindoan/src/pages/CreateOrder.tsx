import { AiOutlineSave } from "react-icons/ai";
import { HiOutlineSave } from "react-icons/hi";
import {
  InputWithLabel,
  Sidebar,
  SimpleInput,
  TextAreaInput,
  WhiteButton,
} from "../components";

const CreateOrder = () => {
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thêm đơn hàng mới
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
                link="/orders/add-order"
                textSize="lg"
                width="48"
                py="2"
                text="Công bố đơn hàng"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              </WhiteButton>
            </div>
          </div>

          {/* Thêm đơn hàng */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Bên trái */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin đơn hàng
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tên khách hàng">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tên khách hàng..."
                  />
                </InputWithLabel>

                <InputWithLabel label="Họ khách hàng">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập họ khách hàng..."
                  />
                </InputWithLabel>

                <InputWithLabel label="Tên công ty (tùy chọn)">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tên công ty..."
                  />
                </InputWithLabel>

                <InputWithLabel label="Quốc gia">
                  <SimpleInput type="text" placeholder="Nhập quốc gia..." />
                </InputWithLabel>

                <InputWithLabel label="Địa chỉ và số nhà">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập địa chỉ và số nhà..."
                  />
                </InputWithLabel>

                <InputWithLabel label="Thành phố">
                  <SimpleInput type="text" placeholder="Nhập thành phố..." />
                </InputWithLabel>

               

                <InputWithLabel label="Số điện thoại">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập số điện thoại..."
                  />
                </InputWithLabel>

                <InputWithLabel label="Địa chỉ email">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập địa chỉ email..."
                  />
                </InputWithLabel>

                <InputWithLabel label="Ghi chú đơn hàng">
                  <TextAreaInput placeholder="Nhập ghi chú đơn hàng..." />
                </InputWithLabel>
              </div>
            </div>

            {/* Bên phải */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Sản phẩm trong đơn hàng
              </h3>

              <div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Tìm kiếm sản phẩm">
                    <SimpleInput type="text" placeholder="Tìm kiếm sản phẩm..." />
                  </InputWithLabel>
                  <InputWithLabel label="Số lượng">
                    <SimpleInput
                      type="number"
                      placeholder="Nhập số lượng..."
                    />
                  </InputWithLabel>
                  <WhiteButton
                    link="/orders/add-order"
                    textSize="lg"
                    width="full"
                    py="2"
                    text="Thêm sản phẩm"
                  />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                  Tổng cộng
                </h3>
                <div className="mt-4 flex flex-col gap-5">
                  <div className="flex justify-between items-center">
                    <span className="dark:text-whiteSecondary text-blackPrimary">Tổng sản phẩm</span>
                    <span className="dark:text-whiteSecondary text-blackPrimary">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="dark:text-whiteSecondary text-blackPrimary">Tổng giá trị</span>
                    <span className="dark:text-whiteSecondary text-blackPrimary">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateOrder;

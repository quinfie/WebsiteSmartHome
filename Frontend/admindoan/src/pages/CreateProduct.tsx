import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import { Link } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import SelectInput from "../components/SelectInput";
import { selectList, stockStatusList } from "../utils/data";

const CreateProduct = () => {
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="hover:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thêm sản phẩm mới
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-48 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineSave className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Lưu nháp
                </span>
              </button>
              <Link
                to="/products/add-product"
                className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black duration-200 flex items-center justify-center gap-x-2"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  Xuất bản sản phẩm
                </span>
              </Link>
            </div>
          </div>

          {/* Add Product section here  */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* left div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin cơ bản
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tiêu đề">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tiêu đề sản phẩm..."
                  />
                </InputWithLabel>

                <InputWithLabel label="Mô tả">
                  <TextAreaInput
                    placeholder="Nhập mô tả sản phẩm..."
                    rows={4}
                    cols={50}
                  />
                </InputWithLabel>

                <InputWithLabel label="Danh mục">
                  <SelectInput selectList={selectList} />
                </InputWithLabel>
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Giá cả & Tồn kho
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                  <InputWithLabel label="Giá cơ bản">
                    <SimpleInput
                      type="number"
                      placeholder="Nhập giá cơ bản sản phẩm..."
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Giá sau khi giảm giá">
                    <SimpleInput
                      type="number"
                      placeholder="Nhập giá sau khi giảm giá..."
                    />
                  </InputWithLabel>
                </div>

                <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                  <InputWithLabel label="Tồn kho">
                    <SimpleInput
                      type="number"
                      placeholder="Nhập số lượng tồn kho..."
                    />
                  </InputWithLabel>

                </div>
                <InputWithLabel label="Tình trạng tồn kho">
                  <SelectInput selectList={stockStatusList} />
                </InputWithLabel>
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Vận chuyển
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                  <InputWithLabel label="Cân nặng (kg)">
                    <SimpleInput
                      type="number"
                      placeholder="Nhập cân nặng sản phẩm..."
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Chiều dài (cm)">
                    <SimpleInput
                      type="number"
                      placeholder="Nhập chiều dài sản phẩm..."
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Chiều rộng (cm)">
                    <SimpleInput
                      type="number"
                      placeholder="Nhập chiều rộng sản phẩm..."
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Chiều cao (cm)">
                    <SimpleInput
                      type="number"
                      placeholder="Nhập chiều cao sản phẩm..."
                    />
                  </InputWithLabel>
                </div>
              </div>
           
            </div>

            {/* right div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Hình ảnh sản phẩm
              </h3>

              <ImageUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateProduct;

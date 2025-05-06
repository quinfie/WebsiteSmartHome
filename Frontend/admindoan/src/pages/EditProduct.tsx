import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import { Link } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import SelectInput from "../components/SelectInput";
import { selectList, stockStatusList } from "../utils/data";
import { useState } from "react";

const EditProduct = () => {
  const [inputObject, setInputObject] = useState({
    title: "SimpliSafe Home Security",
    description: "Hệ thống bảo mật thông minh cho gia đình.",
    category: selectList[0].value,
    basePrice: "100",
    discountPrice: "80",
    stock: "50",
    sku: "SK-2323-2323",
    stockStatus: stockStatusList[0].value,
    weight: "500g",
    length: "600cm",
    width: "600cm",
    height: "400cm",
    metaTitle: "SimpliSafe Home Security - Demo Title",
    metaDescription: "SimpliSafe Home Security - Demo Description",
  });

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Chỉnh sửa sản phẩm
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
                className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-blackSecondary duration-200 flex items-center justify-center gap-x-2"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  Cập nhật sản phẩm
                </span>
              </Link>
            </div>
          </div>

          {/* Nội dung chỉnh sửa sản phẩm */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* cột trái */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin cơ bản
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tên sản phẩm">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    value={inputObject.title}
                    onChange={(e) =>
                      setInputObject({ ...inputObject, title: e.target.value })
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Mô tả">
                  <TextAreaInput
                    placeholder="Nhập mô tả sản phẩm..."
                    rows={4}
                    cols={50}
                    value={inputObject.description}
                    onChange={(e) =>
                      setInputObject({
                        ...inputObject,
                        description: e.target.value,
                      })
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Danh mục">
                  <SelectInput
                    selectList={selectList}
                    value={inputObject.category}
                    onChange={(e) =>
                      setInputObject({
                        ...inputObject,
                        category: e.target.value,
                      })
                    }
                  />
                </InputWithLabel>
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Giá & Kho
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-y-5">
                  <InputWithLabel label="Giá gốc">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập giá gốc..."
                      value={inputObject.basePrice}
                      onChange={(e) =>
                        setInputObject({
                          ...inputObject,
                          basePrice: e.target.value,
                        })
                      }
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Giá sau giảm">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập giá sau giảm..."
                      value={inputObject.discountPrice}
                      onChange={(e) =>
                        setInputObject({
                          ...inputObject,
                          discountPrice: e.target.value,
                        })
                      }
                    />
                  </InputWithLabel>
                </div>

                <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-y-5">
                  <InputWithLabel label="Số lượng tồn kho">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập số lượng tồn kho..."
                      value={inputObject.stock}
                      onChange={(e) =>
                        setInputObject({
                          ...inputObject,
                          stock: e.target.value,
                        })
                      }
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Mã SKU">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập mã SKU..."
                      value={inputObject.sku}
                      onChange={(e) =>
                        setInputObject({
                          ...inputObject,
                          sku: e.target.value,
                        })
                      }
                    />
                  </InputWithLabel>
                </div>
                <InputWithLabel label="Tình trạng kho">
                  <SelectInput
                    selectList={stockStatusList}
                    value={inputObject.stockStatus}
                    onChange={(e) =>
                      setInputObject({
                        ...inputObject,
                        stockStatus: e.target.value,
                      })
                    }
                  />
                </InputWithLabel>
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Vận chuyển
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 max-[500px]:grid-cols-1 max-[500px]:gap-y-5">
                  <InputWithLabel label="Khối lượng (kg)">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập khối lượng (kg)..."
                      value={inputObject.weight}
                      onChange={(e) =>
                        setInputObject({
                          ...inputObject,
                          weight: e.target.value,
                        })
                      }
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Chiều dài (cm)">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập chiều dài (cm)..."
                      value={inputObject.length}
                      onChange={(e) =>
                        setInputObject({
                          ...inputObject,
                          length: e.target.value,
                        })
                      }
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Chiều rộng (cm)">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập chiều rộng (cm)..."
                      value={inputObject.width}
                      onChange={(e) =>
                        setInputObject({
                          ...inputObject,
                          width: e.target.value,
                        })
                      }
                    />
                  </InputWithLabel>
                  <InputWithLabel label="Chiều cao (cm)">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập chiều cao (cm)..."
                      value={inputObject.height}
                      onChange={(e) =>
                        setInputObject({
                          ...inputObject,
                          height: e.target.value,
                        })
                      }
                    />
                  </InputWithLabel>
                </div>
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                SEO
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tiêu đề SEO">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tiêu đề SEO..."
                    value={inputObject.metaTitle}
                    onChange={(e) =>
                      setInputObject({
                        ...inputObject,
                        metaTitle: e.target.value,
                      })
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Mô tả SEO">
                  <TextAreaInput
                    placeholder="Nhập mô tả SEO..."
                    rows={4}
                    cols={50}
                    value={inputObject.metaDescription}
                    onChange={(e) =>
                      setInputObject({
                        ...inputObject,
                        metaDescription: e.target.value,
                      })
                    }
                  />
                </InputWithLabel>
              </div>
            </div>

            {/* cột phải */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Hình ảnh sản phẩm
              </h3>

              <ImageUpload />
              <div className="flex justify-center gap-x-2 mt-5 flex-wrap">
                <img
                  src="/src/assets/Arlo_Pro_4.jpg"
                  alt=""
                  className="w-36 h-32"
                />
                <img
                  src="/src/assets/BroadLink_RM4_Pro.jpg"
                  alt=""
                  className="w-36 h-32"
                />
                <img
                  src="/src/assets/Govee_Smart_Humidifier.jpg"
                  alt=""
                  className="w-36 h-32"
                />
                <img
                  src="/src/assets/Nest_Learning_Thermostat.jpg"
                  alt=""
                  className="w-36 h-32"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProduct;

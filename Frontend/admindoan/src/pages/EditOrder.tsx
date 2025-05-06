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
// ...giữ nguyên phần import

const EditOrder = () => {

  const [ inputObject, setInputObject ] = useState({
    customerName: "Brent",
    customerLastName: "Fesi",
    companyName: "NoName Inc.",
    country: "Bồ Đào Nha",
    streetAndHouseNumber: "Brent Fesi Street 123",
    city: "Lisabon",
    zipCode: "22215",
    phoneNumber: "678 123 456",
    emailAddress: "brentfesi@email.com",
    orderNotice: "Vui lòng giao hàng phía sau nhà.",
    searchProducts: "",
    quantity: 0,
  });

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Chỉnh sửa đơn hàng
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
                text="Cập nhật đơn hàng"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              </WhiteButton>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* left div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin đơn hàng
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Họ khách hàng">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập họ khách hàng..."
                    value={inputObject.customerName}
                    onChange={(e) => setInputObject({ ...inputObject, customerName: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Tên khách hàng">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tên khách hàng..."
                    value={inputObject.customerLastName}
                    onChange={(e) => setInputObject({ ...inputObject, customerLastName: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Tên công ty (tuỳ chọn)">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tên công ty..."
                    value={inputObject.companyName}
                    onChange={(e) => setInputObject({ ...inputObject, companyName: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Quốc gia">
                  <SimpleInput type="text" placeholder="Nhập quốc gia..." value={inputObject.country} onChange={(e) => setInputObject({...inputObject, country: e.target.value})} />
                </InputWithLabel>

                <InputWithLabel label="Địa chỉ và số nhà">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập địa chỉ và số nhà..."
                    value={inputObject.streetAndHouseNumber}
                    onChange={(e) => setInputObject({ ...inputObject, streetAndHouseNumber: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Thành phố">
                  <SimpleInput type="text" placeholder="Nhập thành phố..." value={inputObject.city} onChange={(e) => setInputObject({...inputObject, city: e.target.value})} />
                </InputWithLabel>

                <InputWithLabel label="Mã bưu điện">
                  <SimpleInput type="text" placeholder="Nhập mã bưu điện..." value={inputObject.zipCode} onChange={(e) => setInputObject({...inputObject, zipCode: e.target.value})} />
                </InputWithLabel>

                <InputWithLabel label="Số điện thoại">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập số điện thoại..."
                    value={inputObject.phoneNumber}
                    onChange={(e) => setInputObject({ ...inputObject, phoneNumber: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Địa chỉ email">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập địa chỉ email..."
                    value={inputObject.emailAddress}
                    onChange={(e) => setInputObject({ ...inputObject, emailAddress: e.target.value })}
                  />
                </InputWithLabel>

                <InputWithLabel label="Ghi chú đơn hàng">
                  <TextAreaInput placeholder="Nhập ghi chú đơn hàng..." value={inputObject.orderNotice} onChange={(e) => setInputObject({...inputObject, orderNotice: e.target.value})} />
                </InputWithLabel>
              </div>
            </div>

            {/* right div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Sản phẩm trong đơn hàng
              </h3>

              <div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Tìm kiếm sản phẩm">
                    <SimpleInput type="text" placeholder="Nhập tên sản phẩm..." value={inputObject.searchProducts} onChange={(e) => setInputObject({...inputObject, searchProducts: e.target.value})} />
                  </InputWithLabel>
                  <InputWithLabel label="Số lượng">
                    <SimpleInput
                      type="text"
                      placeholder="Nhập số lượng..."
                      value={inputObject.quantity}
                      onChange={(e) => setInputObject({ ...inputObject, quantity: Number(e.target.value) })}
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

                <div className="mt-5">
                  <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                    Danh sách sản phẩm
                  </h3>
                  <div className="mt-4 flex flex-col gap-5 max-[450px]:items-start">
                    <div className="flex justify-between items-center max-[450px]:flex-col">
                      <div className="flex items-center gap-3 max-[450px]:flex-col">
                        <img src="/src/assets/SimpliSafe_Home_Security.jpg" alt="product" className="w-12 h-12" />
                        <span className="dark:text-whiteSecondary text-blackPrimary">SimpliSafe Home Security</span>
                      </div>
                      <span className="dark:text-whiteSecondary text-blackPrimary">Số lượng: 2</span>
                    </div>
                    <div className="flex justify-between items-center max-[450px]:flex-col">
                      <div className="flex items-center gap-3  max-[450px]:flex-col">
                        <img src="/src/assets/Eve_Room.jpg" alt="product" className="w-12 h-12" />
                        <span className="dark:text-whiteSecondary text-blackPrimary">Eve Room</span>
                      </div>
                      <span className="dark:text-whiteSecondary text-blackPrimary">Số lượng: 1</span>
                    </div>
                    <div className="flex justify-between items-center max-[450px]:flex-col">
                      <div className="flex items-center gap-3  max-[450px]:flex-col">
                        <img src="/src/assets/tablet (3).jpg" alt="product" className="w-12 h-12" />
                        <span className="dark:text-whiteSecondary text-blackPrimary">Govee Water Leak Detector</span>
                      </div>
                      <span className="dark:text-whiteSecondary text-blackPrimary">Số lượng: 1</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                  Tổng cộng
                </h3>
                <div className="mt-4 flex flex-col gap-5">
                  <div className="flex justify-between items-center">
                    <span className="dark:text-whiteSecondary text-blackPrimary">Tổng số sản phẩm</span>
                    <span className="dark:text-whiteSecondary text-blackPrimary">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="dark:text-whiteSecondary text-blackPrimary">Tổng giá trị</span>
                    <span className="dark:text-whiteSecondary text-blackPrimary">$1899</span>
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

export default EditOrder;

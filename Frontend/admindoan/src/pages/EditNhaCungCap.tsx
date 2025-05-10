import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import { HiOutlineSave } from "react-icons/hi";
import {
  InputWithLabel,
  Sidebar,
  SimpleInput,
  TextAreaInput,
  WhiteButton,
} from "../components";

const EditNhaCungCap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputObject, setInputObject] = useState({
    tenNhaCungCap: "",
    soDienThoai: "",
    email: "",
    diaChi: "",
    ghiChu: "",
  });

  const handleUpdate = () => {
    // Gọi API cập nhật nhà cung cấp với `id` và `inputObject`
    console.log("Cập nhật nhà cung cấp:", id, inputObject);
    // Sau khi gọi API, chuyển hướng về danh sách nhà cung cấp
    navigate("/nha-cung-cap");
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <div className="pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
          <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
            Chỉnh sửa Nhà Cung Cấp
          </h2>
          <div className="flex gap-x-2">
            <button className="bg-whiteSecondary dark:bg-blackPrimary border border-gray-600 w-48 py-2 text-lg hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
              <AiOutlineSave className="text-xl dark:text-whiteSecondary text-blackPrimary" />
              <span className="font-medium dark:text-whiteSecondary text-blackPrimary">
                Lưu nháp
              </span>
            </button>
            <WhiteButton
              text="Cập nhật"
              textSize="lg"
              width="48"
              py="2"
              onClick={handleUpdate} // Sử dụng onClick ở đây
            >
              <HiOutlineSave className="text-xl dark:text-blackPrimary text-whiteSecondary" />
            </WhiteButton>
          </div>
        </div>

        <form
          className="grid grid-cols-2 gap-x-10 mt-10 max-xl:grid-cols-1 max-xl:gap-y-10"
        >
          <div className="flex flex-col gap-5">
            <InputWithLabel label="Tên nhà cung cấp">
              <SimpleInput
                type="text"
                placeholder="Nhập tên nhà cung cấp..."
                value={inputObject.tenNhaCungCap}
                onChange={(e) =>
                  setInputObject({ ...inputObject, tenNhaCungCap: e.target.value })
                }
              />
            </InputWithLabel>

            <InputWithLabel label="Số điện thoại">
              <SimpleInput
                type="text"
                placeholder="Nhập số điện thoại..."
                value={inputObject.soDienThoai}
                onChange={(e) =>
                  setInputObject({ ...inputObject, soDienThoai: e.target.value })
                }
              />
            </InputWithLabel>

            <InputWithLabel label="Email">
              <SimpleInput
                type="email"
                placeholder="Nhập email..."
                value={inputObject.email}
                onChange={(e) =>
                  setInputObject({ ...inputObject, email: e.target.value })
                }
              />
            </InputWithLabel>

            <InputWithLabel label="Địa chỉ">
              <SimpleInput
                type="text"
                placeholder="Nhập địa chỉ..."
                value={inputObject.diaChi}
                onChange={(e) =>
                  setInputObject({ ...inputObject, diaChi: e.target.value })
                }
              />
            </InputWithLabel>

            <InputWithLabel label="Ghi chú (tuỳ chọn)">
              <TextAreaInput
                placeholder="Nhập ghi chú..."
                value={inputObject.ghiChu}
                onChange={(e) =>
                  setInputObject({ ...inputObject, ghiChu: e.target.value })
                }
              />
            </InputWithLabel>

            <div className="flex justify-end mt-4">
              {/* Nút "Cập nhật" sẽ gọi hàm handleUpdate */}
              <WhiteButton text="Cập nhật" width="40" py="2" textSize="md" onClick={handleUpdate} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNhaCungCap;

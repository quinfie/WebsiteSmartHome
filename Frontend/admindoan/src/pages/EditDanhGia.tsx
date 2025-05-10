import { Sidebar } from "../components";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { useDanhGia } from "../contexts/DanhGiaContext";
import { useEffect } from "react";

const EditDanhGiaPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedDanhGia, getById } = useDanhGia();

  useEffect(() => {
    if (id) {
      getById(id);
    }
  }, [id]);

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full py-10">
        <div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
              Chi tiết đánh giá
            </h2>
            <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
              <span>Bảng điều khiển</span>
              <HiOutlineChevronRight className="text-lg mx-1" />
              <span>Tất cả đánh giá</span>
              <HiOutlineChevronRight className="text-lg mx-1" />
              <span>Chi tiết</span>
            </p>
          </div>

          {/* Content */}
          {selectedDanhGia ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
              <div>
                <span className="font-semibold dark:text-whiteSecondary text-blackPrimary">
                  Mã đánh giá:
                </span>{" "}
                <span className="dark:text-whiteSecondary text-blackPrimary">
                  {selectedDanhGia.id}
                </span>
              </div>
              <div>
                <span className="font-semibold dark:text-whiteSecondary text-blackPrimary">
                  Mã đơn hàng:
                </span>{" "}
                <span className="dark:text-whiteSecondary text-blackPrimary">
                  {selectedDanhGia.maDonHang}
                </span>
              </div>
              <div>
                <span className="font-semibold dark:text-whiteSecondary text-blackPrimary">
                  Mã sản phẩm:
                </span>{" "}
                <span className="dark:text-whiteSecondary text-blackPrimary">
                  {selectedDanhGia.maSanPham}
                </span>
              </div>
              <div>
                <span className="font-semibold dark:text-whiteSecondary text-blackPrimary">
                  Số sao:
                </span>{" "}
                <span className="dark:text-whiteSecondary text-blackPrimary">
                  {selectedDanhGia.soSao}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold dark:text-whiteSecondary text-blackPrimary">
                  Nội dung:
                </span>
                <p className="mt-2 dark:text-whiteSecondary text-blackPrimary border dark:border-gray-600 border-gray-400 p-4 rounded-md">
                  {selectedDanhGia.noiDung || "(Không có nội dung)"}
                </p>
              </div>
              <div>
                <span className="font-semibold dark:text-whiteSecondary text-blackPrimary">
                  Ngày đánh giá:
                </span>{" "}
                <span className="dark:text-whiteSecondary text-blackPrimary">
                  {selectedDanhGia.ngayDanhGia
                    ? new Date(selectedDanhGia.ngayDanhGia).toLocaleString()
                    : "(Không có thông tin)"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-lg dark:text-whiteSecondary text-blackPrimary">
              Đang tải dữ liệu...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDanhGiaPage;

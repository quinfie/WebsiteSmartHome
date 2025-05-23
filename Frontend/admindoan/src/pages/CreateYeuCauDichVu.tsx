import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, InputWithLabel, SimpleInput, WhiteButton } from "../components";
import { useYeuCauDichVu } from "../contexts/YeuCauDichVuContext";
import { CreateYeuCauDichVuDto } from "../types/yeucaudichvu";
import { LoaiDichVu } from "../types/yeucaudichvu";

const CreateYeuCauDichVu = () => {
  const navigate = useNavigate();
  const { taoYeuCau } = useYeuCauDichVu();

  const [data, setData] = useState<CreateYeuCauDichVuDto>({
    maChiTietDonHang: 0,
    loaiDichVu: "Bảo hành",
    moTa: "",
    ngayHen: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await taoYeuCau(data);
      alert("Tạo yêu cầu dịch vụ thành công!");
      navigate("/yeu-cau-dich-vu");
    } catch (err: any) {
      console.error("Lỗi khi tạo yêu cầu:", err);
      setError(err.message || "Có lỗi xảy ra khi tạo yêu cầu dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <form onSubmit={handleSubmit} className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary mb-6">
          Thêm Yêu Cầu Dịch Vụ
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
          <InputWithLabel label="Mã Chi Tiết Đơn Hàng">
            <SimpleInput
              type="number"
              placeholder="Nhập mã chi tiết đơn hàng..."
              value={data.maChiTietDonHang}
              onChange={e => setData({ ...data, maChiTietDonHang: Number(e.target.value) })}
              required
            />
          </InputWithLabel>

          <InputWithLabel label="Loại Dịch Vụ">
            <select
              className="w-full h-10 border p-2"
              value={data.loaiDichVu}
              onChange={e => setData({ ...data, loaiDichVu: e.target.value as LoaiDichVu })}
              required
            >
              <option value="Bảo hành">Bảo hành</option>
              <option value="Sửa chữa">Sửa chữa</option>
            </select>
          </InputWithLabel>

          <InputWithLabel label="Ngày Hẹn">
            <SimpleInput
              type="date"
              value={data.ngayHen}
              onChange={e => setData({ ...data, ngayHen: e.target.value })}
              required
            />
          </InputWithLabel>

          <InputWithLabel label="Mô Tả" className="col-span-2">
            <textarea
              className="w-full border p-2 h-24"
              value={data.moTa}
              onChange={e => setData({ ...data, moTa: e.target.value })}
              placeholder="Mô tả chi tiết về vấn đề của sản phẩm..."
              required
            />
          </InputWithLabel>
        </div>

        <div className="mt-8 flex gap-3">
          <WhiteButton link="/yeu-cau-dich-vu" text="Hủy" width="32" py="2" textSize="lg" />
          <button
            type="submit"
            className={`bg-blackPrimary dark:bg-whiteSecondary text-whiteSecondary dark:text-blackPrimary px-6 py-2 rounded-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateYeuCauDichVu;
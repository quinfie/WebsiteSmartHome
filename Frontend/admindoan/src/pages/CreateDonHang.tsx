import React, { useEffect, useState } from 'react';
import { RequestCreateDonHangDto, RequestCreateChiTietDonHangDto } from '../types/donhang';
import { useDonHang } from '../contexts/DonHangContext';
import { sanPhamService } from '../api/sanpham';
import { SanPhamDto } from '../types/sanpham';

const CreateOrder = () => {
  const { create } = useDonHang();
  const [sanPhams, setSanPhams] = useState<SanPhamDto[]>([]);
  const [formData, setFormData] = useState<RequestCreateDonHangDto>({
    tenNguoiDung: '',
    tongTien: 0,
    trangThaiDonHang: '',
    ngayDat: '',
    maKhuyenMai: '',
    chiTietDonHangs: [],
  });

  useEffect(() => {
    const fetchSanPhams = async () => {
      const data = await sanPhamService.getAll();
      setSanPhams(data.items);
    };
    fetchSanPhams();
  }, []);

  const handleAddChiTiet = () => {
    setFormData((prev) => ({
      ...prev,
      chiTietDonHangs: [
        ...(prev.chiTietDonHangs || []),
        { maSanPham: '', soLuongMua: 1, donGiaMua: 0 },
      ],
    }));
  };

  const handleChangeChiTiet = (
    index: number,
    field: keyof RequestCreateChiTietDonHangDto,
    value: any
  ) => {
    const newChiTiet = [...(formData.chiTietDonHangs || [])];
    newChiTiet[index] = {
      ...newChiTiet[index],
      [field]: field === 'soLuongMua' ? parseInt(value) : field === 'donGiaMua' ? parseFloat(value) : value,
    };
    setFormData({ ...formData, chiTietDonHangs: newChiTiet });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create(formData);
    alert('Đã tạo đơn hàng!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tạo đơn hàng mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Tên người dùng:</label>
          <input
            type="text"
            value={formData.tenNguoiDung}
            onChange={(e) => setFormData({ ...formData, tenNguoiDung: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Tổng tiền:</label>
          <input
            type="number"
            step="0.01"
            value={formData.tongTien}
            onChange={(e) => setFormData({ ...formData, tongTien: parseFloat(e.target.value) })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Trạng thái đơn hàng:</label>
          <input
            type="text"
            value={formData.trangThaiDonHang}
            onChange={(e) => setFormData({ ...formData, trangThaiDonHang: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Ngày đặt:</label>
          <input
            type="date"
            value={formData.ngayDat}
            onChange={(e) => setFormData({ ...formData, ngayDat: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Mã khuyến mãi:</label>
          <input
            type="text"
            value={formData.maKhuyenMai || ''}
            onChange={(e) => setFormData({ ...formData, maKhuyenMai: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Chi tiết đơn hàng:</label>
          <button
            type="button"
            onClick={handleAddChiTiet}
            className="mb-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thêm sản phẩm
          </button>

          {formData.chiTietDonHangs?.map((ct, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center mb-2">
              <select
                className="border px-2 py-1 rounded"
                value={ct.maSanPham}
                onChange={(e) => handleChangeChiTiet(index, 'maSanPham', e.target.value)}
              >
                <option value="">Chọn sản phẩm</option>
                {sanPhams.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.tenSanPham}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="border px-2 py-1 rounded"
                placeholder="Số lượng"
                value={ct.soLuongMua}
                onChange={(e) => handleChangeChiTiet(index, 'soLuongMua', e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                className="border px-2 py-1 rounded"
                placeholder="Đơn giá"
                value={ct.donGiaMua}
                onChange={(e) => handleChangeChiTiet(index, 'donGiaMua', e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Tạo đơn hàng
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;

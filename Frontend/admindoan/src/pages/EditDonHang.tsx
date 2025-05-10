import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDonHang } from '../contexts/DonHangContext';
import { useSanPham } from '../contexts/SanPhamContext';
import { SanPhamDto } from '../types/sanpham';
import {
  RequestUpdateDonHangDto,
  RequestUpdateChiTietDonHangDto,
} from '@/types/donhang';

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, update } = useDonHang();
  const { getAll: getAllSanPham } = useSanPham();
  const [sanPhams, setSanPhams] = useState<SanPhamDto[]>([]);

  const [form, setForm] = useState<RequestUpdateDonHangDto>({
    maKhuyenMai: '',
    trangThaiDonHang: '',
    chiTietDonHangs: [],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      const [orderData, sanPhamData] = await Promise.all([
        getById(id),
        getAllSanPham(),
      ]);

      setForm({
        maKhuyenMai: orderData.maKhuyenMai || '',
        trangThaiDonHang: orderData.trangThaiDonHang,
        chiTietDonHangs:
          orderData.chiTietDonHangs?.map((ct) => ({
            maSanPham: ct.maSanPham,
            soLuongMua: ct.soLuong,
            donGiaMua: ct.donGia,
          })) || [],
      });

      setSanPhams(sanPhamData.items);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleChangeChiTiet = (
    index: number,
    field: keyof RequestUpdateChiTietDonHangDto,
    value: string | number
  ) => {
    const newChiTiet = [...(form.chiTietDonHangs || [])];
    newChiTiet[index] = {
      ...newChiTiet[index],
      [field]:
        field === 'soLuong'
          ? parseInt(value as string)
          : field === 'donGia'
            ? parseFloat(value as string)
            : value,
    };
    setForm((prev) => ({
      ...prev,
      chiTietDonHangs: newChiTiet,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!form.chiTietDonHangs || form.chiTietDonHangs.length === 0) {
      alert('Vui lòng thêm ít nhất một chi tiết đơn hàng!');
      return;
    }

    setSubmitting(true);
    await update(id, form);
    setSubmitting(false);
    navigate('/dashboard/don-hang');
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa đơn hàng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Mã khuyến mãi</label>
          <input
            type="text"
            value={form.maKhuyenMai}
            onChange={(e) => setForm({ ...form, maKhuyenMai: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Trạng thái đơn hàng</label>
          <select
            value={form.trangThaiDonHang}
            onChange={(e) => setForm({ ...form, trangThaiDonHang: e.target.value })} // KHÔNG parseInt
            className="w-full border px-3 py-2 rounded"
          >
            <option value="CHO_XU_LY">Chờ xử lý</option>
            <option value="DANG_GIAO">Đang giao</option>
            <option value="HOAN_THANH">Hoàn thành</option>
            <option value="DA_HUY">Đã hủy</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Chi tiết đơn hàng</label>
          {form.chiTietDonHangs?.map((ct, index) => (
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
                onChange={(e) => handleChangeChiTiet(index, 'soLuong', e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                className="border px-2 py-1 rounded"
                placeholder="Đơn giá"
                value={ct.donGiaMua}
                onChange={(e) => handleChangeChiTiet(index, 'donGia', e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {submitting ? 'Đang cập nhật...' : 'Cập nhật đơn hàng'}
        </button>
      </form>
    </div>
  );
};

export default EditOrder;

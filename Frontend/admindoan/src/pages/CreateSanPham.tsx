import { useState } from 'react';
import { useSanPham } from '../contexts/SanPhamContext';
import { SanPhamCreateDto } from '../types/sanpham';

const CreateProduct = () => {
  const { createProduct } = useSanPham();

  const [formData, setFormData] = useState<SanPhamCreateDto>({
    tenSanPham: '',
    donGia: 0,
    soLuongTon: 0,
    thoiGianBaoHanh: 12,
    moTa: '',
    ngaySanXuat: new Date(),
    // sẽ thêm maDanhMuc, maNhaCungCap, maKho nếu có dropdown
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'donGia' || name === 'soLuongTon' || name === 'thoiGianBaoHanh'
          ? Number(value)
          : name === 'ngaySanXuat'
          ? new Date(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Mặc định truyền tạm các mã nếu chưa dùng dropdown
      await createProduct(formData, 'maDanhMuc-temp', 'maNhaCungCap-temp', 'maKho-temp');
      setMessage('✅ Tạo sản phẩm thành công!');
      setFormData({
        tenSanPham: '',
        donGia: 0,
        soLuongTon: 0,
        thoiGianBaoHanh: 12,
        moTa: '',
        ngaySanXuat: new Date(),
      });
    } catch (err) {
      console.error(err);
      setMessage('❌ Tạo sản phẩm thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Thêm sản phẩm mới</h2>
        {message && <p className="mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tên sản phẩm</label>
            <input
              name="tenSanPham"
              value={formData.tenSanPham}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Đơn giá</label>
            <input
              name="donGia"
              type="number"
              value={formData.donGia}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Số lượng tồn</label>
            <input
              name="soLuongTon"
              type="number"
              value={formData.soLuongTon}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Thời gian bảo hành (tháng)</label>
            <input
              name="thoiGianBaoHanh"
              type="number"
              value={formData.thoiGianBaoHanh}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mô tả</label>
            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ngày sản xuất</label>
            <input
              name="ngaySanXuat"
              type="date"
              value={formData.ngaySanXuat.toISOString().split('T')[0]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;

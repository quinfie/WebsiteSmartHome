import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSanPham } from '../contexts/SanPhamContext';
import { SanPhamUpdateDto } from '../types/sanpham';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, updateProduct } = useSanPham();

  const [formData, setFormData] = useState<SanPhamUpdateDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const data = await getProductById(id);
        setFormData({
          tenSanPham: data.tenSanPham,
          donGia: data.donGia,
          soLuongTon: data.soLuongTon,
          thoiGianBaoHanh: data.thoiGianBaoHanh,
          moTa: data.moTa,
          ngaySanXuat: new Date(data.ngaySanXuat),
          maDanhMuc: data.maDanhMuc,
          maNhaCungCap: data.maNhaCungCap,
          maKho: data.maKho,
        });
      } catch (err) {
        console.error('Không lấy được sản phẩm:', err);
        setMessage('Không lấy được dữ liệu sản phẩm');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData(prev => ({
      ...prev!,
      [name]: name === 'donGia' || name === 'soLuongTon' || name === 'thoiGianBaoHanh'
        ? Number(value)
        : name === 'ngaySanXuat'
          ? new Date(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;
    setLoading(true);
    setMessage('');
    try {
      await updateProduct(id, formData);
      setMessage('Cập nhật sản phẩm thành công!');
    } catch (err) {
      console.error(err);
      setMessage(' Cập nhật sản phẩm thất bại!');
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <div className="text-center mt-10">Đang tải sản phẩm...</div>;

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Chỉnh sửa sản phẩm</h2>
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
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

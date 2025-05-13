import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSanPham } from '../contexts/SanPhamContext';
import { SanPhamCreateDto } from '../types/sanpham';
import { HiOutlinePhotograph, HiOutlineUpload, HiArrowLeft, HiCheck, HiX } from 'react-icons/hi';
import { sanPhamService } from '../api/sanpham';
import { useDanhMuc } from '../contexts/DanhMucContexts';
import { useNhaCungCap } from '../contexts/NhaCungCapContext';
import { useKho } from '../contexts/KhoContext';
import axios from 'axios';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProduct } = useSanPham();
  const { danhMucs, fetchDanhMucs } = useDanhMuc();
  const { suppliers, fetchSuppliers } = useNhaCungCap();
  const { khoList, fetchAllKho } = useKho();

  const [formData, setFormData] = useState<SanPhamCreateDto>({
    tenSanPham: '',
    donGia: 0,
    soLuongTon: 0,
    thoiGianBaoHanh: 12,
    moTa: '',
    ngaySanXuat: new Date(),
    img: ''
  });

  // Thêm các trường khóa ngoại
  const [maDanhMuc, setMaDanhMuc] = useState<string>('');
  const [maNhaCungCap, setMaNhaCungCap] = useState<string>('');
  const [maKho, setMaKho] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch categories, suppliers, and warehouses on component mount only once
  useEffect(() => {
    // Bỏ các request nếu đã có dữ liệu
    if (danhMucs.length === 0) {
      fetchDanhMucs();
    }

    if (suppliers.length === 0) {
      fetchSuppliers();
    }

    if (khoList.length === 0) {
      fetchAllKho();
    }
  }, []); // Empty dependency array chỉ gọi một lần khi mount

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'maDanhMuc':
        setMaDanhMuc(value);
        break;
      case 'maNhaCungCap':
        setMaNhaCungCap(value);
        break;
      case 'maKho':
        setMaKho(value);
        break;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tạo một bản xem trước ảnh
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Hiển thị trạng thái đang tải
    setLoading(true);
    setMessage("Đang tải ảnh lên...");
    setMessageType('success');

    try {
      console.log('Đang tải ảnh:', file.name, 'Kích thước:', file.size, 'Loại:', file.type);

      // Sử dụng service để upload ảnh - controller endpoint đã được thêm
      const imagePath = await sanPhamService.upload(file);

      // Cập nhật đường dẫn ảnh trong form data
      setFormData(prev => ({
        ...prev,
        img: imagePath
      }));

      setMessage("Tải ảnh lên thành công");
      setMessageType('success');
    } catch (error: any) {
      console.error("Lỗi khi tải ảnh:", error);
      setMessage(`Lỗi khi tải ảnh lên: ${error.message || 'Lỗi không xác định'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!maDanhMuc) {
      setMessage('Lỗi: Mã danh mục không được để trống.');
      setMessageType('error');
      return;
    }

    if (!maNhaCungCap) {
      setMessage('Lỗi: Mã nhà cung cấp không được để trống.');
      setMessageType('error');
      return;
    }

    if (!maKho) {
      setMessage('Lỗi: Mã kho không được để trống.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Đang tạo sản phẩm...');
    setMessageType('success');

    try {
      await createProduct(formData, maDanhMuc, maNhaCungCap, maKho);

      setMessage('Tạo sản phẩm thành công!');
      setMessageType('success');

      // Delay navigation to allow user to see success message
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Tạo sản phẩm thất bại!');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/products')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <HiArrowLeft className="mr-2" /> Quay lại danh sách sản phẩm
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'
          }`}>
          {messageType === 'success' ? (
            <HiCheck className="mr-3 text-2xl text-green-500" />
          ) : (
            <HiX className="mr-3 text-2xl text-red-500" />
          )}
          <span>{message}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Image Upload */}
            <div className="p-6 bg-gray-50 border-r border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Hình ảnh sản phẩm</h2>
              <div className="w-full h-72 rounded-lg overflow-hidden mb-4 bg-white border border-gray-300 flex items-center justify-center shadow-inner">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '100%' }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <HiOutlinePhotograph size={72} className="mb-2" />
                    <p>Chưa có hình ảnh</p>
                  </div>
                )}
              </div>

              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer w-full transition-colors shadow">
                <HiOutlineUpload size={20} />
                <span>Chọn hình ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <p className="text-xs text-gray-500 mt-2 text-center break-all">
                  {formData.img || 'Chưa có đường dẫn lưu trữ'}
                </p>
              )}
            </div>

            {/* Column 2 & 3: Product Details */}
            <div className="md:col-span-2 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Tên sản phẩm</label>
                  <input
                    name="tenSanPham"
                    value={formData.tenSanPham}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Đơn giá (VNĐ)</label>
                  <div className="relative">
                    <input
                      name="donGia"
                      type="number"
                      value={formData.donGia}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Số lượng tồn</label>
                  <input
                    name="soLuongTon"
                    type="number"
                    value={formData.soLuongTon}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Thời gian bảo hành (tháng)</label>
                  <input
                    name="thoiGianBaoHanh"
                    type="number"
                    value={formData.thoiGianBaoHanh}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Ngày sản xuất</label>
                  <input
                    name="ngaySanXuat"
                    type="date"
                    value={formData.ngaySanXuat.toISOString().split('T')[0]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Mô tả</label>
                  <textarea
                    name="moTa"
                    value={formData.moTa || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Foreign Key Fields with Default Display */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Danh mục</label>
                  <div className="relative">
                    <select
                      name="maDanhMuc"
                      value={maDanhMuc}
                      onChange={handleSelectChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      {danhMucs.map(category => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.tenDanhMuc}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Nhà cung cấp</label>
                  <div className="relative">
                    <select
                      name="maNhaCungCap"
                      value={maNhaCungCap}
                      onChange={handleSelectChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn nhà cung cấp</option>
                      {suppliers.map(supplier => (
                        <option
                          key={supplier.id}
                          value={supplier.id}
                        >
                          {supplier.tenNhaCungCap}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Kho</label>
                  <div className="relative">
                    <select
                      name="maKho"
                      value={maKho}
                      onChange={handleSelectChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn kho</option>
                      {khoList.map((warehouse) => (
                        <option
                          key={warehouse.id}
                          value={String(warehouse.id)}
                        >
                          {warehouse.tenKho}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/products')}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg mr-4 hover:bg-gray-300 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <HiCheck className="mr-2" /> Tạo sản phẩm
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;

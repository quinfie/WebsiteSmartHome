import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSanPham } from '../contexts/SanPhamContext';
import { SanPhamUpdateDto } from '../types/sanpham';
import { HiOutlinePhotograph, HiOutlineUpload, HiArrowLeft, HiCheck, HiX, HiInformationCircle } from 'react-icons/hi';
import { sanPhamService } from '../api/sanpham';
import { useDanhMuc } from '../contexts/DanhMucContexts';
import { useNhaCungCap } from '../contexts/NhaCungCapContext';
import { useKho } from '../contexts/KhoContext';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, updateProduct } = useSanPham();
  const { danhMucs, fetchDanhMucs } = useDanhMuc();
  const { suppliers, fetchSuppliers } = useNhaCungCap();
  const { khoList, fetchAllKho } = useKho();

  const [formData, setFormData] = useState<SanPhamUpdateDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Fetch categories, suppliers, and warehouses on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Fetch data only once when component mounts
    fetchDanhMucs();
    fetchSuppliers();
    fetchAllKho();
  }, []); // Empty dependency array means this effect runs once on mount

  // Hàm chuyển đổi đường dẫn ảnh từ DB sang đường dẫn thực tế
  const getImagePath = (imgPath: string | null | undefined) => {
    if (!imgPath) return '';

    try {
      // Kiểm tra xem đường dẫn đã có http hoặc https chưa
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        return imgPath;
      }

      // Nếu đường dẫn bắt đầu bằng 'public/'
      if (imgPath.startsWith('public/')) {
        // Đường dẫn tương đối trong src/assets
        return `/src/assets/${imgPath}`;
      }

      // Nếu đường dẫn bắt đầu bằng '/'
      if (imgPath.startsWith('/')) {
        return imgPath;
      }

      return `/src/assets/${imgPath}`;
    } catch (error) {
      console.error("Lỗi khi xử lý đường dẫn ảnh:", error);
      return '';
    }
  };

  // Fetch product data when id changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);

        // Set form data with the product information
        const formattedData = {
          tenSanPham: data.tenSanPham || '',
          donGia: data.donGia || 0,
          soLuongTon: data.soLuongTon || 0,
          thoiGianBaoHanh: data.thoiGianBaoHanh || 0,
          moTa: data.moTa || '',
          ngaySanXuat: new Date(data.ngaySanXuat || new Date()),
          // Kiểm tra và lấy ID đúng từ response
          maDanhMuc: data.maDanhMuc || '',
          maNhaCungCap: data.maNhaCungCap || '',
          maKho: data.maKho ? String(data.maKho) : '',
          img: data.img || ''
        };

        // Tìm id của các khóa ngoại nếu tồn tại các trường khác
        if (!formattedData.maDanhMuc && data.tenDanhMuc) {
          // Tìm theo tên nếu có
          const foundCategory = danhMucs.find(c => c.tenDanhMuc === data.tenDanhMuc);
          if (foundCategory) {
            formattedData.maDanhMuc = foundCategory.id;
          }
        }

        if (!formattedData.maNhaCungCap && data.tenNhaCungCap) {
          // Tìm theo tên nếu có
          const foundSupplier = suppliers.find(s => s.tenNhaCungCap === data.tenNhaCungCap);
          if (foundSupplier) {
            formattedData.maNhaCungCap = foundSupplier.id;
          }
        }

        if (!formattedData.maKho && data.tenKho) {
          // Tìm theo tên nếu có
          const foundWarehouse = khoList.find(w => w.tenKho === data.tenKho);
          if (foundWarehouse) {
            formattedData.maKho = String(foundWarehouse.id);
          }
        }

        setFormData(formattedData);

        if (data.img) {
          setCurrentImage(data.img);
        }
      } catch (err) {
        console.error('Không lấy được sản phẩm:', err);
        setMessage('Không lấy được dữ liệu sản phẩm');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, danhMucs, suppliers, khoList]);

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData(prev => ({
      ...prev!,
      [name]: value,
    }));
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
      // Tải ảnh lên server và nhận về đường dẫn
      const imagePath = await sanPhamService.upload(file);

      // Cập nhật đường dẫn ảnh trong form data
      if (formData) {
        setFormData({
          ...formData,
          img: imagePath
        });
      }

      setMessage("Tải ảnh lên thành công");
      setMessageType('success');
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      setMessage("Lỗi khi tải ảnh lên");
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;

    // Validate category, supplier, and warehouse IDs
    if (!formData.maDanhMuc) {
      setMessage('Lỗi: Mã danh mục không được để trống.');
      setMessageType('error');
      return;
    }

    if (!formData.maNhaCungCap) {
      setMessage('Lỗi: Mã nhà cung cấp không được để trống.');
      setMessageType('error');
      return;
    }

    if (!formData.maKho) {
      setMessage('Lỗi: Mã kho không được để trống.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Đang cập nhật...');
    setMessageType('success');

    try {
      // Tạo bản sao dữ liệu form và xử lý các kiểu dữ liệu
      const submissionData = {
        ...formData,
        // Đảm bảo kiểu dữ liệu đúng trước khi gửi
        donGia: Number(formData.donGia),
        soLuongTon: Number(formData.soLuongTon),
        thoiGianBaoHanh: Number(formData.thoiGianBaoHanh)
      };

      await updateProduct(id, submissionData);

      setMessage('Cập nhật sản phẩm thành công!');
      setMessageType('success');

      // Delay navigation to allow user to see success message
      setTimeout(() => {
        window.location.href = '/dashboard/products'; // full reload
      }, 1500);

    } catch (err: any) {
      console.error(err);
      // Get more specific error messages from the error object
      if (err.message && err.message.includes('invalid_category')) {
        setMessage('Lỗi: Mã danh mục không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        setMessage(err.message || 'Cập nhật sản phẩm thất bại!');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const getCategoryName = (categoryId: string) => {
    const category = danhMucs.find(c => c.id === categoryId);
    return category ? category.tenDanhMuc : 'Không tìm thấy';
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.tenNhaCungCap : 'Không tìm thấy';
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = khoList.find(w => String(w.id) === warehouseId);
    return warehouse ? warehouse.tenKho : 'Không tìm thấy';
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
        <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
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
                ) : currentImage ? (
                  <img
                    src={getImagePath(currentImage)}
                    alt={formData.tenSanPham}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '100%' }}
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: ${currentImage}`);
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
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

              {(imagePreview || currentImage) && (
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
                    value={formData.moTa}
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
                      value={formData.maDanhMuc || ""}
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
                      value={formData.maNhaCungCap || ""}
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
                      value={formData.maKho || ""}
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
                        <HiCheck className="mr-2" /> Lưu thay đổi
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

export default EditProduct;

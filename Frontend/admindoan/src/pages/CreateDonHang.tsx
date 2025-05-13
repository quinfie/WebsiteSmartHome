import React, { useEffect, useState } from 'react';
import { RequestCreateDonHangDto, RequestCreateChiTietDonHangDto } from '../types/donhang';
import { useDonHang } from '../contexts/DonHangContext';
import { sanPhamService } from '../api/sanpham';
import { SanPhamDto } from '../types/sanpham';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineShoppingCart, HiOutlineUser, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineTag, HiOutlineCheckCircle } from 'react-icons/hi';
import { RiShoppingBag3Line } from 'react-icons/ri';
import { Sidebar } from '../components';

const CreateOrder = () => {
  const { create } = useDonHang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sanPhams, setSanPhams] = useState<SanPhamDto[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<RequestCreateDonHangDto>({
    tenNguoiDung: '',
    tongTien: 0,
    trangThaiDonHang: 'Đang xử lý',
    ngayDat: new Date().toISOString().split('T')[0],
    maKhuyenMai: '',
    chiTietDonHangs: [],
  });

  useEffect(() => {
    const fetchSanPhams = async () => {
      try {
        const data = await sanPhamService.getAll();
        setSanPhams(data.items);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      }
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

  const handleRemoveChiTiet = (index: number) => {
    const newChiTiet = [...(formData.chiTietDonHangs || [])];
    newChiTiet.splice(index, 1);
    setFormData({ ...formData, chiTietDonHangs: newChiTiet });
  };

  const handleChangeChiTiet = (
    index: number,
    field: keyof RequestCreateChiTietDonHangDto,
    value: any
  ) => {
    const newChiTiet = [...(formData.chiTietDonHangs || [])];

    if (field === 'maSanPham' && value) {
      // Find the product and set its price as default
      const selectedProduct = sanPhams.find(p => p.id === value);
      if (selectedProduct) {
        newChiTiet[index] = {
          ...newChiTiet[index],
          maSanPham: value,
          donGiaMua: selectedProduct.donGia || 0
        };
      } else {
        newChiTiet[index] = {
          ...newChiTiet[index],
          maSanPham: value
        };
      }
    } else {
      newChiTiet[index] = {
        ...newChiTiet[index],
        [field]: field === 'soLuongMua' ? parseInt(value) : field === 'donGiaMua' ? parseFloat(value) : value,
      };
    }

    setFormData({ ...formData, chiTietDonHangs: newChiTiet });

    // Recalculate total
    calculateTotal(newChiTiet);
  };

  const calculateTotal = (chiTietDonHangs: RequestCreateChiTietDonHangDto[]) => {
    const total = chiTietDonHangs.reduce((sum, item) => {
      return sum + (item.soLuongMua * item.donGiaMua);
    }, 0);

    setFormData(prev => ({
      ...prev,
      tongTien: total
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.tenNguoiDung.trim()) {
      newErrors.tenNguoiDung = 'Vui lòng nhập tên người dùng';
    }

    if (!formData.ngayDat) {
      newErrors.ngayDat = 'Vui lòng chọn ngày đặt';
    }

    if (!formData.trangThaiDonHang.trim()) {
      newErrors.trangThaiDonHang = 'Vui lòng chọn trạng thái đơn hàng';
    }

    if (!formData.chiTietDonHangs || formData.chiTietDonHangs.length === 0) {
      newErrors.chiTietDonHangs = 'Vui lòng thêm ít nhất một sản phẩm';
    } else {
      formData.chiTietDonHangs.forEach((item, index) => {
        if (!item.maSanPham) {
          newErrors[`chiTiet_${index}`] = 'Vui lòng chọn sản phẩm';
        }
        if (item.soLuongMua <= 0) {
          newErrors[`chiTiet_soLuong_${index}`] = 'Số lượng phải lớn hơn 0';
        }
        if (item.donGiaMua <= 0) {
          newErrors[`chiTiet_donGia_${index}`] = 'Đơn giá phải lớn hơn 0';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await create(formData);
      alert('Đã tạo đơn hàng thành công!');
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      alert('Có lỗi xảy ra khi tạo đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const getSubtotal = (price: number, quantity: number) => {
    return (price * quantity).toLocaleString('vi-VN');
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full p-6">
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#1F2937] rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center gap-3">
              <RiShoppingBag3Line className="text-3xl" />
              <h1 className="text-2xl font-bold">Tạo đơn hàng mới</h1>
            </div>
            <p className="mt-2 text-blue-100">Điền thông tin đơn hàng và thêm sản phẩm vào đơn hàng</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-white flex items-center gap-2">
                  <HiOutlineUser className="text-blue-500" /> Thông tin đơn hàng
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên người dùng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tenNguoiDung}
                    onChange={(e) => setFormData({ ...formData, tenNguoiDung: e.target.value })}
                    className={`w-full border ${errors.tenNguoiDung ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Nhập tên người đặt hàng"
                  />
                  {errors.tenNguoiDung && <p className="text-red-500 text-xs mt-1">{errors.tenNguoiDung}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ngày đặt <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={formData.ngayDat}
                      onChange={(e) => setFormData({ ...formData, ngayDat: e.target.value })}
                      className={`w-full border ${errors.ngayDat ? 'border-red-500' : 'border-gray-300'} pl-10 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                    />
                  </div>
                  {errors.ngayDat && <p className="text-red-500 text-xs mt-1">{errors.ngayDat}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trạng thái đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineCheckCircle className="text-gray-400" />
                    </div>
                    <select
                      value={formData.trangThaiDonHang}
                      onChange={(e) => setFormData({ ...formData, trangThaiDonHang: e.target.value })}
                      className={`w-full border ${errors.trangThaiDonHang ? 'border-red-500' : 'border-gray-300'} pl-10 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none dark:bg-gray-700 dark:text-white`}
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                  {errors.trangThaiDonHang && <p className="text-red-500 text-xs mt-1">{errors.trangThaiDonHang}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mã khuyến mãi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineTag className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.maKhuyenMai || ''}
                      onChange={(e) => setFormData({ ...formData, maKhuyenMai: e.target.value })}
                      className="w-full border border-gray-300 pl-10 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Nhập mã khuyến mãi (nếu có)"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-white flex items-center gap-2">
                  <HiOutlineCurrencyDollar className="text-green-500" /> Thông tin thanh toán
                </h2>

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Tổng tiền đơn hàng:</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formData.tongTien.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Số sản phẩm:</span>
                    <span className="font-semibold dark:text-white">
                      {formData.chiTietDonHangs?.length || 0} sản phẩm
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <HiOutlineShoppingCart />
                        Tạo đơn hàng
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                  <HiOutlineShoppingCart className="text-purple-500" /> Chi tiết sản phẩm
                </h2>
                <button
                  type="button"
                  onClick={handleAddChiTiet}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <HiOutlinePlus className="-ml-0.5 mr-1" />
                  Thêm sản phẩm
                </button>
              </div>

              {errors.chiTietDonHangs && <p className="text-red-500 text-sm mb-2">{errors.chiTietDonHangs}</p>}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số lượng</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đơn giá</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thành tiền</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                    {formData.chiTietDonHangs?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          Chưa có sản phẩm nào. Vui lòng thêm sản phẩm vào đơn hàng.
                        </td>
                      </tr>
                    ) : (
                      formData.chiTietDonHangs?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-3 py-4">
                            <select
                              className={`block w-full border ${errors[`chiTiet_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white`}
                              value={item.maSanPham}
                              onChange={(e) => handleChangeChiTiet(index, 'maSanPham', e.target.value)}
                            >
                              <option value="">-- Chọn sản phẩm --</option>
                              {sanPhams.map((sp) => (
                                <option key={sp.id} value={sp.id}>
                                  {sp.tenSanPham}
                                </option>
                              ))}
                            </select>
                            {errors[`chiTiet_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`chiTiet_${index}`]}</p>}
                          </td>
                          <td className="px-3 py-4">
                            <input
                              type="number"
                              min="1"
                              className={`block w-24 border ${errors[`chiTiet_soLuong_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white`}
                              value={item.soLuongMua}
                              onChange={(e) => handleChangeChiTiet(index, 'soLuongMua', e.target.value)}
                            />
                            {errors[`chiTiet_soLuong_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`chiTiet_soLuong_${index}`]}</p>}
                          </td>
                          <td className="px-3 py-4">
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              className={`block w-32 border ${errors[`chiTiet_donGia_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white`}
                              value={item.donGiaMua}
                              onChange={(e) => handleChangeChiTiet(index, 'donGiaMua', e.target.value)}
                            />
                            {errors[`chiTiet_donGia_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`chiTiet_donGia_${index}`]}</p>}
                          </td>
                          <td className="px-3 py-4 text-sm font-medium text-green-600 dark:text-green-400">
                            {getSubtotal(item.donGiaMua, item.soLuongMua)}₫
                          </td>
                          <td className="px-3 py-4 text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleRemoveChiTiet(index)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;

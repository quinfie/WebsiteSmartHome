import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDonHang } from '../contexts/DonHangContext';
import {
  RequestUpdateDonHangDto,
  ViewResponseCreateDonHangDto
} from '@/types/donhang';
import { HiOutlineUser, HiOutlineTag, HiOutlineCheckCircle, HiOutlineShoppingCart, HiOutlineChevronRight, HiOutlineInformationCircle } from 'react-icons/hi';
import { Sidebar } from '../components';
import { RiShoppingBag3Line } from 'react-icons/ri';
import { getAllPromotions } from '../api/khuyenmai';
import { KhuyenMaiDto } from '../types/khuyenmai';
import { BaseResponse } from '../types/common';

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, update } = useDonHang();

  const [orderData, setOrderData] = useState<ViewResponseCreateDonHangDto | null>(null);
  const [form, setForm] = useState<RequestUpdateDonHangDto>({
    trangThaiDonHang: '',
    maKhuyenMai: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promotions, setPromotions] = useState<KhuyenMaiDto[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<KhuyenMaiDto | null>(null);

  // Fetch khuyến mãi
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getAllPromotions();
        setPromotions(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khuyến mãi:', error);
      }
    };
    fetchPromotions();
  }, []);

  // Cập nhật selectedPromotion khi form.maKhuyenMai thay đổi
  useEffect(() => {
    if (form.maKhuyenMai) {
      const promo = promotions.find(p => p.id === form.maKhuyenMai);
      setSelectedPromotion(promo || null);
    } else {
      setSelectedPromotion(null);
    }
  }, [form.maKhuyenMai, promotions]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.log('ID đơn hàng không có.');
        setLoading(false);
        return;
      }

      console.log(`Đang lấy dữ liệu đơn hàng với ID: ${id}`);
      setLoading(true);
      try {
        const response = await getById(id);
        console.log('API Response:', response);
        if (response.success && response.data) {
          console.log('Dữ liệu đơn hàng được tải thành công:', response.data);
          setOrderData(response.data);
          setForm({
            trangThaiDonHang: response.data.trangThaiDonHang,
            maKhuyenMai: response.data.maKhuyenMai || '',
          });
        } else {
          throw new Error(response.message || 'Không thể lấy thông tin đơn hàng');
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        alert("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getById]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setForm(prev => ({ ...prev, trangThaiDonHang: newStatus }));
  };

  const handlePromotionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const promotionId = e.target.value;
    setForm(prev => ({ ...prev, maKhuyenMai: promotionId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setSubmitting(true);
    try {
      const updateData: RequestUpdateDonHangDto = {
        trangThaiDonHang: form.trangThaiDonHang,
        maKhuyenMai: form.maKhuyenMai,
        chiTietDonHangs: orderData?.chiTietDonHangs?.map(item => ({
          maSanPham: item.maSanPham,
          soLuongMua: item.soLuong,
          donGiaMua: item.donGia
        })) || []
      };

      const response = await update(id, updateData);
      if (response.success) {
        alert('Cập nhật đơn hàng thành công!');
        navigate('/dashboard/orders');
      } else {
        throw new Error(response.message || 'Đã xảy ra lỗi khi cập nhật đơn hàng');
      }
    } catch (error: any) {
      console.error('Lỗi khi cập nhật đơn hàng:', error);
      const errorMessage = error.response?.data?.errors?.message || error.message || 'Đã xảy ra lỗi khi cập nhật đơn hàng';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  // Mô tả các trạng thái đơn hàng
  const statusDescriptions = {
    'Chờ xác nhận': 'Đơn hàng đang chờ xác nhận từ quản trị viên',
    'Đã xác nhận': 'Đơn hàng đã được xác nhận và đang chuẩn bị hàng',
    'Đang giao': 'Đơn hàng đang trong quá trình vận chuyển đến khách hàng',
    'Hoàn thành': 'Đơn hàng đã được giao thành công cho khách hàng',
    'Đã hủy': 'Đơn hàng đã bị hủy, không thể khôi phục'
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6 text-white">
            <div className="flex items-center gap-3">
              <RiShoppingBag3Line className="text-3xl" />
              <h1 className="text-2xl font-bold">Cập nhật đơn hàng</h1>
            </div>
            <p className="mt-2 text-blue-100 flex items-center">
              <span>Đơn hàng</span>
              <HiOutlineChevronRight className="mx-1" />
              <span>ID: {id?.substring(0, 8)}...</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                <div className="flex items-center gap-2">
                  <HiOutlineInformationCircle className="text-xl" />
                  <p className="font-medium">Lỗi: {error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Thông tin đơn hàng gốc - Cột trái */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-3 mb-4 dark:text-white flex items-center gap-2">
                  <HiOutlineUser className="text-blue-500" /> Thông tin đơn hàng gốc
                </h2>

                {orderData && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Người đặt:</span>
                      <span className="font-medium dark:text-white">{orderData.tenNguoiDung || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Ngày đặt:</span>
                      <span className="font-medium dark:text-white">
                        {orderData.ngayDat ? new Date(orderData.ngayDat).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Khuyến mãi:</span>
                      <span className="font-medium dark:text-white">{orderData.tenKhuyenMai || 'Không có'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {orderData.tongTien ? orderData.tongTien.toLocaleString('vi-VN') + '₫' : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${orderData.trangThaiDonHang === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                        orderData.trangThaiDonHang === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                          orderData.trangThaiDonHang === 'Đang giao' ? 'bg-blue-100 text-blue-800' :
                            orderData.trangThaiDonHang === 'Đã xác nhận' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                        }`}>
                        {orderData.trangThaiDonHang || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2 dark:text-white">Chi tiết sản phẩm:</h3>
                  {orderData && orderData.chiTietDonHangs && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg max-h-80 overflow-y-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b dark:border-gray-700">
                            <th className="text-left text-sm text-gray-600 dark:text-gray-400 pb-2">Sản phẩm</th>
                            <th className="text-right text-sm text-gray-600 dark:text-gray-400 pb-2">SL</th>
                            <th className="text-right text-sm text-gray-600 dark:text-gray-400 pb-2">Đơn giá</th>
                            <th className="text-right text-sm text-gray-600 dark:text-gray-400 pb-2">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderData.chiTietDonHangs.map((item, index) => (
                            <tr key={index} className={index !== 0 ? 'border-t dark:border-gray-700' : ''}>
                              <td className="py-2 pr-2 text-sm dark:text-white">{item.tenSanPham || 'N/A'}</td>
                              <td className="py-2 text-right text-sm dark:text-white">{item.soLuong || 0}</td>
                              <td className="py-2 text-right text-sm dark:text-white">
                                {item.donGia ? item.donGia.toLocaleString('vi-VN') + '₫' : 'N/A'}
                              </td>
                              <td className="py-2 text-right text-sm font-medium dark:text-white">
                                {item.soLuong && item.donGia ?
                                  (item.soLuong * item.donGia).toLocaleString('vi-VN') + '₫' :
                                  'N/A'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Cập nhật đơn hàng - Cột phải */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-3 mb-4 dark:text-white flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-green-500" /> Cập nhật đơn hàng
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Khuyến mãi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineTag className="text-gray-400" />
                    </div>
                    <select
                      value={form.maKhuyenMai}
                      onChange={handlePromotionChange}
                      className="w-full border border-gray-300 pl-10 px-3 py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Không áp dụng khuyến mãi</option>
                      {promotions.map(promo => (
                        <option key={promo.id} value={promo.id}>
                          {promo.tenKhuyenMai} ({promo.phanTramGiam}% giảm)
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPromotion && (
                    <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Chi tiết khuyến mãi
                      </h4>
                      <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                        <p>Tên: {selectedPromotion.tenKhuyenMai}</p>
                        <p>Giảm giá: {selectedPromotion.phanTramGiam}%</p>
                        <p>Thời gian: {new Date(selectedPromotion.ngayBatDau).toLocaleDateString('vi-VN')} - {new Date(selectedPromotion.ngayKetThuc).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trạng thái đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineCheckCircle className="text-gray-400" />
                    </div>
                    <select
                      value={form.trangThaiDonHang}
                      onChange={handleStatusChange}
                      className="w-full border border-gray-300 pl-10 px-3 py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>

                  <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-blue-600 dark:text-blue-400">Mô tả trạng thái:</span> {' '}
                      {statusDescriptions[form.trangThaiDonHang as keyof typeof statusDescriptions]}
                    </p>
                  </div>

                  {orderData && orderData.trangThaiDonHang !== form.trangThaiDonHang && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-800">
                      <p className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                        <HiOutlineInformationCircle className="text-lg" />
                        <span>Bạn đang thay đổi trạng thái từ "{orderData.trangThaiDonHang}" thành "{form.trangThaiDonHang}"</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    {submitting ? (
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
                        Cập nhật đơn hàng
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/orders')}
                    className="w-full mt-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  >
                    Hủy và quay lại
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;

import React from 'react';
import { PhanCongCalendarDto } from '../../types/phancongdichvu';

interface PhanCongEventModalProps {
    event: PhanCongCalendarDto | null;
    isOpen: boolean;
    onClose: () => void;
}

const PhanCongEventModal: React.FC<PhanCongEventModalProps> = ({ event, isOpen, onClose }) => {
    if (!event) return null;

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thông tin yêu cầu */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Thông tin yêu cầu
                            </h3>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mã yêu cầu</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.yeuCauId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Loại dịch vụ</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.loaiDichVu}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mô tả</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.moTaYeuCau}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày phân công</p>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {new Date(event.ngayPhanCong).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Trạng thái</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.trangThaiPhanCong}</p>
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Thông tin sản phẩm
                            </h3>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mã sản phẩm</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.sanPhamId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tên sản phẩm</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.tenSanPham}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mô tả sản phẩm</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.moTaSanPham}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Giá sản phẩm</p>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {event.giaSanPham?.toLocaleString('vi-VN') ?? '0'} VNĐ
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Thời gian bảo hành</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.thoiGianBaoHanh} tháng</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày hết hạn bảo hành</p>
                                <p className="text-base text-gray-900 dark:text-white">{new Date(event.ngayHetHanBaoHanh).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>

                        {/* Thông tin khách hàng */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Thông tin khách hàng
                            </h3>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tên khách hàng</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.tenKhachHang}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.soDienThoaiKhachHang}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                                <p className="text-base text-gray-900 dark:text-white">{event.diaChiKhachHang}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhanCongEventModal; 
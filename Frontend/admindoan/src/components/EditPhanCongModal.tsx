import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { PhanCongDichVuDto } from '../types/phancongdichvu';

interface EditPhanCongModalProps {
    open: boolean;
    onClose: () => void;
    phanCong: PhanCongDichVuDto;
    onSubmit: (data: { ghiChu?: string; trangThaiPhanCong?: string; ngayXuLy?: string }) => void;
}

const EditPhanCongModal = ({ open, onClose, phanCong, onSubmit }: EditPhanCongModalProps) => {
    const [ghiChu, setGhiChu] = useState(phanCong.ghiChu || '');
    const [trangThaiPhanCong, setTrangThaiPhanCong] = useState(phanCong.trangThaiPhanCong);
    const [ngayXuLy, setNgayXuLy] = useState(
        phanCong.yeuCauDichVu?.ngayXuLy
            ? new Date(phanCong.yeuCauDichVu.ngayXuLy).toISOString().split('T')[0]
            : ''
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ghiChu: ghiChu !== phanCong.ghiChu ? ghiChu : undefined,
            trangThaiPhanCong: trangThaiPhanCong !== phanCong.trangThaiPhanCong ? trangThaiPhanCong : undefined,
            ngayXuLy: ngayXuLy
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                        <button
                            type="button"
                            className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={onClose}
                        >
                            <span className="sr-only">Đóng</span>
                            <HiOutlineX className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                                Chỉnh sửa phân công
                            </h3>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="ghiChu" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        id="ghiChu"
                                        name="ghiChu"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                        value={ghiChu}
                                        onChange={(e) => setGhiChu(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="trangThai" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Trạng thái
                                    </label>
                                    <select
                                        id="trangThai"
                                        name="trangThai"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                        value={trangThaiPhanCong}
                                        onChange={(e) => setTrangThaiPhanCong(e.target.value)}
                                    >
                                        <option value="Đang chờ xác nhận">Đang chờ xác nhận</option>
                                        <option value="Đã xác nhận">Đã xác nhận</option>
                                        <option value="Hoàn thành">Hoàn thành</option>
                                        <option value="Đã hủy">Đã hủy</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="ngayXuLy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ngày xử lý
                                    </label>
                                    <input
                                        type="date"
                                        id="ngayXuLy"
                                        name="ngayXuLy"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                        value={ngayXuLy}
                                        onChange={(e) => setNgayXuLy(e.target.value)}
                                    />
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                    >
                                        Lưu thay đổi
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                                        onClick={onClose}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPhanCongModal; 
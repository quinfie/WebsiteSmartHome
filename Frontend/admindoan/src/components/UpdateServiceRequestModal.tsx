import React, { useState, useEffect } from 'react';
import { HiOutlineXCircle } from "react-icons/hi";
import { yeucaudichvuApi } from "../api/yeucaudichvu";
import { StatusType } from './StatusBadge';
import { YeuCauDichVuDto } from "../types/yeucaudichvu";

interface UpdateServiceRequestModalProps {
    open: boolean;
    onClose: () => void;
    item: YeuCauDichVuDto | null;
    onRefresh: () => void;
}

type UpdateType = 'trangThai' | 'chiPhi' | 'tienDo';

const UpdateServiceRequestModal: React.FC<UpdateServiceRequestModalProps> = ({
    open,
    onClose,
    item,
    onRefresh
}) => {
    if (!open || !item) return null;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentTab, setCurrentTab] = useState<UpdateType>('trangThai');

    // Form states
    const [trangThai, setTrangThai] = useState<StatusType>(item.trangThaiYeuCau || "");
    const [chiPhi, setChiPhi] = useState(item.chiPhiYeuCau || 0);
    const [moTa, setMoTa] = useState(item.moTa || "");

    useEffect(() => {
        if (open && item) {
            setTrangThai(item.trangThaiYeuCau || "");
            setChiPhi(item.chiPhiYeuCau || 0);
            setMoTa(item.moTa || "");
            setError("");
            setSuccess("");
            setCurrentTab('trangThai');
        }
    }, [item, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            switch (currentTab) {
                case 'trangThai':
                    const validTrangThai: StatusType[] = ["Đang chờ xác nhận", "Đã xác nhận", "Hoàn thành", "Đã hủy"];
                    if (!validTrangThai.includes(trangThai)) {
                        setError("Trạng thái không hợp lệ.");
                        setLoading(false);
                        return;
                    }
                    await yeucaudichvuApi.updateTrangThai(item.id, trangThai.trim());
                    setSuccess("Cập nhật trạng thái thành công!");
                    break;
                case 'chiPhi':
                    if (chiPhi < 0) {
                        setError("Chi phí không thể âm.");
                        setLoading(false);
                        return;
                    }
                    await yeucaudichvuApi.updateChiPhi(item.id, Number(chiPhi));
                    setSuccess("Cập nhật chi phí thành công!");
                    break;
                case 'tienDo':
                    await yeucaudichvuApi.updateMoTa(item.id, moTa, false);
                    setSuccess("Cập nhật mô tả thành công!");
                    break;
            }
            setTimeout(() => {
                onRefresh();
                onClose();
            }, 1000);

        } catch (err: any) {
            console.error("Update failed:", err);
            const errorMessage = err.response?.data?.errorMessage || err.message || "Đã xảy ra lỗi khi cập nhật.";
            setError("Cập nhật thất bại: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleMoTaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMoTa(e.target.value);
    };

    const renderFormContent = () => {
        switch (currentTab) {
            case 'trangThai':
                const statusOptions: StatusType[] = ["Đang chờ xác nhận", "Đã xác nhận", "Hoàn thành", "Đã hủy"];
                return (
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Trạng thái</label>
                            <select
                                id="status"
                                value={trangThai}
                                onChange={e => setTrangThai(e.target.value as StatusType)}
                                className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );
            case 'chiPhi':
                return (
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="chiPhi" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Chi phí (VNĐ)</label>
                            <input
                                id="chiPhi"
                                type="number"
                                value={chiPhi}
                                onChange={e => setChiPhi(Number(e.target.value))}
                                className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                min={0}
                            />
                        </div>
                    </div>
                );
            case 'tienDo':
                return (
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="tienDo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Mô tả</label>
                            <textarea
                                id="tienDo"
                                value={moTa}
                                onChange={handleMoTaChange}
                                rows={4}
                                className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Nhập thông tin mô tả..."
                            ></textarea>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl relative transform transition-all duration-300">
                <button
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-3xl"
                    onClick={onClose}
                >
                    <HiOutlineXCircle size={30} />
                </button>
                <h2 className="text-2xl font-bold mb-7 text-gray-800 dark:text-white text-center">Cập nhật Yêu cầu Dịch vụ</h2>

                {/* Thông tin chi tiết yêu cầu */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Thông tin yêu cầu</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sản phẩm</p>
                            <p className="text-gray-800 dark:text-white font-medium">{item.tenSanPham}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loại dịch vụ</p>
                            <p className="text-gray-800 dark:text-white font-medium">{item.loaiDichVu}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ngày hẹn</p>
                            <p className="text-gray-800 dark:text-white font-medium">
                                {item.ngayHen ? new Date(item.ngayHen).toLocaleDateString('vi-VN') : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Trạng thái hiện tại</p>
                            <p className="text-gray-800 dark:text-white font-medium">{item.trangThaiYeuCau}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mô tả</p>
                            <p className="text-gray-800 dark:text-white font-medium">{item.moTa || 'Không có mô tả'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Chi phí</p>
                            <p className="text-gray-800 dark:text-white font-medium">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.chiPhiYeuCau)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
                        <button
                            className={`flex-1 py-4 px-1 text-center text-sm font-semibold ${currentTab === 'trangThai' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'} focus:outline-none transition-colors duration-200`}
                            onClick={() => setCurrentTab('trangThai')}
                        >
                            Trạng thái
                        </button>
                        <button
                            className={`flex-1 py-4 px-1 text-center text-sm font-semibold ${currentTab === 'chiPhi' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'} focus:outline-none transition-colors duration-200`}
                            onClick={() => setCurrentTab('chiPhi')}
                        >
                            Chi phí
                        </button>
                        <button
                            className={`flex-1 py-4 px-1 text-center text-sm font-semibold ${currentTab === 'tienDo' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'} focus:outline-none transition-colors duration-200`}
                            onClick={() => setCurrentTab('tienDo')}
                        >
                            Mô tả
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderFormContent()}

                    {error && (
                        <div className="p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400 border border-red-300 dark:border-red-700" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-900 dark:text-green-400 border border-green-300 dark:border-green-700" role="alert">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateServiceRequestModal;
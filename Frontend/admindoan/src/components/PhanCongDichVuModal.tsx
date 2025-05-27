import React, { useState, useEffect } from 'react';
import { HiOutlineXCircle } from "react-icons/hi";
import { phanCongDichVuApi } from "../api/phancongdichvu";
import { nguoiDungApi } from "../api/nguoidung";
import { YeuCauDichVuDto } from "../types/yeucaudichvu";
import { NguoiDungDto } from "../types/nguoidung";
import { useAuth } from '../contexts/AuthContext';

interface PhanCongDichVuModalProps {
    open: boolean;
    onClose: () => void;
    yeuCau: YeuCauDichVuDto | null;
    onRefresh: () => void;
}

const PhanCongDichVuModal: React.FC<PhanCongDichVuModalProps> = ({
    open,
    onClose,
    yeuCau,
    onRefresh
}) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [kyThuatVienId, setKyThuatVienId] = useState("");
    const [ghiChu, setGhiChu] = useState("");
    const [kyThuatVien, setKyThuatVien] = useState<NguoiDungDto[]>([]);
    const [phanCongId, setPhanCongId] = useState<string | null>(null);
    const [trangThaiPhanCong, setTrangThaiPhanCong] = useState<string>("");

    useEffect(() => {
        const fetchKyThuatVien = async () => {
            try {
                const data = await nguoiDungApi.getKyThuatVien();
                setKyThuatVien(data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách kỹ thuật viên:", err);
                setError("Không thể lấy danh sách kỹ thuật viên");
            }
        };

        if (open) {
            fetchKyThuatVien();
        }
    }, [open]);

    useEffect(() => {
        if (yeuCau && (yeuCau as any).phanCongHienTai) {
            const pc = (yeuCau as any).phanCongHienTai;
            setPhanCongId(pc.id);
            setKyThuatVienId(pc.kyThuatVienId || "");
            setGhiChu(pc.ghiChu || "");
            setTrangThaiPhanCong(pc.trangThaiPhanCong || "");
        } else {
            setPhanCongId(null);
            setKyThuatVienId("");
            setGhiChu("");
            setTrangThaiPhanCong("");
        }
    }, [yeuCau, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!kyThuatVienId) {
                setError("Vui lòng chọn kỹ thuật viên.");
                setLoading(false);
                return;
            }

            if (!yeuCau) {
                setError("Không tìm thấy yêu cầu dịch vụ.");
                setLoading(false);
                return;
            }

            if (phanCongId) {
                // Update
                await phanCongDichVuApi.updatePhanCong({
                    id: phanCongId,
                    kyThuatVienId,
                    ghiChu,
                    trangThaiPhanCong
                });
                setSuccess("Cập nhật phân công thành công!");
            } else {
                // Create
                await phanCongDichVuApi.create({
                    yeuCauDichVuId: yeuCau.id,
                    kyThuatVienId: kyThuatVienId,
                    ghiChu: ghiChu
                });
                setSuccess("Phân công thành công!");
            }

            setTimeout(() => {
                onRefresh();
                onClose();
            }, 1000);

        } catch (err: any) {
            console.error("Phân công thất bại:", err);
            const errorMessage = err.response?.data?.errorMessage || err.message || "Đã xảy ra lỗi khi phân công.";
            setError("Phân công thất bại: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!open || !yeuCau) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all duration-300">
                <button
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-3xl"
                    onClick={onClose}
                >
                    <HiOutlineXCircle size={30} />
                </button>
                <h2 className="text-2xl font-bold mb-7 text-gray-800 dark:text-white text-center">Phân công Yêu cầu Dịch vụ</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="kyThuatVien" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Kỹ thuật viên</label>
                        <select
                            id="kyThuatVien"
                            value={kyThuatVienId}
                            onChange={e => setKyThuatVienId(e.target.value)}
                            className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="">Chọn kỹ thuật viên...</option>
                            {kyThuatVien.map(ktv => (
                                <option key={ktv.id} value={ktv.id}>
                                    {ktv.tenNguoiDung} - {ktv.soDienThoai}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="ghiChu" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Ghi chú</label>
                        <textarea
                            id="ghiChu"
                            value={ghiChu}
                            onChange={e => setGhiChu(e.target.value)}
                            rows={4}
                            className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Nhập ghi chú..."
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="trangThaiPhanCong" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Trạng thái phân công</label>
                        <select
                            id="trangThaiPhanCong"
                            value={trangThaiPhanCong}
                            onChange={e => setTrangThaiPhanCong(e.target.value)}
                            className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            disabled={!phanCongId}
                        >
                            <option value="">Chọn trạng thái...</option>
                            <option value="Đang chờ xử lý">Đang chờ xử lý</option>
                            <option value="Đang thực hiện">Đang thực hiện</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                        </select>
                    </div>

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

                    <div className="flex justify-end space-x-3">
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
                            {loading ? 'Đang phân công...' : 'Phân công'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PhanCongDichVuModal; 
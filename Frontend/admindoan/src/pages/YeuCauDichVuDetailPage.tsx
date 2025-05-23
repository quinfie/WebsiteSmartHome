import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { yeucaudichvuApi } from '../api/yeucaudichvu';
import { YeuCauDichVuDto } from '../types/yeucaudichvu';
import { Sidebar } from '../components';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import PhanCongDichVuModal from '../components/PhanCongDichVuModal';

const YeuCauDichVuDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [yeuCau, setYeuCau] = useState<YeuCauDichVuDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPhanCongModal, setShowPhanCongModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Không tìm thấy ID yêu cầu dịch vụ.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await yeucaudichvuApi.getDetailedById(id);
                setYeuCau(data);
                setLoading(false);
            } catch (err: any) {
                setError("Không thể tải chi tiết yêu cầu dịch vụ.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleRefresh = async () => {
        if (!id) return;
        try {
            const data = await yeucaudichvuApi.getDetailedById(id);
            setYeuCau(data);
        } catch (err) {
            console.error("Lỗi khi làm mới dữ liệu:", err);
        }
    };

    // Handle actions
    const handleConfirmRequest = async () => {
        if (!yeuCau || !id) return;
        try {
            // Assume a confirmation step (e.g., modal) is handled before calling this
            await yeucaudichvuApi.xacNhanYeuCau(id);
            // Optionally show a success message
            // toast.success("Xác nhận yêu cầu thành công!");
            handleRefresh(); // Refresh data
        } catch (error: any) {
            console.error("Lỗi khi xác nhận yêu cầu:", error);
            // Optionally show an error message
            // toast.error(`Lỗi: ${error.message}`);
        }
    };

    const handleCompleteRequest = async () => {
        if (!yeuCau || !id) return;
        try {
            // Assume getting the completion description is handled before calling this
            // For now, using a placeholder description
            const completionDescription = "Yêu cầu đã được hoàn thành.";
            await yeucaudichvuApi.updateMoTa(id, completionDescription, true); // isKetQua = true
            // Optionally show a success message
            // toast.success("Hoàn thành yêu cầu thành công!");
            handleRefresh(); // Refresh data
        } catch (error: any) {
            console.error("Lỗi khi hoàn thành yêu cầu:", error);
            // Optionally show an error message
            // toast.error(`Lỗi: ${error.message}`);
        }
    };

    const handleCancelRequest = async () => {
        if (!yeuCau || !id) return;
        try {
            // Assume a confirmation step (e.g., modal) is handled before calling this
            await yeucaudichvuApi.huyYeuCau(id);
            // Optionally show a success message
            // toast.success("Hủy yêu cầu thành công!");
            handleRefresh(); // Refresh data
        } catch (error: any) {
            console.error("Lỗi khi hủy yêu cầu:", error);
            // Optionally show an error message
            // toast.error(`Lỗi: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-700 dark:text-gray-300">Đang tải chi tiết...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center text-red-600">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!yeuCau) {
        return (
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center text-gray-700 dark:text-gray-300">
                    <p>Không tìm thấy yêu cầu dịch vụ.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <Sidebar />
            <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-colors"
                    >
                        <HiOutlineArrowLeft className="w-5 h-5" /> Quay lại
                    </button>
                    {user?.vaiTro === "Quản lí" && !yeuCau.daPhanCong && yeuCau.trangThaiYeuCau === "Đã xác nhận" && (
                        <button
                            onClick={() => setShowPhanCongModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Phân công
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Request and Customer Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Request Information Card */}
                        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700 flex items-center">
                                <i className="fas fa-clipboard-list mr-2 text-blue-500"></i> Thông tin Yêu cầu
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-hashtag mr-2 text-gray-400"></i> ID Yêu cầu:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white break-all">{yeuCau.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-wrench mr-2 text-blue-500"></i> Loại Dịch vụ:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.loaiDichVu ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-info-circle mr-2 text-yellow-500"></i> Trạng thái:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.trangThaiYeuCau ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-dollar-sign mr-2 text-green-500"></i> Chi phí dự kiến:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.chiPhiYeuCau?.toLocaleString('vi-VN') ?? 'N/A'} VNĐ</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-calendar-alt mr-2 text-purple-500"></i> Ngày Hẹn:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.ngayHen ? new Date(yeuCau.ngayHen).toLocaleDateString('vi-VN') : 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-calendar-check mr-2 text-teal-500"></i> Ngày Xử Lý:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">
                                        {yeuCau.ngayXuLy ? new Date(yeuCau.ngayXuLy).toLocaleDateString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-clipboard-check mr-2 text-orange-500"></i> Đã phân công:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.daPhanCong ? 'Có' : 'Không'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-comment-dots mr-2 text-indigo-500"></i> Mô tả chi tiết:</label>
                                    <dd className="mt-1 text-sm leading-6 text-gray-900 dark:text-white whitespace-pre-wrap break-all">{yeuCau.moTa ?? 'Không có mô tả chi tiết'}</dd>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information Card */}
                        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700 flex items-center">
                                <i className="fas fa-user-circle mr-2 text-green-500"></i> Thông tin Khách hàng
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-user mr-2 text-gray-400"></i> Tên khách hàng:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.khachHang?.tenNguoiDung ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-venus-mars mr-2 text-pink-500"></i> Giới tính:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.khachHang?.gioiTinh ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-id-card mr-2 text-blue-500"></i> CCCD:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.khachHang?.cccd ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-birthday-cake mr-2 text-purple-500"></i> Ngày sinh:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">
                                        {yeuCau.khachHang?.ngaySinh ? new Date(yeuCau.khachHang.ngaySinh).toLocaleDateString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-phone mr-2 text-green-500"></i> Số điện thoại:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.khachHang?.soDienThoai ?? 'N/A'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-map-marker-alt mr-2 text-red-500"></i> Địa chỉ:</label>
                                    <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white break-all">{yeuCau.khachHang?.diaChi ?? 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {yeuCau.tenSanPham && (
                            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700 flex items-center">
                                    <i className="fas fa-box mr-2 text-yellow-500"></i> Thông tin Sản phẩm liên quan
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium leading-6 text-gray-700 dark:text-gray-400 flex items-center"><i className="fas fa-tag mr-2 text-gray-400"></i> Tên sản phẩm:</label>
                                        <p className="mt-1 text-sm leading-6 text-gray-900 dark:text-white">{yeuCau.tenSanPham}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Action Buttons */}
                        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700 flex items-center">
                                <i className="fas fa-cogs mr-2 text-teal-500"></i> Thao tác
                            </h2>
                            <div className="space-y-4">
                                {/* Nút Phân công: Chỉ hiện khi là Quản lý, trạng thái 'Đang chờ xác nhận' VÀ chưa phân công */}
                                {user?.vaiTro === "Quản lí" && !yeuCau.daPhanCong && yeuCau.trangThaiYeuCau === "Đang chờ xác nhận" && (
                                    <button
                                        onClick={() => setShowPhanCongModal(true)}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <i className="fas fa-user-plus mr-2"></i> Phân công
                                    </button>
                                )}

                                {/* Nút Xác nhận yêu cầu: Chỉ hiện khi là Quản lý, trạng thái 'Đang chờ xác nhận' VÀ đã phân công */}
                                {user?.vaiTro === "Quản lí" && yeuCau.trangThaiYeuCau === "Đang chờ xác nhận" && yeuCau.daPhanCong === true && (
                                    <button
                                        onClick={handleConfirmRequest}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <i className="fas fa-check mr-2"></i> Xác nhận yêu cầu
                                    </button>
                                )}

                                {/* Nút Hoàn thành: Chỉ hiện khi là Kỹ thuật viên hoặc Quản lý, trạng thái 'Đã xác nhận' */}
                                {user?.vaiTro === "Kỹ thuật viên" && yeuCau.trangThaiYeuCau === "Đã xác nhận" && (
                                    <button
                                        onClick={handleCompleteRequest}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <i className="fas fa-check-circle mr-2"></i> Hoàn thành
                                    </button>
                                )}

                                {yeuCau.trangThaiYeuCau !== "Đã hủy" && yeuCau.trangThaiYeuCau !== "Hoàn thành" && (
                                    <button
                                        onClick={handleCancelRequest}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <i className="fas fa-times mr-2"></i> Hủy yêu cầu
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PhanCongDichVuModal
                open={showPhanCongModal}
                onClose={() => setShowPhanCongModal(false)}
                yeuCau={yeuCau}
                onRefresh={handleRefresh}
            />
        </div>
    );
};

export default YeuCauDichVuDetailPage; 
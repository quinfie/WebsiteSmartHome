import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { phanCongDichVuApi } from '../api/phancongdichvu';
import { PhanCongCalendarDto, PhanCongDichVuDto } from '../types/phancongdichvu';

const PHAN_CONG_STATUSES = [
    'Đang chờ xác nhận',
    'Đã xác nhận',
    'Hoàn thành',
    'Đã hủy',
];

const statusDescription: Record<string, string> = {
    'Đang chờ xác nhận': 'Phân công đã được tạo, chờ kỹ thuật viên xác nhận.',
    'Đã xác nhận': 'Kỹ thuật viên đã xác nhận phân công và đang trong quá trình thực hiện.',
    'Hoàn thành': 'Kỹ thuật viên đã hoàn thành phân công.',
    'Đã hủy': 'Phân công đã bị hủy.'
};

const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('hoàn thành')) {
        return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lowerStatus.includes('xác nhận')) {
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (lowerStatus.includes('chờ xác nhận')) {
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
};

const PhanCongDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [phanCong, setPhanCong] = useState<PhanCongCalendarDto | null>(null);
    const [phanCongDetail, setPhanCongDetail] = useState<PhanCongDichVuDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Lấy thông tin tổng hợp (calendar)
                const calendarData = await phanCongDichVuApi.getById(id);
                setPhanCong(calendarData);
                // Lấy thông tin phân công chi tiết
                const detailList = await phanCongDichVuApi.getByYeuCau(calendarData.yeuCauId);
                const detail = detailList.find((d: PhanCongDichVuDto) => d.id === id);
                setPhanCongDetail(detail || null);
                setNewStatus(detail?.trangThaiPhanCong || '');
            } catch (err) {
                setError('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="bg-[#0f172a] min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-[#1b2a3b] rounded w-1/4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-[#1b2a3b] rounded w-3/4"></div>
                                <div className="h-4 bg-[#1b2a3b] rounded w-1/2"></div>
                                <div className="h-4 bg-[#1b2a3b] rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="bg-[#0f172a] min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-[#182233] border border-red-500 rounded-lg p-6">
                        <div className="text-red-400">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (!phanCong) return null;

    return (
        <div className="bg-[#0f172a] min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="mb-6 text-gray-400">
                    <Link to="/dashboard" className="hover:text-white flex items-center inline-flex">
                        <i className="fas fa-home mr-1"></i> Dashboard
                    </Link>{' '}
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <Link to="/dashboard/assignrequest" className="hover:text-white">
                        Phân công dịch vụ
                    </Link>
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <Link to="/dashboard/assignrequest/calendar" className="hover:text-white">
                        Lịch phân công
                    </Link>
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <span className="text-white">Chi tiết phân công</span>
                </div>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Service Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Assignment Header */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                            <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
                                Chi tiết phân công <span className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(phanCong.trangThaiPhanCong)}`}>{phanCong.trangThaiPhanCong}</span>
                            </h1>
                            <p className="text-gray-400 text-sm mb-4">ID Phân công: {phanCong.id}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 flex items-center"><i className="fas fa-id-card mr-2 text-blue-400"></i>Mã yêu cầu</label>
                                    <p className="text-white font-medium break-all">{phanCong.yeuCauId ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 flex items-center"><i className="fas fa-receipt mr-2 text-green-400"></i>Mã đơn hàng</label>
                                    <p className="text-white font-medium break-all">{phanCong.maDonHang ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 flex items-center"><i className="fas fa-calendar-alt mr-2 text-yellow-400"></i>Ngày phân công</label>
                                    <p className="text-white font-medium">{formatDate(phanCong.ngayPhanCong)}</p>
                                </div>
                                {phanCong.ngayHoanThanh && (
                                    <div>
                                        <label className="text-sm text-gray-400 flex items-center"><i className="fas fa-calendar-check mr-2 text-green-400"></i>Ngày hoàn thành</label>
                                        <p className="text-white font-medium">{formatDate(phanCong.ngayHoanThanh)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Assignment Status Card */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                                Trạng thái phân công
                            </h2>
                            <div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(phanCong.trangThaiPhanCong)}`}>
                                    {phanCong.trangThaiPhanCong}
                                </span>
                                <p className="text-gray-400 mt-2">
                                    {statusDescription[phanCong.trangThaiPhanCong] || ''}
                                </p>
                            </div>
                        </div>
                        {/* Technician Information Card (from phanCongDetail) */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="fas fa-user-cog text-purple-400 mr-2"></i>
                                Thông tin kỹ thuật viên
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Tên kỹ thuật viên</label>
                                    <p className="text-white font-medium">{phanCongDetail?.kyThuatVien?.tenNguoiDung ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Email</label>
                                    <p className="text-white font-medium">{phanCongDetail?.kyThuatVien?.email ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Số điện thoại</label>
                                    <p className="text-white font-medium">{phanCongDetail?.kyThuatVien?.soDienThoai ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Ghi chú phân công</label>
                                    <p className="text-white font-medium">{phanCongDetail?.ghiChu ?? 'Không có ghi chú'}</p>
                                </div>
                            </div>
                        </div>
                        {/* Service Information Card */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="fas fa-tools text-blue-400 mr-2"></i>
                                Chi tiết yêu cầu dịch vụ
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 flex items-center"><i className="fas fa-wrench mr-2 text-blue-400"></i>Loại dịch vụ</label>
                                    <p className="text-white font-medium">{phanCong.loaiDichVu ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 flex items-center"><i className="fas fa-wrench mr-2 text-blue-400"></i>Trạng thái yêu cầu</label>
                                    <p className="text-white font-medium">{phanCong.trangThaiPhanCong ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 flex items-center"><i className="fas fa-comment-alt mr-2 text-gray-400"></i>Mô tả yêu cầu</label>
                                    <p className="text-white font-medium break-all">{phanCong.moTaYeuCau ?? 'Không có mô tả'}</p>
                                </div>
                            </div>
                        </div>
                        {/* Customer Information Card */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="fas fa-user text-green-400 mr-2"></i>
                                Thông tin khách hàng
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Tên khách hàng</label>
                                    <p className="text-white font-medium">{phanCong.tenKhachHang}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Số điện thoại</label>
                                    <p className="text-white font-medium">{phanCong.soDienThoaiKhachHang}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Địa chỉ</label>
                                    <p className="text-white font-medium">{phanCong.diaChiKhachHang}</p>
                                </div>
                            </div>
                        </div>
                        {/* Product Information Card */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="fas fa-box-open text-yellow-400 mr-2"></i>
                                Thông tin sản phẩm
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Mã sản phẩm</label>
                                    <p className="text-white font-medium">{phanCong.sanPhamId}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Tên sản phẩm</label>
                                    <p className="text-white font-medium">{phanCong.tenSanPham}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Mô tả sản phẩm</label>
                                    <p className="text-white font-medium">{phanCong.moTaSanPham}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Giá sản phẩm</label>
                                    <p className="text-white font-medium">{phanCong.giaSanPham?.toLocaleString('vi-VN') ?? 'N/A'} VNĐ</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Thời gian bảo hành</label>
                                    <p className="text-white font-medium">{phanCong.thoiGianBaoHanh ?? 'N/A'} tháng</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Ngày hết hạn bảo hành</label>
                                    <p className="text-white font-medium">{phanCong.ngayHetHanBaoHanh ? new Date(phanCong.ngayHetHanBaoHanh).toLocaleDateString('vi-VN') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Quay lại */}
                        <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                            <button
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => window.history.back()}
                            >
                                <i className="fas fa-arrow-left mr-2"></i>
                                Quay lại
                            </button>
                        </div>
                        {/* Cập nhật trạng thái */}
                        {phanCongDetail && phanCongDetail.trangThaiPhanCong !== 'Hoàn thành' && (
                            <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                                <button
                                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                                    onClick={() => setShowUpdateModal(true)}
                                >
                                    <i className="fas fa-sync-alt mr-2"></i>
                                    Cập nhật trạng thái
                                </button>
                            </div>
                        )}
                        {/* Modal cập nhật trạng thái */}
                        {showUpdateModal && phanCongDetail && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                                <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                                    <h3 className="text-lg font-bold mb-4">Cập nhật trạng thái phân công</h3>
                                    <select
                                        className="w-full p-2 border rounded mb-4"
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value)}
                                    >
                                        {PHAN_CONG_STATUSES.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="px-4 py-2 bg-gray-200 rounded"
                                            onClick={() => setShowUpdateModal(false)}
                                        >Hủy</button>
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded"
                                            disabled={updating}
                                            onClick={async () => {
                                                setUpdating(true);
                                                try {
                                                    await phanCongDichVuApi.updateTrangThai(phanCongDetail.id, newStatus);
                                                    setPhanCongDetail({ ...phanCongDetail, trangThaiPhanCong: newStatus });
                                                    setShowUpdateModal(false);
                                                } finally {
                                                    setUpdating(false);
                                                }
                                            }}
                                        >Lưu</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhanCongDetailPage; 
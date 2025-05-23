import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios.config';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ServiceRequestDetail {
    id: string;
    tieuDe: string;
    moTa: string;
    trangThai: string;
    loaiDichVu: string;
    ngayTao: string;
    chiPhi?: number;
    nhanVienPhuTrach?: string;
    ghiChu?: string;
}

export default function ServiceRequestDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState<ServiceRequestDetail | null>(null);

    useEffect(() => {
        if (id && user?.id) {
            fetchRequestDetail();
        }
    }, [id, user]);

    const fetchRequestDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/YeuCauDichVu/${id}`);
            if (response.data?.data) {
                setRequest(response.data.data);
            }
        } catch (error) {
            toast.error('Không thể tải thông tin yêu cầu dịch vụ');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ChoXacNhan': return 'bg-orange-100 text-orange-800';
            case 'DaXacNhan': return 'bg-blue-100 text-blue-800';
            case 'DangXuLy': return 'bg-purple-100 text-purple-800';
            case 'HoanThanh': return 'bg-green-100 text-green-800';
            case 'DaHuy': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTimelineItemStyle = (status: string, currentStatus: string) => {
        if (status === currentStatus) return 'bg-blue-500';
        if (status === 'ChoXacNhan' && currentStatus === 'DaHuy') return 'bg-red-500';

        const statusOrder = ['ChoXacNhan', 'DaXacNhan', 'DangXuLy', 'HoanThanh'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const itemIndex = statusOrder.indexOf(status);

        if (itemIndex < currentIndex) return 'bg-green-500';
        return 'bg-gray-300';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy yêu cầu dịch vụ</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Chi tiết yêu cầu dịch vụ</h3>
                </div>
                <div className="px-6 py-4">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Tiêu đề</dt>
                            <dd className="mt-1 text-sm text-gray-900">{request.tieuDe}</dd>
                        </div>
                        <div className="col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
                            <dd className="mt-1 text-sm text-gray-900">{request.moTa}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Loại dịch vụ</dt>
                            <dd className="mt-1">
                                <span className={`inline-flex px-2 py-1 text-sm rounded-full ${request.loaiDichVu === 'BaoHanh'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {request.loaiDichVu === 'BaoHanh' ? 'Bảo hành' : 'Sửa chữa'}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                            <dd className="mt-1">
                                <span className={`inline-flex px-2 py-1 text-sm rounded-full ${getStatusColor(request.trangThai)}`}>
                                    {request.trangThai}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {new Date(request.ngayTao).toLocaleDateString('vi-VN')}
                            </dd>
                        </div>
                        {request.nhanVienPhuTrach && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Nhân viên phụ trách</dt>
                                <dd className="mt-1 text-sm text-gray-900">{request.nhanVienPhuTrach}</dd>
                            </div>
                        )}
                        {request.chiPhi !== undefined && request.chiPhi > 0 && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Chi phí dự kiến</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(request.chiPhi)}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Tiến độ xử lý</h3>
                </div>
                <div className="px-6 py-4">
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="space-y-8 relative">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 bg-green-500`}>
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">Tạo yêu cầu</div>
                                    <div className="text-sm text-gray-500">{new Date(request.ngayTao).toLocaleDateString('vi-VN')}</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${getTimelineItemStyle('DaXacNhan', request.trangThai)}`}>
                                    {request.trangThai !== 'ChoXacNhan' && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">Xác nhận yêu cầu</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${getTimelineItemStyle('DangXuLy', request.trangThai)}`}>
                                    {request.trangThai === 'DangXuLy' && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {['HoanThanh'].includes(request.trangThai) && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">Đang xử lý</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${getTimelineItemStyle('HoanThanh', request.trangThai)}`}>
                                    {request.trangThai === 'HoanThanh' && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">Hoàn thành</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {request.ghiChu && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Ghi chú</h3>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-sm text-gray-900">{request.ghiChu}</p>
                    </div>
                </div>
            )}
        </div>
    );
} 
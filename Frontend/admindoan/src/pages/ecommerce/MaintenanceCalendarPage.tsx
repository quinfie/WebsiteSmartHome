import React, { useEffect, useState } from 'react';
import MaintenanceCalendar from '../../components/Calendar/MaintenanceCalendar';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUserDonHang } from '../../api/donhang';
import api from '../../api/axios.config';

interface MaintenanceEvent {
    id: string;
    tenSanPham: string;
    ngayBaoTri: string;
    loaiBaoTri: string;
    trangThai: string;
}

export default function MaintenanceCalendarPage() {
    const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchMaintenanceEvents = async () => {
            try {
                setLoading(true);
                setError('');

                const donHangs = await getCurrentUserDonHang();

                if (!donHangs || donHangs.length === 0) {
                    setMaintenanceEvents([]);
                    setLoading(false);
                    return;
                }

                let allEvents: MaintenanceEvent[] = [];

                // Lấy chi tiết đơn hàng và lịch bảo trì
                for (const donHang of donHangs) {
                    try {
                        const chiTietResponse = await api.get(`/ChiTietDonHang/don-hang/${donHang.id}`);

                        if (chiTietResponse.data?.data && Array.isArray(chiTietResponse.data.data)) {
                            for (const chiTiet of chiTietResponse.data.data) {
                                try {
                                    const lichBaoTriResponse = await api.get(`/lich_bao_tri/chitietdonhang/${chiTiet.id}`);

                                    if (lichBaoTriResponse.data?.data && Array.isArray(lichBaoTriResponse.data.data)) {
                                        // Lấy tên sản phẩm
                                        let tenSanPham = 'Sản phẩm không xác định';
                                        if (chiTiet.maSanPham) {
                                            try {
                                                const sanPhamResponse = await api.get(`/SanPham/${chiTiet.maSanPham}`);
                                                if (sanPhamResponse?.data?.data?.tenSanPham) {
                                                    tenSanPham = sanPhamResponse.data.data.tenSanPham;
                                                }
                                            } catch (error) {
                                                console.error('Lỗi khi lấy thông tin sản phẩm:', error);
                                            }
                                        }

                                        // Thêm events vào danh sách
                                        const events = lichBaoTriResponse.data.data.map((lbt: any) => ({
                                            id: lbt.id,
                                            tenSanPham,
                                            ngayBaoTri: lbt.ngayBaoTri,
                                            loaiBaoTri: lbt.loaiBaoTri,
                                            trangThai: lbt.trangThai
                                        }));

                                        allEvents = [...allEvents, ...events];
                                    }
                                } catch (error) {
                                    console.error('Lỗi khi lấy lịch bảo trì:', error);
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
                    }
                }

                // Sắp xếp lịch bảo trì theo ngày
                const sortedEvents = allEvents.sort((a, b) =>
                    new Date(a.ngayBaoTri).getTime() - new Date(b.ngayBaoTri).getTime()
                );

                setMaintenanceEvents(sortedEvents);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                setError('Không thể tải dữ liệu lịch bảo trì. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchMaintenanceEvents();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="bg-[#0f172a] min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-[#1b2a3b] rounded w-1/4"></div>
                            <div className="grid grid-cols-7 gap-4">
                                {[...Array(35)].map((_, index) => (
                                    <div key={index} className="h-24 bg-[#1b2a3b] rounded"></div>
                                ))}
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

    return <MaintenanceCalendar maintenanceEvents={maintenanceEvents} />;
} 
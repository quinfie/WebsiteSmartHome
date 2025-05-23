import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { phanCongDichVuApi } from '../api/phancongdichvu';
import { PhanCongCalendarDto } from '../types/phancongdichvu';
import { useAuth } from '../contexts/AuthContext';
import PhanCongCalendarComponent from "../components/Calendar/PhanCongCalendarComponent";

const PhanCongCalendarPage: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<PhanCongCalendarDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                if (!user?.id) {
                    throw new Error('Không tìm thấy ID kỹ thuật viên');
                }
                const data = await phanCongDichVuApi.getPhanCongCalendarByKyThuatVien(user.id);
                setEvents(data);

                // Tính toán thống kê
                setStats({
                    total: data.length,
                    completed: data.filter(e => e.trangThaiPhanCong.toLowerCase() === 'đã hoàn thành').length,
                    pending: data.filter(e => e.trangThaiPhanCong.toLowerCase() !== 'đã hoàn thành').length
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
                <div className="text-white">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

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
                    <span className="text-white">Lịch phân công</span>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Tổng số phân công</p>
                                <p className="text-white text-2xl font-bold">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                                <i className="fas fa-tasks text-blue-400 text-xl"></i>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Đã hoàn thành</p>
                                <p className="text-white text-2xl font-bold">{stats.completed}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center">
                                <i className="fas fa-check text-green-400 text-xl"></i>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Đang chờ xử lý</p>
                                <p className="text-white text-2xl font-bold">{stats.pending}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-900 rounded-full flex items-center justify-center">
                                <i className="fas fa-clock text-yellow-400 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <PhanCongCalendarComponent phanCongEvents={events} />
            </div>
        </div>
    );
};

export default PhanCongCalendarPage; 
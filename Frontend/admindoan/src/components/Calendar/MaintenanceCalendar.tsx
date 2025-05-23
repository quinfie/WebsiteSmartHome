import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MaintenanceEventModal from './MaintenanceEventModal';

interface MaintenanceEvent {
    id: string;
    tenSanPham: string;
    ngayBaoTri: string;
    loaiBaoTri: string;
    trangThai: string;
}

interface CalendarDay {
    date: Date;
    events: MaintenanceEvent[];
    isCurrentMonth: boolean;
}

interface MaintenanceCalendarProps {
    maintenanceEvents: MaintenanceEvent[];
}

type ViewMode = 'month' | 'week' | 'day';

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ maintenanceEvents }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendar, setCalendar] = useState<CalendarDay[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [selectedEvent, setSelectedEvent] = useState<MaintenanceEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Tạo calendar grid
    useEffect(() => {
        const generateCalendar = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const date = currentDate.getDate();
            const day = currentDate.getDay();

            let startDate = new Date(currentDate);
            let daysToShow = 42; // Month view: 6 weeks

            if (viewMode === 'week') {
                // Week view: Start from Sunday of current week
                startDate.setDate(date - day);
                daysToShow = 7;
            } else if (viewMode === 'day') {
                // Day view: Only current date
                startDate = new Date(year, month, date);
                daysToShow = 1;
            } else {
                // Month view: Start from the first day of the month
                startDate = new Date(year, month, 1);
                startDate.setDate(startDate.getDate() - startDate.getDay());
            }

            const calendarDays: CalendarDay[] = [];

            for (let i = 0; i < daysToShow; i++) {
                const currentDay = new Date(startDate);
                currentDay.setDate(startDate.getDate() + i);

                // Lọc các sự kiện cho ngày này
                const dayEvents = maintenanceEvents.filter(event => {
                    const eventDate = new Date(event.ngayBaoTri);
                    return eventDate.toDateString() === currentDay.toDateString();
                });

                calendarDays.push({
                    date: currentDay,
                    events: dayEvents,
                    isCurrentMonth: currentDay.getMonth() === month
                });
            }

            setCalendar(calendarDays);
        };

        generateCalendar();
    }, [currentDate, maintenanceEvents, viewMode]);

    const navigate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const handleEventClick = (event: MaintenanceEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const getViewTitle = () => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            year: 'numeric'
        };

        if (viewMode === 'week') {
            const weekStart = calendar[0]?.date;
            const weekEnd = calendar[6]?.date;
            if (weekStart && weekEnd) {
                return `${weekStart.getDate()} - ${weekEnd.getDate()} ${weekStart.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`;
            }
        } else if (viewMode === 'day') {
            return currentDate.toLocaleDateString('vi-VN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }

        return currentDate.toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="bg-[#0f172a] min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="mb-6 text-gray-400">
                    <Link to="/ecommerce" className="hover:text-white flex items-center inline-flex">
                        <i className="fas fa-home mr-1"></i> Trang chủ
                    </Link>{' '}
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <Link to="/ecommerce/warranty" className="hover:text-white">
                        Lịch bảo trì của tôi
                    </Link>
                    <i className="fas fa-chevron-right text-xs mx-2"></i>{' '}
                    <span className="text-white">Lịch</span>
                </div>

                {/* Calendar Header */}
                <div className="bg-[#182233] border border-[#243447] rounded-lg p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <i className="fas fa-calendar text-yellow-500 mr-3"></i>
                            Lịch bảo trì
                        </h1>

                        {/* View mode switcher */}
                        <div className="flex items-center space-x-2 bg-[#1b2a3b] rounded-lg p-1">
                            {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === mode
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {mode === 'month' && 'Tháng'}
                                    {mode === 'week' && 'Tuần'}
                                    {mode === 'day' && 'Ngày'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('prev')}
                            className="p-2 text-gray-400 hover:text-white"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <h2 className="text-xl text-white font-medium">
                            {getViewTitle()}
                        </h2>
                        <button
                            onClick={() => navigate('next')}
                            className="p-2 text-gray-400 hover:text-white"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className={`grid ${viewMode === 'month' ? 'grid-cols-7' :
                        viewMode === 'week' ? 'grid-cols-7' :
                            'grid-cols-1'
                        } gap-px bg-[#243447] rounded-lg overflow-hidden`}>
                        {/* Weekday headers */}
                        {(viewMode === 'month' || viewMode === 'week') && (
                            <>
                                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                                    <div
                                        key={day}
                                        className="bg-[#1b2a3b] p-4 text-center text-sm font-medium text-gray-400"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Calendar days */}
                        {calendar.map((day, index) => (
                            <div
                                key={index}
                                className={`${viewMode === 'day' ? 'min-h-[400px]' : 'min-h-[120px]'
                                    } bg-[#182233] p-2 ${!day.isCurrentMonth && viewMode === 'month' ? 'opacity-50' : ''
                                    } ${day.date.toDateString() === new Date().toDateString()
                                        ? 'ring-2 ring-blue-500'
                                        : ''
                                    }`}
                            >
                                <div className="text-sm text-gray-400 mb-1">
                                    {viewMode === 'day' ? (
                                        <span className="text-lg">
                                            {day.date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric' })}
                                        </span>
                                    ) : (
                                        day.date.getDate()
                                    )}
                                </div>
                                <div className={viewMode === 'day' ? 'space-y-2' : ''}>
                                    {day.events.map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={() => handleEventClick(event)}
                                            className={`mb-1 p-2 text-xs rounded bg-blue-900 text-white cursor-pointer hover:bg-blue-800 transition-colors ${viewMode === 'day' ? 'p-3' : ''
                                                }`}
                                            title={`${event.tenSanPham} - ${event.loaiBaoTri}`}
                                        >
                                            <div className={`truncate ${viewMode === 'day' ? 'text-sm' : ''}`}>
                                                {event.tenSanPham}
                                            </div>
                                            <div className={`truncate text-blue-300 ${viewMode === 'day' ? 'text-sm mt-1' : ''}`}>
                                                {event.loaiBaoTri}
                                            </div>
                                            {viewMode === 'day' && (
                                                <div className="mt-2 text-xs">
                                                    <span className={`px-2 py-1 rounded-full ${event.trangThai.toLowerCase() === 'đã thông báo'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {event.trangThai}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-[#182233] border border-[#243447] rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                        Chú thích
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-900 rounded mr-2"></div>
                            <span className="text-gray-300">Lịch bảo trì</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 ring-2 ring-blue-500 rounded mr-2"></div>
                            <span className="text-gray-300">Ngày hiện tại</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceCalendar; 
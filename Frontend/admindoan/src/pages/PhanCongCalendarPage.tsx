import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { phanCongDichVuApi } from "../api/phancongdichvu";
import { PhanCongCalendarDto } from "../types/phancongdichvu";
import PhanCongCalendarComponent from "../components/Calendar/PhanCongCalendarComponent";
import { Sidebar } from "../components";
import { useParams } from "react-router-dom";

const PhanCongCalendarPage = () => {
    const { user } = useAuth();
    const { kyThuatVienId: userIdFromUrl } = useParams<{ kyThuatVienId?: string }>();
    const [events, setEvents] = useState<PhanCongCalendarDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCalendar = async () => {
            console.log("User info from AuthContext:", {
                maNguoiDung: user?.maNguoiDung,
                vaiTro: user?.vaiTro,
                id: user?.id,
                token: localStorage.getItem('token')
            });
            console.log("User ID from URL:", userIdFromUrl);

            const idToFetch = userIdFromUrl || user?.maNguoiDung;

            if (!idToFetch) {
                setError("Không tìm thấy ID kỹ thuật viên để xem lịch.");
                setLoading(false);
                return;
            }

            if (!userIdFromUrl && user?.vaiTro !== 'Nhân Viên') {
                setError("Bạn không có quyền xem lịch phân công. Chỉ nhân viên mới có quyền xem lịch của mình.");
                setLoading(false);
                return;
            }

            if (userIdFromUrl && (user?.vaiTro === 'Quản Trị Viên' || user?.vaiTro === 'Quản Lí')) {
                // Proceed to fetch for userIdFromUrl
            } else if (userIdFromUrl && user?.vaiTro === 'Nhân Viên' && userIdFromUrl !== user?.maNguoiDung) {
                setError("Bạn không có quyền xem lịch phân công của kỹ thuật viên khác.");
                setLoading(false);
                return;
            } else if (!userIdFromUrl && user?.vaiTro !== 'Nhân Viên') {
                setError("Bạn không có quyền xem lịch phân công. Chỉ nhân viên mới có quyền xem lịch của mình.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                console.log("Fetching calendar for ID:", idToFetch);
                const data = await phanCongDichVuApi.getPhanCongCalendarByKyThuatVien(idToFetch);
                console.log("Calendar API response:", data);
                setEvents(data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu calendar:", err);
                setError("Có lỗi xảy ra khi tải dữ liệu lịch phân công");
            } finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [user?.maNguoiDung, user?.vaiTro, userIdFromUrl]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải lịch phân công...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <p className="text-red-500 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Lịch phân công</h1>
                    <PhanCongCalendarComponent
                        phanCongEvents={events}
                    />
                </div>
            </div>
        </div>
    );
};

export default PhanCongCalendarPage; 
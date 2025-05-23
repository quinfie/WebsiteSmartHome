import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "../components";
import { useDanhGia } from "../contexts/DanhGiaContext";
import { DanhGiaDetailDto } from "../types/danhgia";
import {
    HiOutlineArrowLeft,
    HiOutlineStar,
    HiOutlineUser,
    HiOutlineShoppingCart,
    HiOutlineCube,
    HiOutlineCalendar,
    HiOutlineChat,
    HiOutlineTrash
} from "react-icons/hi";

const DanhGiaDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { getDetailById, deleteDanhGia } = useDanhGia();
    const [danhGia, setDanhGia] = useState<DanhGiaDetailDto | null>(location.state?.detail || null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (location.state?.detail) {
            setLoading(false);
            return;
        }
        if (!id) return;
        getDetailById(id as string)
            .then((data) => setDanhGia(data))
            .finally(() => setLoading(false));
    }, [id, getDetailById, location.state]);

    const handleDelete = async () => {
        if (!danhGia?.id) return;

        if (window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) {
            setDeleting(true);
            try {
                const success = await deleteDanhGia(danhGia.id);
                if (success) {
                    navigate("/dashboard/reviews");
                }
            } catch (error) {
                console.error("Error deleting review:", error);
            } finally {
                setDeleting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!danhGia) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Không tìm thấy đánh giá</h2>
                    <button
                        onClick={() => navigate("/dashboard/reviews")}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return "N/A";
        }
    };

    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <button
                        onClick={() => navigate("/dashboard/reviews")}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                        <HiOutlineArrowLeft className="mr-2" />
                        Quay lại danh sách đánh giá
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        <HiOutlineTrash className="mr-2" />
                        {deleting ? "Đang xóa..." : "Xóa đánh giá"}
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        Chi tiết đánh giá
                    </h1>

                    {/* Rating Information */}
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <HiOutlineStar className="text-yellow-500 text-2xl" />
                            <span className="text-xl font-semibold text-gray-800 dark:text-white">
                                {danhGia.soSao} sao
                            </span>
                        </div>
                        <div className="flex items-start gap-2">
                            <HiOutlineChat className="text-gray-500 mt-1" />
                            <p className="text-gray-600 dark:text-gray-300">
                                {danhGia.noiDung || "Không có nội dung đánh giá"}
                            </p>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            <HiOutlineCalendar className="inline mr-2" />
                            Ngày đánh giá: {formatDate(danhGia.ngayDanhGia)}
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <HiOutlineUser className="mr-2 text-blue-500" />
                            Thông tin người dùng
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mã người dùng</p>
                                <p className="font-medium text-gray-800 dark:text-white">{danhGia.maNguoiDung}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tên người dùng</p>
                                <p className="font-medium text-gray-800 dark:text-white">{danhGia.tenNguoiDung}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <HiOutlineShoppingCart className="mr-2 text-green-500" />
                            Thông tin đơn hàng
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mã đơn hàng</p>
                                <p className="font-medium text-gray-800 dark:text-white">{danhGia.maDonHang}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày đặt hàng</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {danhGia.ngayDatHang ? formatDate(danhGia.ngayDatHang) : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <HiOutlineCube className="mr-2 text-purple-500" />
                            Thông tin sản phẩm
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mã sản phẩm</p>
                                <p className="font-medium text-gray-800 dark:text-white">{danhGia.maSanPham}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tên sản phẩm</p>
                                <p className="font-medium text-gray-800 dark:text-white">{danhGia.tenSanPham}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DanhGiaDetail; 
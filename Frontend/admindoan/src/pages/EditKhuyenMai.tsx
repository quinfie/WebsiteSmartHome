import React, { useState, useEffect } from "react";
import { Sidebar } from "../components";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { KhuyenMaiDto } from "../types/khuyenmai";
import { getKhuyenMaiById, updateKhuyenMai } from "../api/khuyenmai";
import { toast } from "react-hot-toast";

const EditKhuyenMai = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        tenKhuyenMai: "",
        phanTramGiam: "",
        ngayBatDau: "",
        ngayKetThuc: ""
    });

    useEffect(() => {
        const loadKhuyenMai = async () => {
            try {
                if (!id) return;
                const data = await getKhuyenMaiById(id);
                console.log("Data from backend:", data);
                // Format the date strings to work with date input
                const formatDateForInput = (dateString: string) => {
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
                };

                setFormData({
                    tenKhuyenMai: data.tenKhuyenMai,
                    phanTramGiam: data.phanTramGiam.toString(),
                    ngayBatDau: formatDateForInput(data.ngayBatDau),
                    ngayKetThuc: formatDateForInput(data.ngayKetThuc)
                });
            } catch (error: any) {
                const errorMessage = error?.response?.data?.errorMessage || "Không thể tải thông tin khuyến mãi";
                toast.error(errorMessage);
                navigate("/dashboard/promotions");
            } finally {
                setIsLoading(false);
            }
        };

        loadKhuyenMai();
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            // Validate form data
            if (!formData.tenKhuyenMai.trim()) {
                toast.error("Vui lòng nhập tên khuyến mãi");
                return;
            }

            const phanTramGiam = parseFloat(formData.phanTramGiam);
            if (isNaN(phanTramGiam) || phanTramGiam < 1 || phanTramGiam > 100) {
                toast.error("Phần trăm giảm phải từ 1-100%");
                return;
            }

            if (!formData.ngayBatDau || !formData.ngayKetThuc) {
                toast.error("Vui lòng chọn ngày bắt đầu và kết thúc");
                return;
            }

            const ngayBatDau = new Date(formData.ngayBatDau);
            const ngayKetThuc = new Date(formData.ngayKetThuc);
            const now = new Date();

            if (ngayBatDau >= ngayKetThuc) {
                toast.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
                return;
            }

            if (ngayKetThuc < now) {
                toast.error("Ngày kết thúc không được nhỏ hơn ngày hiện tại");
                return;
            }

            if (!id) return;

            // Format dates in the simplest possible way
            const requestData = {
                id: id, // Add the ID to the request body
                tenKhuyenMai: formData.tenKhuyenMai,
                phanTramGiam: phanTramGiam,
                ngayBatDau: new Date(formData.ngayBatDau).toISOString(),
                ngayKetThuc: new Date(formData.ngayKetThuc).toISOString()
            };

            try {
                console.log("Request data:", JSON.stringify(requestData, null, 2));
                const response = await updateKhuyenMai(id, requestData);
                console.log("Response:", response);
                toast.success("Cập nhật khuyến mãi thành công!");
                setTimeout(() => navigate("/dashboard/promotions"), 1500);
            } catch (error: any) {
                console.error("Error object:", error);
                console.error("Error response:", error?.response);
                console.error("Error data:", error?.response?.data);
                const errorMessage = error?.response?.data?.title ||
                    error?.response?.data?.message ||
                    error?.message ||
                    "Cập nhật khuyến mãi thất bại";
                toast.error(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.errorMessage || "Cập nhật khuyến mãi thất bại";
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return (
            <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary min-h-screen">
                <Sidebar />
                <div className="dark:bg-blackPrimary bg-whiteSecondary w-full p-10">
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary min-h-screen">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
                <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
                    {/* Header */}
                    <div className="px-4 sm:px-6 lg:px-8 mb-8">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                Chỉnh sửa khuyến mãi
                            </h2>
                            <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                                <span>Bảng điều khiển</span>{" "}
                                <HiOutlineChevronRight className="text-lg mx-1" />{" "}
                                <span>Khuyến mãi</span>{" "}
                                <HiOutlineChevronRight className="text-lg mx-1" />{" "}
                                <span>Chỉnh sửa</span>
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tên khuyến mãi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tenKhuyenMai}
                                        onChange={(e) => setFormData({ ...formData, tenKhuyenMai: e.target.value })}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Nhập tên khuyến mãi"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Phần trăm giảm (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.phanTramGiam}
                                        onChange={(e) => setFormData({ ...formData, phanTramGiam: e.target.value })}
                                        min="1"
                                        max="100"
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Nhập phần trăm giảm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.ngayBatDau}
                                            onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                                            className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Ngày kết thúc
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.ngayKetThuc}
                                            onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                                            className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/dashboard/promotions")}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditKhuyenMai; 
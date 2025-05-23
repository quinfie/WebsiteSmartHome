import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { Sidebar } from "../components";
import { yeucaudichvuApi } from "../api/yeucaudichvu";

const EditYeuCauDichVuPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        moTa: "",
        ngayHen: "",
        loaiDichVu: "Bảo hành",
    });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const data = await yeucaudichvuApi.getById(id!);
                setForm({
                    moTa: data.moTa || "",
                    ngayHen: data.ngayHen ? data.ngayHen.slice(0, 10) : "",
                    loaiDichVu: data.loaiDichVu || "Bảo hành",
                });
            } catch (err: any) {
                setError("Không thể tải chi tiết yêu cầu dịch vụ!");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetail();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Gọi API cập nhật (giả sử có hàm updateYeuCau)
            await yeucaudichvuApi.updateYeuCau(id!, {
                moTa: form.moTa,
                ngayHen: form.ngayHen,
                loaiDichVu: form.loaiDichVu,
            });
            alert("Cập nhật yêu cầu thành công!");
            navigate("/yeu-cau-dich-vu");
        } catch (err: any) {
            setError("Không thể cập nhật yêu cầu dịch vụ!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <Sidebar />
            <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                <button
                    className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
                    onClick={() => navigate("/yeu-cau-dich-vu")}
                >
                    <HiOutlineChevronLeft /> Quay lại danh sách
                </button>
                <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Chỉnh sửa Yêu Cầu Dịch Vụ</h2>
                    {error && <div className="mb-4 text-red-600">{error}</div>}
                    {loading ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-300">Đang tải dữ liệu...</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 mb-2">Mô tả</label>
                                <textarea
                                    name="moTa"
                                    value={form.moTa}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 mb-2">Ngày hẹn</label>
                                <input
                                    type="date"
                                    name="ngayHen"
                                    value={form.ngayHen}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 mb-2">Loại dịch vụ</label>
                                <select
                                    name="loaiDichVu"
                                    value={form.loaiDichVu}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="Bảo hành">Bảo hành</option>
                                    <option value="Sửa chữa">Sửa chữa</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all font-semibold"
                                disabled={loading}
                            >
                                Lưu thay đổi
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditYeuCauDichVuPage; 
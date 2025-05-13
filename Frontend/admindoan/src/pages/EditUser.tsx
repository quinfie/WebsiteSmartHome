import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineSave, HiOutlineUserAdd, HiOutlineChevronRight } from "react-icons/hi";
import {
    InputWithLabel,
    Sidebar,
    SimpleInput,
} from "../components";
import SelectInput from "../components/SelectInput";
import { roles } from "../utils/data";
import { nguoiDungService } from "../api/nguoiDungApi";
import { taiKhoanService } from "../api/taiKhoanApi";
import { NguoiDungDto } from "../types/nguoidung";
import { TaiKhoanDto } from "../types/taiKhoan";

const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [accountData, setAccountData] = useState<Partial<TaiKhoanDto>>({
        email: "",
        tenTaiKhoan: "",
        trangThai: "Hoạt động",
    });

    const [userData, setUserData] = useState<Partial<NguoiDungDto>>({
        tenNguoiDung: "",
        gioiTinh: "Nam",
        ngaySinh: new Date(),
        cccd: "",
        sdt: "",
        diaChi: "",
        maTaiKhoan: "",
    });

    const [hasTaiKhoan, setHasTaiKhoan] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const nguoiDungData = await nguoiDungService.getById(id);
                setUserData({
                    ...nguoiDungData,
                    ngaySinh: nguoiDungData.ngaySinh ? new Date(nguoiDungData.ngaySinh) : new Date(),
                });

                // Kiểm tra người dùng có tài khoản hay không
                if (nguoiDungData.maTaiKhoan) {
                    setHasTaiKhoan(true);
                    const taiKhoanData = await taiKhoanService.getById(nguoiDungData.maTaiKhoan);
                    setAccountData(taiKhoanData);
                }
            } catch (err: any) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", err);
                setError("Không thể tải thông tin người dùng.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAccountData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'ngaySinh') {
            setUserData(prev => ({
                ...prev,
                [name]: new Date(value)
            }));
        } else {
            setUserData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleUpdateUser = async () => {
        if (!id) return;

        setError("");
        setMessage("");
        setIsSubmitting(true);

        try {
            // Cập nhật thông tin tài khoản nếu có
            if (hasTaiKhoan && userData.maTaiKhoan && accountData.id) {
                await taiKhoanService.update(accountData.id, {
                    email: accountData.email || "",
                    tenTaiKhoan: accountData.tenTaiKhoan || "",
                    trangThai: accountData.trangThai || "Hoạt động"
                });
            }

            // Cập nhật thông tin người dùng
            await nguoiDungService.update(id, {
                tenNguoiDung: userData.tenNguoiDung || "",
                gioiTinh: userData.gioiTinh || "Nam",
                ngaySinh: userData.ngaySinh || new Date(),
                cccd: userData.cccd || "",
                sdt: userData.sdt || "",
                diaChi: userData.diaChi || ""
            });

            setMessage("Cập nhật người dùng thành công!");
            setTimeout(() => navigate("/dashboard/users"), 1500);
        } catch (err: any) {
            console.error(err);
            const errorMessage =
                err?.response?.data?.errorMessage || "Cập nhật người dùng thất bại";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary min-h-screen">
                <Sidebar />
                <div className="dark:bg-blackPrimary bg-whiteSecondary w-full flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
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
                                Chỉnh sửa người dùng
                            </h2>
                            <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                                <span>Bảng điều khiển</span>{" "}
                                <HiOutlineChevronRight className="text-lg mx-1" />{" "}
                                <span>Người dùng</span>{" "}
                                <HiOutlineChevronRight className="text-lg mx-1" />{" "}
                                <span>Chỉnh sửa</span>
                            </p>
                        </div>
                    </div>

                    {/* Thông báo lỗi/thành công */}
                    {error && (
                        <div className="px-4 sm:px-6 lg:px-8 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                            <span className="font-bold">Lỗi:</span> {error}
                        </div>
                    )}
                    {message && (
                        <div className="px-4 sm:px-6 lg:px-8 mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
                            <span className="font-bold">Thành công:</span> {message}
                        </div>
                    )}

                    {/* Form Container */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Card: Thông tin tài khoản */}
                                {hasTaiKhoan && (
                                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center gap-2 mb-6 border-b pb-3 dark:border-gray-600">
                                            <HiOutlineUserAdd className="text-2xl text-blue-500" />
                                            <h3 className="text-xl font-bold dark:text-white text-gray-800">Thông tin tài khoản</h3>
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            <InputWithLabel label="Email">
                                                <SimpleInput
                                                    type="email"
                                                    name="email"
                                                    placeholder="Nhập email..."
                                                    value={accountData.email || ''}
                                                    onChange={handleAccountChange}
                                                />
                                            </InputWithLabel>
                                            <InputWithLabel label="Tên tài khoản">
                                                <SimpleInput
                                                    type="text"
                                                    name="tenTaiKhoan"
                                                    placeholder="Nhập tên tài khoản..."
                                                    value={accountData.tenTaiKhoan || ''}
                                                    onChange={handleAccountChange}
                                                />
                                            </InputWithLabel>
                                            <InputWithLabel label="Trạng thái">
                                                <SelectInput
                                                    selectList={[
                                                        { value: 'Hoạt động', label: 'Hoạt động' },
                                                        { value: 'Khóa', label: 'Khóa' },
                                                    ]}
                                                    name="trangThai"
                                                    value={accountData.trangThai || 'Hoạt động'}
                                                    onChange={handleAccountChange}
                                                />
                                            </InputWithLabel>
                                        </div>
                                    </div>
                                )}

                                {/* Card: Thông tin người dùng */}
                                <div className={`bg-white dark:bg-gray-700 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-600 ${!hasTaiKhoan ? 'lg:col-span-2' : ''}`}>
                                    <div className="flex items-center gap-2 mb-6 border-b pb-3 dark:border-gray-600">
                                        <HiOutlineUserAdd className="text-2xl text-green-500" />
                                        <h3 className="text-xl font-bold dark:text-white text-gray-800">Thông tin người dùng</h3>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        <InputWithLabel label="Tên">
                                            <SimpleInput
                                                type="text"
                                                name="tenNguoiDung"
                                                placeholder="Nhập tên..."
                                                value={userData.tenNguoiDung || ''}
                                                onChange={handleUserChange}
                                            />
                                        </InputWithLabel>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputWithLabel label="Giới tính">
                                                <SelectInput
                                                    selectList={[
                                                        { value: 'Nam', label: 'Nam' },
                                                        { value: 'Nữ', label: 'Nữ' },
                                                        { value: 'Khác', label: 'Khác' },
                                                    ]}
                                                    name="gioiTinh"
                                                    value={userData.gioiTinh || 'Nam'}
                                                    onChange={handleUserChange}
                                                />
                                            </InputWithLabel>
                                            <InputWithLabel label="Ngày sinh">
                                                <SimpleInput
                                                    type="date"
                                                    name="ngaySinh"
                                                    value={userData.ngaySinh ? new Date(userData.ngaySinh).toISOString().split('T')[0] : ""}
                                                    onChange={handleUserChange}
                                                />
                                            </InputWithLabel>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputWithLabel label="CCCD">
                                                <SimpleInput
                                                    type="text"
                                                    name="cccd"
                                                    placeholder="Nhập CCCD..."
                                                    value={userData.cccd || ''}
                                                    onChange={handleUserChange}
                                                />
                                            </InputWithLabel>
                                            <InputWithLabel label="Số điện thoại">
                                                <SimpleInput
                                                    type="text"
                                                    name="sdt"
                                                    placeholder="Nhập số điện thoại..."
                                                    value={userData.sdt || ''}
                                                    onChange={handleUserChange}
                                                />
                                            </InputWithLabel>
                                        </div>
                                        <InputWithLabel label="Địa chỉ">
                                            <SimpleInput
                                                type="text"
                                                name="diaChi"
                                                placeholder="Nhập địa chỉ..."
                                                value={userData.diaChi || ''}
                                                onChange={handleUserChange}
                                            />
                                        </InputWithLabel>
                                    </div>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                    onClick={() => navigate("/dashboard/users")}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg flex items-center gap-2 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    onClick={handleUpdateUser}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineSave className="text-xl" />
                                            Lưu
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser; 
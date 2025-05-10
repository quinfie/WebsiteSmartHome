import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { nguoiDungService } from "../api/nguoiDungApi";
import { NguoiDungDto } from "../types/nguoiDung";
import { Sidebar, InputWithLabel, SimpleInput, WhiteButton } from "../components";
import { HiOutlineSave, HiOutlineCamera } from "react-icons/hi";
import SelectInput from "../components/SelectInput";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<NguoiDungDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      nguoiDungService.getById(id)
        .then((data) => setUser(data))
        .catch((err) => setError("Không thể lấy thông tin người dùng"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (user) {
      setUser({
        ...user,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    if (!user || !id) return;

    try {
      await nguoiDungService.update(id, user);
      setMessage("Cập nhật thành công!");
      setTimeout(() => navigate("/dashboard/users"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!user) return <div>Không tìm thấy người dùng</div>;

  return (
    <div className="flex min-h-screen dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center py-10 px-4 sm:px-8">
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 dark:text-whiteSecondary text-blackPrimary">
            Chỉnh sửa người dùng
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
            {/* Form */}
            <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithLabel label="Tên">
                <SimpleInput
                  type="text"
                  name="tenNguoiDung"
                  value={user.tenNguoiDung}
                  onChange={handleChange}
                />
              </InputWithLabel>
              <InputWithLabel label="Giới tính">
                <SelectInput
                  selectList={[
                    { value: 'Nam', label: 'Nam' },
                    { value: 'Nữ', label: 'Nữ' },
                  ]}
                  name="gioiTinh"
                  value={user.gioiTinh}
                  onChange={handleChange}
                />
              </InputWithLabel>
              <InputWithLabel label="Ngày sinh">
                <SimpleInput
                  type="date"
                  name="ngaySinh"
                  value={user.ngaySinh ? new Date(user.ngaySinh).toISOString().split('T')[0] : ""}
                  onChange={handleChange}
                />
              </InputWithLabel>
              <InputWithLabel label="CCCD">
                <SimpleInput
                  type="text"
                  name="cccd"
                  value={user.cccd}
                  onChange={handleChange}
                />
              </InputWithLabel>
              <InputWithLabel label="Số điện thoại">
                <SimpleInput
                  type="text"
                  name="sdt"
                  value={user.sdt}
                  onChange={handleChange}
                />
              </InputWithLabel>
              <InputWithLabel label="Địa chỉ">
                <SimpleInput
                  type="text"
                  name="diaChi"
                  value={user.diaChi}
                  onChange={handleChange}
                />
              </InputWithLabel>
              {/* Nút cập nhật */}
              <div className="md:col-span-2 flex justify-end mt-4">
                <WhiteButton
                  text="Cập nhật người dùng"
                  textSize="lg"
                  width="52"
                  py="4"
                  onClick={handleSubmit}
                >
                  <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                </WhiteButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
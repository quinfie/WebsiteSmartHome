import React, { useEffect, useState } from "react";
import {
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineSearch,
} from "react-icons/hi";
import {
  Pagination,
  RowsPerPage,
  Sidebar,
  UserTable,
  WhiteButton,
} from "../components";
import { AiOutlineExport } from "react-icons/ai";
import { nguoiDungService } from "../api/nguoiDungApi";
import { taiKhoanService } from "../api/taiKhoanApi";
import { useNavigate } from "react-router-dom";
import { NguoiDungDto } from "../types/nguoidung";

const Users: React.FC = () => {
  const [users, setUsers] = useState<NguoiDungDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await nguoiDungService.getAll();
      setUsers(
        data.map((u) => ({
          ...u,
          ngaySinh: u.ngaySinh ? new Date(u.ngaySinh) : new Date(0),
        }))
      );
    } catch (err: any) {
      setError("Không thể lấy danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id: string) => {
    console.log("Edit id:", id);
    navigate(`/dashboard/users/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete id:", id);

    // Xác nhận xóa người dùng
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      // Tìm người dùng trong danh sách
      const userToDelete = users.find((u) => u.id === id);

      if (!userToDelete) {
        // Nếu không tìm thấy người dùng, báo lỗi
        alert("Không tìm thấy người dùng để xóa!");
        return;
      }

      // Kiểm tra xem người dùng có tài khoản hay không
      if (userToDelete.maTaiKhoan) {
        // Nếu có tài khoản, xóa tài khoản liên quan
        try {
          await taiKhoanService.delete(userToDelete.maTaiKhoan);
          console.log("Xóa tài khoản thành công");
        } catch (err: any) {
          // Hiển thị thông báo lỗi từ BE khi xóa tài khoản
          const errorMessage =
            err?.response?.data?.errorMessage || "Lỗi khi xóa tài khoản!";
          alert(errorMessage);
          console.error("Lỗi khi xóa tài khoản:", err);
          return; // Ngừng xóa người dùng nếu xóa tài khoản thất bại
        }
      }

      // Xóa người dùng
      await nguoiDungService.delete(id);
      setUsers(users.filter((u) => u.id !== id)); // Cập nhật danh sách người dùng

      setMessage("Xóa người dùng thành công!");
      console.log("Xóa người dùng thành công");
    } catch (err: any) {
      // Hiển thị thông báo lỗi từ BE khi xóa người dùng
      const errorMessage =
        err?.response?.data?.errorMessage || "Lỗi khi xóa người dùng!";
      alert(errorMessage);
      console.error("Lỗi khi xóa người dùng:", err);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tất cả người dùng
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Bảng điều khiển</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>Tất cả người dùng</span>
              </p>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineExport className="dark:text-whiteSecondary text-blackPrimary text-base" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">Xuất</span>
              </button>
              <WhiteButton
                link="/dashboard/users/create"
                text="Thêm người dùng"
                textSize="lg"
                py="2"
                width="48"
              >
                <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
              </WhiteButton>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Tìm kiếm người dùng..."
              />
            </div>
            <div>
              <select
                className="w-60 h-10 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                name="sort"
                id="sort"
              >
                <option value="default">Sắp xếp theo</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>
          {/* Hiển thị thông báo lỗi hoặc thành công */}
          {message && (
            <div className="w-full max-w-2xl mx-auto mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <span className="font-bold">Thành công:</span> {message}
            </div>
          )}
          {error && (
            <div className="w-full max-w-2xl mx-auto mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <span className="font-bold">Lỗi:</span> {error}
            </div>
          )}
          <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
            <RowsPerPage />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;

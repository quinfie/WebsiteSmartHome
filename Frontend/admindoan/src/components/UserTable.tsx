import { useEffect } from "react";
import { useNguoiDung } from "@/contexts/NguoiDungContext";
import { formatDate } from "@/utils/formatDate";

const UserTable = () => {
  const {
    users,
    fetchUsers,
    searchTerm,
    deleteUser,
    isLoading,
    currentPage,
    rowsPerPage,
  } = useNguoiDung();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, searchTerm, currentPage, rowsPerPage]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-5">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-blackPrimary">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Tên người dùng</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-blackSecondary">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-whiteSecondary">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-whiteSecondary">{user.tenNguoiDung}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-whiteSecondary">{user.sdt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-whiteSecondary">{user.gioiTinh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-whiteSecondary">
                      {user.ngaySinh ? formatDate(user.ngaySinh) : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium flex gap-3 justify-end">
                      <a
                        href={`/users/edit-user/${user.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Sửa
                      </a>
                      <button
                        onClick={() => deleteUser((user.id))}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;

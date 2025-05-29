import React, { useEffect, useState } from "react";
import {
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineUsers
} from "react-icons/hi";
import {
  Pagination,
  RowsPerPage,
  Sidebar,
  UserTable,
  WhiteButton,
} from "../components";
import { AiOutlineExport } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useNguoiDung } from "../contexts/NguoiDungContext";

const Users: React.FC = () => {
  const {
    users,
    isLoading,
    fetchUsers,
    searchAndSortUsers,
    deleteUser,
    searchTerm,
    setSearchTerm,
    filterOptions,
    setFilterOptions,
    sortOptions,
    handleSortOptionsChange,
    totalItems
  } = useNguoiDung();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [keyword, setKeyword] = useState(searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [localFilterOptions, setLocalFilterOptions] = useState({
    gioiTinh: filterOptions.gioiTinh || '',
    tuNgaySinh: filterOptions.tuNgaySinh,
    denNgaySinh: filterOptions.denNgaySinh,
    diaChi: filterOptions.diaChi || ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (id: string) => {
    navigate(`/dashboard/users/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      await deleteUser(id);
      setMessage("Xóa người dùng thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.errorMessage || "Lỗi khi xóa người dùng!";
      setError(errorMessage);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSearch = () => {
    setFilterOptions({
      ...filterOptions,
      keyword
    });
    searchAndSortUsers();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let newSortOptions;

    // Xử lý các tùy chọn sắp xếp - Phải dùng đúng tên field như trong backend
    switch (value) {
      case 'az':
        newSortOptions = { sortBy: 'TenNguoiDung', ascending: true };
        break;
      case 'za':
        newSortOptions = { sortBy: 'TenNguoiDung', ascending: false };
        break;
      case 'newest':
        newSortOptions = { sortBy: 'NgaySinh', ascending: false };
        break;
      case 'oldest':
        newSortOptions = { sortBy: 'NgaySinh', ascending: true };
        break;
      default:
        newSortOptions = { sortBy: 'TenNguoiDung', ascending: true };
    }

    // Sử dụng handleSortOptionsChange để cập nhật và áp dụng ngay lập tức
    handleSortOptionsChange(newSortOptions);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'tuNgaySinh' || name === 'denNgaySinh') {
      setLocalFilterOptions({
        ...localFilterOptions,
        [name]: value ? new Date(value) : undefined
      });
    } else {
      setLocalFilterOptions({
        ...localFilterOptions,
        [name]: value
      });
    }
  };

  const handleApplyFilters = () => {
    // Áp dụng bộ lọc vào context và tìm kiếm
    setFilterOptions({
      ...filterOptions,
      ...localFilterOptions
    });
    searchAndSortUsers();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedOptions = {
      gioiTinh: '',
      tuNgaySinh: undefined,
      denNgaySinh: undefined,
      diaChi: ''
    };
    setLocalFilterOptions(clearedOptions);
    setFilterOptions({
      ...filterOptions,
      ...clearedOptions
    });
    searchAndSortUsers();
  };

  const getCurrentSortOption = () => {
    const { sortBy, ascending } = sortOptions;

    if (sortBy === 'TenNguoiDung' && ascending) return 'az';
    if (sortBy === 'TenNguoiDung' && !ascending) return 'za';
    if (sortBy === 'NgaySinh' && !ascending) return 'newest';
    if (sortBy === 'NgaySinh' && ascending) return 'oldest';

    return 'default';
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          {/* Header Section with Gradient */}
          <div className="relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 dark:from-blue-800/30 dark:to-purple-900/30 rounded-b-3xl transform -translate-y-1/2"></div>
            <div className="relative px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                      <HiOutlineUsers className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                      Quản lý người dùng
                    </h2>
                  </div>
                  <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                    <span>Bảng điều khiển</span>{" "}
                    <HiOutlineChevronRight className="text-lg" />{" "}
                    <span>Tất cả người dùng</span>
                  </p>
                </div>
                <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
                  <button className="dark:bg-blackPrimary bg-white/80 backdrop-blur-sm border border-gray-600 w-32 py-2 text-lg hover:border-gray-500 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-x-2 rounded-lg shadow-md">
                    <AiOutlineExport className="dark:text-whiteSecondary text-blackPrimary text-base" />
                    <span className="dark:text-whiteSecondary text-blackPrimary font-medium">Xuất</span>
                  </button>
                  <WhiteButton
                    link="/dashboard/users/create"
                    text="Thêm người dùng"
                    textSize="lg"
                    py="2"
                    width="48"
                    className="transform hover:scale-105 transition-transform duration-300 shadow-lg"
                  >
                    <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
                  </WhiteButton>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Summary */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white">
                <div>
                  <h3 className="text-xl font-semibold">Tổng người dùng</h3>
                  <p className="text-3xl font-bold mt-1">{totalItems || users.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineUser className="h-8 w-8" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white">
                <div>
                  <h3 className="text-xl font-semibold">Nam</h3>
                  <p className="text-3xl font-bold mt-1">{users.filter(u => u.gioiTinh === 'Nam').length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineUser className="h-8 w-8" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800 rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-all duration-300 text-white">
                <div>
                  <h3 className="text-xl font-semibold">Nữ</h3>
                  <p className="text-3xl font-bold mt-1">{users.filter(u => u.gioiTinh === 'Nữ').length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <HiOutlineUser className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Sort Bar */}
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
                <input
                  type="text"
                  className="w-60 h-10 border dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 rounded-lg transition-all duration-300"
                  placeholder="Tìm kiếm người dùng..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                onClick={handleSearch}
                className="h-10 px-4 bg-blue-600 text-white rounded-lg flex items-center gap-1 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                <HiOutlineSearch />
                Tìm
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-4 border rounded-lg flex items-center gap-1 transform hover:scale-105 transition-all duration-200 shadow-md
                  ${showFilters
                    ? 'bg-blue-100 border-blue-500 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400'}`}
              >
                <HiOutlineFilter />
                Bộ lọc
              </button>
            </div>
            <div>
              <select
                className="w-60 h-10 dark:bg-gray-800 bg-white border border-gray-300 dark:border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer hover:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 rounded-lg transition-all duration-300"
                name="sort"
                id="sort"
                value={getCurrentSortOption()}
                onChange={handleSort}
              >
                <option value="default">Sắp xếp theo</option>
                <option value="az">Tên A-Z</option>
                <option value="za">Tên Z-A</option>
                <option value="newest">Ngày sinh mới nhất</option>
                <option value="oldest">Ngày sinh cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="px-4 sm:px-6 lg:px-8 mt-3 bg-white dark:bg-gray-800 p-6 rounded-xl transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <HiOutlineFilter className="text-blue-500" />
                  Lọc người dùng nâng cao
                </h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <HiOutlineX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giới tính</label>
                  <select
                    name="gioiTinh"
                    value={localFilterOptions.gioiTinh}
                    onChange={handleFilterChange}
                    className="w-full h-10 border dark:bg-gray-700 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-900 rounded-lg px-3 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:border-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Từ ngày sinh</label>
                  <input
                    type="date"
                    name="tuNgaySinh"
                    value={localFilterOptions.tuNgaySinh?.toISOString().split('T')[0] || ''}
                    onChange={handleFilterChange}
                    className="w-full h-10 border dark:bg-gray-700 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-900 rounded-lg px-3 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đến ngày sinh</label>
                  <input
                    type="date"
                    name="denNgaySinh"
                    value={localFilterOptions.denNgaySinh?.toISOString().split('T')[0] || ''}
                    onChange={handleFilterChange}
                    className="w-full h-10 border dark:bg-gray-700 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-900 rounded-lg px-3 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    name="diaChi"
                    value={localFilterOptions.diaChi}
                    onChange={handleFilterChange}
                    className="w-full h-10 border dark:bg-gray-700 bg-white border-gray-300 dark:border-gray-600 dark:text-white text-gray-900 rounded-lg px-3 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:border-blue-500"
                    placeholder="Địa chỉ"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          )}

          {/* Hiển thị thông báo lỗi hoặc thành công */}
          {message && (
            <div className="px-4 sm:px-6 lg:px-8 mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md animate-fadeIn flex items-center gap-2">
              <span className="font-bold">Thành công:</span> {message}
            </div>
          )}
          {error && (
            <div className="px-4 sm:px-6 lg:px-8 mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md animate-fadeIn flex items-center gap-2">
              <span className="font-bold">Lỗi:</span> {error}
            </div>
          )}

          {/* Loading and Data Section */}
          <div className="px-4 sm:px-6 lg:px-8 mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <HiOutlineUsers className="h-12 w-12 text-blue-500 dark:text-blue-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Không có người dùng</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Không tìm thấy người dùng phù hợp với bộ lọc đã chọn.</p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                

                <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            )}
          </div>

          {/* Pagination Section */}
          {users.length > 0 && (
            <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
              <RowsPerPage />
              <Pagination />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;

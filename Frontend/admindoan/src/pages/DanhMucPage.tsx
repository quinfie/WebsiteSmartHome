import { Sidebar, TableWrapper } from "../components";
import {
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineFolder,
  HiOutlineViewGrid,
  HiOutlineEye
} from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDanhMuc } from "../contexts/DanhMucContexts";
import React from "react";
import { DanhMucDto } from "../types/danhmuc";

// Extended DanhMucDto to include soSanPham property for the table display
interface ExtendedDanhMucDto extends DanhMucDto {
  soSanPham?: number;
}

// Custom DanhMucTable component with props
const CustomDanhMucTable: React.FC<{ categories: ExtendedDanhMucDto[], isLoading: boolean, onViewProducts: (id: string) => void }> =
  ({ categories, isLoading, onViewProducts }) => {
    const { remove: deleteCategory, fetchDanhMucs: fetchCategories } = useDanhMuc();
    const [openDetailId, setOpenDetailId] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
      if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
        try {
          await deleteCategory(id);
          fetchCategories();
        } catch (error) {
          console.error("Lỗi khi xóa danh mục:", error);
        }
      }
    };

    const handleEdit = (id: string) => {
      navigate(`/dashboard/categories/${id}/edit`);
    };

    const handleToggleDetail = (id: string) => {
      setOpenDetailId(prev => prev === id ? null : id);
    };

    return (
      <div className="w-full px-0">
        <div className="overflow-x-auto w-full px-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineFolder className="text-blue-500" /> Tên danh mục
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineViewGrid className="text-green-500" /> Số sản phẩm
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineFilter className="text-purple-500" /> Thao tác
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 dark:text-white text-gray-700">Đang tải dữ liệu...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 dark:text-white text-gray-700">Không có danh mục nào.</td>
                </tr>
              ) : (
                categories.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-4 font-medium dark:text-white text-gray-700">
                        <div className="flex items-center gap-2">
                          <HiOutlineFolder className="text-blue-500 dark:text-blue-400" />
                          {item.tenDanhMuc}
                        </div>
                      </td>
                      <td className="py-4 px-4 dark:text-white text-gray-700">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {item.soSanPham || 0} sản phẩm
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                            title="Chỉnh sửa"
                            onClick={() => handleEdit(item.id)}
                          >
                            <HiOutlinePencil size={18} />
                          </button>
                          <button
                            className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                            title="Xóa"
                            onClick={() => handleDelete(item.id)}
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                          <button
                            className="p-1.5 rounded-full text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors"
                            title="Xem sản phẩm"
                            onClick={() => onViewProducts(item.id)}
                          >
                            <HiOutlineViewGrid size={18} />
                          </button>
                          <button
                            className={`p-1.5 rounded-full ${openDetailId === item.id
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                              : "text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                              } transition-colors`}
                            title={openDetailId === item.id ? "Đóng chi tiết" : "Xem chi tiết"}
                            onClick={() => handleToggleDetail(item.id)}
                          >
                            <HiOutlineEye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {openDetailId === item.id && (
                      <tr>
                        <td colSpan={3} className="py-0">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 shadow-inner border-t border-b border-blue-100 dark:border-blue-900">
                            <h4 className="font-medium text-gray-800 dark:text-white mb-3">Mô tả danh mục</h4>
                            <p className="text-gray-600 dark:text-gray-300">{item.moTa || 'Không có mô tả'}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

const Categories = () => {
  const navigate = useNavigate();
  const {
    danhMucs: categories,
    loading,
    filterOptions,
    setFilterOptions,
    sortOptions,
    handleSortOptionsChange,
    searchAndSortCategories,
    paginationInfo,
    fetchDanhMucs: fetchCategories
  } = useDanhMuc();

  const [keyword, setKeyword] = useState(filterOptions.keyword || '');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (searchKeyword: string) => {
    setFilterOptions({
      ...filterOptions,
      keyword: searchKeyword
    });
    searchAndSortCategories();
  };

  const handleSort = (value: string) => {
    let newSortOptions;

    // Xử lý các tùy chọn sắp xếp
    switch (value) {
      case 'az':
        newSortOptions = { sortBy: 'tenDanhMuc', ascending: true };
        break;
      case 'za':
        newSortOptions = { sortBy: 'tenDanhMuc', ascending: false };
        break;
      case 'moTaasc':
        newSortOptions = { sortBy: 'moTa', ascending: true };
        break;
      case 'moTadesc':
        newSortOptions = { sortBy: 'moTa', ascending: false };
        break;
      default:
        newSortOptions = { sortBy: 'tenDanhMuc', ascending: true };
    }

    // Cập nhật sortOptions và gọi API
    handleSortOptionsChange(newSortOptions);
  };

  const getCurrentSortOption = () => {
    const { sortBy, ascending } = sortOptions;

    if (sortBy === 'tenDanhMuc' && ascending) return 'az';
    if (sortBy === 'tenDanhMuc' && !ascending) return 'za';
    if (sortBy === 'moTa' && ascending) return 'moTaasc';
    if (sortBy === 'moTa' && !ascending) return 'moTadesc';

    return '';
  };

  const handleViewProducts = (categoryId: string) => {
    navigate(`/dashboard/categories/${categoryId}/products`);
  };

  // Prepare sort options for TableWrapper
  const sortOptionItems = [
    { value: 'az', label: 'Tên A-Z' },
    { value: 'za', label: 'Tên Z-A' },
    { value: 'moTaasc', label: 'Mô tả A-Z' },
    { value: 'moTadesc', label: 'Mô tả Z-A' }
  ];

  // Prepare stat cards for TableWrapper  
  const statCards = [
    {
      title: 'Tổng danh mục',
      value: paginationInfo.totalItems,
      icon: <HiOutlineFolder className="text-blue-500 dark:text-blue-400 text-xl" />,
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Có sản phẩm',
      value: categories.filter((c: ExtendedDanhMucDto) => c.soSanPham && c.soSanPham > 0).length,
      icon: <HiOutlineViewGrid className="text-green-500 dark:text-green-400 text-xl" />,
      color: 'bg-green-100 dark:bg-green-900'
    }
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Quản lý danh mục"
        subtitle="Tất cả danh mục"
        addButtonLink="/dashboard/categories/create"
        addButtonLabel="Thêm danh mục"
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm danh mục..."
        onSort={handleSort}
        sortOptions={sortOptionItems}
        currentSortOption={getCurrentSortOption()}
        contextType="sanpham"
        itemLabel="danh mục"
        statCards={statCards}
        isLoading={loading}
        hasData={categories.length > 0}
        emptyStateMessage="Không có danh mục nào"
      >
        <CustomDanhMucTable
          categories={categories}
          isLoading={loading}
          onViewProducts={handleViewProducts}
        />
      </TableWrapper>
    </div>
  );
};

export default Categories;

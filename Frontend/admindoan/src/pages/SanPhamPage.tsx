import { Sidebar, TableWrapper } from "../components";
import { HiOutlineShoppingBag, HiOutlineArchive, HiOutlineCurrencyDollar, HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlinePhotograph } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useSanPham } from "../contexts/SanPhamContext";
import { useDanhMuc } from "../contexts/DanhMucContexts";
import { useNhaCungCap } from "../contexts/NhaCungCapContext";
import { useKho } from "../contexts/KhoContext";
import { SanPhamDto } from "../types/sanpham";
import { Link } from "react-router-dom";
import React from "react";

// Custom ProductTable component to accept props
const CustomProductTable: React.FC<{ products: SanPhamDto[], isLoading: boolean }> = ({ products, isLoading }) => {
  const { deleteProduct, fetchProducts } = useSanPham();
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    }
  };

  const handleToggleDetail = (id: string) => {
    setOpenDetailId(prev => (prev === id ? null : id));
  };

  // Hàm chuyển đổi đường dẫn ảnh từ DB sang đường dẫn thực tế
  const getImagePath = (imgPath: string | null | undefined) => {
    if (!imgPath) return '/placeholder-image.png';

    try {
      // Kiểm tra xem đường dẫn đã có http hoặc https chưa
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        return imgPath;
      }

      // Nếu đường dẫn bắt đầu bằng 'public/'
      if (imgPath.startsWith('public/')) {
        // Đường dẫn tương đối trong src/assets
        return `/src/assets/${imgPath}`;
      }

      // Nếu đường dẫn bắt đầu bằng '/'
      if (imgPath.startsWith('/')) {
        return imgPath;
      }

      return `/src/assets/${imgPath}`;
    } catch (error) {
      console.error("Lỗi khi xử lý đường dẫn ảnh:", error);
      return '/placeholder-image.png';
    }
  };

  return (
    <div className="w-full px-0">
      {/* Table full width */}
      <div className="overflow-x-auto w-full px-0">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300" style={{ width: '50%' }}>
                <span className="inline-flex items-center gap-1">
                  <HiOutlineShoppingBag className="text-blue-500" /> Sản phẩm
                </span>
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                <span className="inline-flex items-center gap-1">
                  <HiOutlineCurrencyDollar className="text-green-500" /> Giá
                </span>
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                <span className="inline-flex items-center gap-1">
                  <HiOutlineArchive className="text-orange-500" /> Số lượng tồn
                </span>
              </th>
              <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                <span className="inline-flex items-center gap-1">
                  <HiOutlineArchive className="text-purple-500" /> Thao tác
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 dark:text-white text-gray-700">Đang tải dữ liệu...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 dark:text-white text-gray-700">Không có sản phẩm nào.</td>
              </tr>
            ) : (
              products.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          {item.img ? (
                            <img
                              src={getImagePath(item.img)}
                              alt={item.tenSanPham}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).onerror = null;
                                (e.target as HTMLImageElement).src = '/placeholder-image.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <HiOutlinePhotograph size={24} />
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{item.tenSanPham}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-green-600 dark:text-green-400 font-medium">
                      {item.donGia.toLocaleString()}₫
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.soLuongTon > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                        {item.soLuongTon > 0 ? `${item.soLuongTon} - Còn hàng` : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/products/${item.id}/edit`}
                          className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <HiOutlinePencil size={18} />
                        </Link>
                        <button
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                          title="Xóa"
                          onClick={() => handleDelete(item.id)}
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                        <button
                          className={`p-1.5 rounded-full ${openDetailId === item.id
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                            : "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/40"
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
                      <td colSpan={4} className="py-0">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 shadow-inner border-t border-b border-blue-100 dark:border-blue-900">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Thông tin sản phẩm</h4>
                              <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 dark:text-gray-400">Mã sản phẩm:</span>
                                  <span className="font-medium text-gray-900 dark:text-white">{item.id.substring(0, 8).toUpperCase()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 dark:text-gray-400">Ngày sản xuất:</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {new Date(item.ngaySanXuat).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 dark:text-gray-400">Thời gian bảo hành:</span>
                                  <span className="font-medium text-gray-900 dark:text-white">{item.thoiGianBaoHanh} tháng</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Mô tả</h4>
                              <p className="text-gray-600 dark:text-gray-300">{item.moTa || 'Không có mô tả'}</p>
                            </div>
                          </div>
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

const Products = () => {
  const {
    products,
    loading,
    filterOptions,
    setFilterOptions,
    sortOptions,
    handleSortOptionsChange,
    searchAndSortProducts,
    paginationInfo
  } = useSanPham();

  const { danhMucs, fetchDanhMucs } = useDanhMuc();
  const { suppliers, fetchSuppliers } = useNhaCungCap();
  const { khoList, fetchAllKho } = useKho();

  const [localFilterOptions, setLocalFilterOptions] = useState({
    maDanhMuc: filterOptions.maDanhMuc || '',
    maNhaCungCap: filterOptions.maNhaCungCap || '',
    maKho: filterOptions.maKho || '',
    minPrice: filterOptions.minPrice,
    maxPrice: filterOptions.maxPrice
  });

  // Fetch categories, suppliers, and warehouses on component mount
  useEffect(() => {
    // Bỏ các request nếu đã có dữ liệu
    if (danhMucs.length === 0) {
      fetchDanhMucs();
    }

    if (suppliers.length === 0) {
      fetchSuppliers();
    }

    if (khoList.length === 0) {
      fetchAllKho();
    }
  }, []); // Empty dependency array chỉ gọi một lần khi mount

  const handleSearch = (keyword: string) => {
    setFilterOptions({
      ...filterOptions,
      keyword
    });
    searchAndSortProducts();
  };

  const handleSort = (value: string) => {
    let newSortOptions;

    // Xử lý các tùy chọn sắp xếp - Phải dùng đúng tên field như trong backend
    switch (value) {
      case 'tenaz':
        newSortOptions = { sortBy: 'TenSanPham', ascending: true };
        break;
      case 'tenza':
        newSortOptions = { sortBy: 'TenSanPham', ascending: false };
        break;
      case 'giaasc':
        newSortOptions = { sortBy: 'Gia', ascending: true };
        break;
      case 'giadesc':
        newSortOptions = { sortBy: 'Gia', ascending: false };
        break;
      case 'newest':
        newSortOptions = { sortBy: 'NgaySanXuat', ascending: false };
        break;
      case 'oldest':
        newSortOptions = { sortBy: 'NgaySanXuat', ascending: true };
        break;
      default:
        newSortOptions = { sortBy: 'TenSanPham', ascending: true };
    }

    // Sử dụng handleSortOptionsChange để cập nhật và áp dụng ngay lập tức
    handleSortOptionsChange(newSortOptions);
  };

  const handleFilterChange = (name: string, value: any) => {
    setLocalFilterOptions({
      ...localFilterOptions,
      [name]: value
    });
  };

  const handleApplyFilters = () => {
    setFilterOptions({
      ...filterOptions,
      ...localFilterOptions
    });
    searchAndSortProducts();
  };

  const handleClearFilters = () => {
    const clearedOptions = {
      maDanhMuc: '',
      maNhaCungCap: '',
      maKho: '',
      minPrice: undefined,
      maxPrice: undefined
    };

    setLocalFilterOptions(clearedOptions);
    setFilterOptions({
      ...filterOptions,
      ...clearedOptions
    });

    searchAndSortProducts();
  };

  const getCurrentSortOption = () => {
    const { sortBy, ascending } = sortOptions;

    if (sortBy === 'TenSanPham' && ascending) return 'tenaz';
    if (sortBy === 'TenSanPham' && !ascending) return 'tenza';
    if (sortBy === 'Gia' && ascending) return 'giaasc';
    if (sortBy === 'Gia' && !ascending) return 'giadesc';
    if (sortBy === 'NgaySanXuat' && !ascending) return 'newest';
    if (sortBy === 'NgaySanXuat' && ascending) return 'oldest';

    return '';
  };

  // Prepare filter fields for TableWrapper
  const filterFields = [
    {
      name: 'maDanhMuc',
      label: 'Danh mục',
      type: 'select' as const,
      options: [
        { value: '', label: 'Tất cả danh mục' },
        ...danhMucs.map(category => ({
          value: category.id,
          label: category.tenDanhMuc
        }))
      ],
      value: localFilterOptions.maDanhMuc
    },
    {
      name: 'maNhaCungCap',
      label: 'Nhà cung cấp',
      type: 'select' as const,
      options: [
        { value: '', label: 'Tất cả nhà cung cấp' },
        ...suppliers.map(supplier => ({
          value: supplier.id,
          label: supplier.tenNhaCungCap
        }))
      ],
      value: localFilterOptions.maNhaCungCap
    },
    {
      name: 'maKho',
      label: 'Kho',
      type: 'select' as const,
      options: [
        { value: '', label: 'Tất cả kho' },
        ...khoList.map(warehouse => ({
          value: String(warehouse.id),
          label: warehouse.tenKho
        }))
      ],
      value: localFilterOptions.maKho
    },
    {
      name: 'minPrice',
      label: 'Giá tối thiểu',
      type: 'number' as const,
      value: localFilterOptions.minPrice || ''
    },
    {
      name: 'maxPrice',
      label: 'Giá tối đa',
      type: 'number' as const,
      value: localFilterOptions.maxPrice || ''
    }
  ];

  // Prepare sort options for TableWrapper
  const sortOptionItems = [
    { value: 'tenaz', label: 'Tên A-Z' },
    { value: 'tenza', label: 'Tên Z-A' },
    { value: 'giaasc', label: 'Giá tăng dần' },
    { value: 'giadesc', label: 'Giá giảm dần' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' }
  ];

  // Đếm số lượng sản phẩm theo trạng thái
  const inStockCount = products.filter(p => p.soLuongTon > 0).length;
  const outOfStockCount = products.filter(p => p.soLuongTon <= 0).length;

  // Tính giá trung bình
  const avgPrice = products.length
    ? Math.round(products.reduce((sum, p) => sum + p.donGia, 0) / products.length)
    : 0;

  // Prepare stat cards for TableWrapper  
  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: paginationInfo.totalItems,
      icon: <HiOutlineShoppingBag className="text-blue-500 dark:text-blue-400 text-xl" />,
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Trong kho',
      value: inStockCount,
      icon: <HiOutlineArchive className="text-green-500 dark:text-green-400 text-xl" />,
      color: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Hết hàng',
      value: outOfStockCount,
      icon: <HiOutlineArchive className="text-red-500 dark:text-red-400 text-xl" />,
      color: 'bg-red-100 dark:bg-red-900'
    },
    {
      title: 'Giá trung bình',
      value: `${avgPrice.toLocaleString()}₫`,
      icon: <HiOutlineCurrencyDollar className="text-purple-500 dark:text-purple-400 text-xl" />,
      color: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Quản lý sản phẩm"
        subtitle="Tất cả sản phẩm"
        addButtonLink="/dashboard/products/create"
        addButtonLabel="Thêm sản phẩm"
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm sản phẩm..."
        onSort={handleSort}
        sortOptions={sortOptionItems}
        currentSortOption={getCurrentSortOption()}
        contextType="sanpham"
        itemLabel="sản phẩm"
        statCards={statCards}
        filters={{
          fields: filterFields,
          onFilterChange: handleFilterChange,
          onApplyFilters: handleApplyFilters,
          onResetFilters: handleClearFilters
        }}
        isLoading={loading}
        hasData={products.length > 0}
        emptyStateMessage="Không có sản phẩm nào"
        onResetFilters={handleClearFilters}
      >
        <CustomProductTable
          products={products}
          isLoading={loading}
        />
      </TableWrapper>
    </div>
  );
};

export default Products;

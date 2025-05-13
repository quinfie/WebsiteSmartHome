import React, { useState, useEffect } from "react";
import { Sidebar, TableWrapper } from "../components";
import {
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail
} from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import { useNhaCungCap } from "../contexts/NhaCungCapContext";
import { NhaCungCapDto } from "../types/nhacungcap";
import { sanPhamService } from "../api/sanpham";

// Custom NhaCungCapTable component
const CustomNhaCungCapTable: React.FC<{ suppliers: NhaCungCapDto[], isLoading: boolean }> =
  ({ suppliers, isLoading }) => {
    const navigate = useNavigate();
    const { deleteSupplier, fetchSuppliers } = useNhaCungCap();
    const [openDetailId, setOpenDetailId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [checkingId, setCheckingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
      try {
        setCheckingId(id);

        // Kiểm tra xem nhà cung cấp có sản phẩm không
        const products = await sanPhamService.getByNhaCungCapId(id);

        if (products && products.length > 0) {
          alert("Không thể xóa nhà cung cấp này vì còn chứa sản phẩm. Vui lòng xóa các sản phẩm trước.");
          setCheckingId(null);
          return;
        }

        // Nếu không có sản phẩm, tiếp tục xóa
        if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này không?")) {
          try {
            setDeletingId(id);
            await deleteSupplier(id);
            setDeletingId(null);
            fetchSuppliers();
          } catch (error) {
            console.error("Lỗi khi xóa nhà cung cấp:", error);
            setDeletingId(null);
            alert("Có lỗi xảy ra khi xóa nhà cung cấp");
          }
        }

        setCheckingId(null);
      } catch (error) {
        console.error("Lỗi khi kiểm tra sản phẩm:", error);
        setCheckingId(null);
        alert("Có lỗi xảy ra khi kiểm tra dữ liệu sản phẩm");
      }
    };

    const handleEdit = (id: string) => {
      navigate(`/dashboard/suppliers/${id}/edit`);
    };

    const handleToggleDetail = (id: string) => {
      setOpenDetailId(prev => (prev === id ? null : id));
    };

    return (
      <div className="w-full px-0">
        <div className="overflow-x-auto w-full px-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineOfficeBuilding className="text-blue-500" /> Tên Nhà Cung Cấp
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlinePhone className="text-green-500" /> Số Điện Thoại
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineMail className="text-purple-500" /> Email
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineLocationMarker className="text-orange-500" /> Địa Chỉ
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-right">
                  <span className="inline-flex items-center gap-1">
                    Thao tác
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 dark:text-white text-gray-700">Đang tải dữ liệu...</td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 dark:text-white text-gray-700">Không có nhà cung cấp nào.</td>
                </tr>
              ) : (
                suppliers.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-4 font-medium dark:text-white text-gray-700">
                        <div className="flex items-center gap-2">
                          <HiOutlineOfficeBuilding className="text-blue-500 dark:text-blue-400" />
                          {item.tenNhaCungCap}
                        </div>
                      </td>
                      <td className="py-4 px-4 dark:text-white text-gray-700">
                        <div className="flex items-center gap-2">
                          <HiOutlinePhone className="text-green-500 dark:text-green-400" />
                          {item.sdt}
                        </div>
                      </td>
                      <td className="py-4 px-4 dark:text-white text-gray-700">
                        <div className="flex items-center gap-2">
                          <HiOutlineMail className="text-purple-500 dark:text-purple-400" />
                          {item.email}
                        </div>
                      </td>
                      <td className="py-4 px-4 dark:text-white text-gray-700">
                        <div className="flex items-center gap-2">
                          <HiOutlineLocationMarker className="text-orange-500 dark:text-orange-400" />
                          {item.diaChi}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                            title="Chỉnh sửa"
                            onClick={() => handleEdit(item.id)}
                          >
                            <HiOutlinePencil size={18} />
                          </button>
                          <button
                            className={`p-1.5 rounded-full text-cyan-600 hover:bg-cyan-100 dark:text-cyan-400 dark:hover:bg-cyan-900/40 transition-colors ${openDetailId === item.id ? 'bg-cyan-100 dark:bg-cyan-900/40' : ''}`}
                            title={openDetailId === item.id ? "Đóng chi tiết" : "Xem chi tiết"}
                            onClick={() => handleToggleDetail(item.id)}
                          >
                            <HiOutlineEye size={18} />
                          </button>
                          <button
                            className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                            title="Xóa"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id || checkingId === item.id}
                          >
                            {deletingId === item.id || checkingId === item.id ? (
                              <div className="h-[18px] w-[18px] border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <HiOutlineTrash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {openDetailId === item.id && (
                      <tr>
                        <td colSpan={5} className="py-0">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 shadow-inner border-t border-b border-blue-100 dark:border-blue-900">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                              <div className="flex items-center gap-2">
                                <HiOutlineOfficeBuilding className="text-blue-500 dark:text-blue-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Tên nhà cung cấp:</span>
                                <span className="text-gray-700 dark:text-gray-300">{item.tenNhaCungCap}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <HiOutlinePhone className="text-green-500 dark:text-green-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Số điện thoại:</span>
                                <span className="text-gray-700 dark:text-gray-300">{item.sdt}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <HiOutlineMail className="text-purple-500 dark:text-purple-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                                <span className="text-gray-700 dark:text-gray-300">{item.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <HiOutlineLocationMarker className="text-orange-500 dark:text-orange-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Địa chỉ:</span>
                                <span className="text-gray-700 dark:text-gray-300">{item.diaChi}</span>
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

const NhaCungCap = () => {
  const { suppliers, loading, fetchSuppliers, searchSuppliers } = useNhaCungCap();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [displayedSuppliers, setDisplayedSuppliers] = useState<NhaCungCapDto[]>([]);
  const navigate = useNavigate();

  // Load data only once when component mounts
  useEffect(() => {
    let isMounted = true;

    if (!initialLoadDone) {
      fetchSuppliers()
        .then(() => {
          if (isMounted) {
            setInitialLoadDone(true);
          }
        })
        .catch(error => {
          console.error("Error fetching suppliers:", error);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [fetchSuppliers, initialLoadDone]);

  // Update displayed suppliers when the suppliers from context changes
  useEffect(() => {
    setDisplayedSuppliers(suppliers);
  }, [suppliers]);

  const handleSearch = async (keyword: string) => {
    if (searchKeyword === keyword) return;

    setSearchKeyword(keyword);

    try {
      if (keyword.trim()) {
        const results = await searchSuppliers(keyword);
        setDisplayedSuppliers(results);
      } else {
        setDisplayedSuppliers(suppliers);
      }
    } catch (error) {
      console.error("Error searching suppliers:", error);
    }
  };

  const handleSort = (value: string) => {
    if (sortOption === value) return;

    setSortOption(value);

    // Sort the suppliers based on the selected option
    let sortedSuppliers = [...displayedSuppliers];

    switch (value) {
      case 'az':
        sortedSuppliers.sort((a, b) => a.tenNhaCungCap.localeCompare(b.tenNhaCungCap));
        break;
      case 'za':
        sortedSuppliers.sort((a, b) => b.tenNhaCungCap.localeCompare(a.tenNhaCungCap));
        break;
      case 'email-az':
        sortedSuppliers.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'email-za':
        sortedSuppliers.sort((a, b) => b.email.localeCompare(a.email));
        break;
      default:
        // Keep default order if no valid sort option
        break;
    }

    setDisplayedSuppliers(sortedSuppliers);
  };

  // Calculate location counts for stat cards
  const locationCounts = suppliers.reduce((acc, supplier) => {
    const location = supplier.diaChi.split(',').pop()?.trim() || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare sort options for TableWrapper
  const sortOptionItems = [
    { value: 'az', label: 'Tên A-Z' },
    { value: 'za', label: 'Tên Z-A' },
    { value: 'email-az', label: 'Email A-Z' },
    { value: 'email-za', label: 'Email Z-A' }
  ];

  // Prepare stat cards for TableWrapper
  const statCards = [
    {
      title: 'Tổng nhà cung cấp',
      value: suppliers.length,
      icon: <HiOutlineOfficeBuilding className="text-blue-500 dark:text-blue-400 text-xl" />,
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Email',
      value: suppliers.filter(s => s.email && s.email.includes('@')).length,
      icon: <HiOutlineMail className="text-purple-500 dark:text-purple-400 text-xl" />,
      color: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Quản lý nhà cung cấp"
        subtitle="Tất cả nhà cung cấp"
        addButtonLink="/dashboard/suppliers/create"
        addButtonLabel="Thêm nhà cung cấp"
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm nhà cung cấp..."
        onSort={handleSort}
        sortOptions={sortOptionItems}
        currentSortOption={sortOption}
        contextType="sanpham"
        itemLabel="nhà cung cấp"
        statCards={statCards}
        isLoading={loading}
        hasData={displayedSuppliers.length > 0}
        emptyStateMessage="Không có nhà cung cấp nào"
      >
        <CustomNhaCungCapTable
          suppliers={displayedSuppliers}
          isLoading={loading}
        />
      </TableWrapper>
    </div>
  );
};

export default NhaCungCap;

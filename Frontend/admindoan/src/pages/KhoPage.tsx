import React, { useState, useEffect } from "react";
import {
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlinePhone
} from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { Sidebar, TableWrapper } from "../components";
import { useKho } from "../contexts/KhoContext";
import { useNavigate } from "react-router-dom";
import { KhoDto } from "../types/kho";

// Custom KhoTable component
const CustomKhoTable: React.FC<{ warehouses: KhoDto[], isLoading: boolean }> =
  ({ warehouses, isLoading }) => {
    const navigate = useNavigate();

    const handleDelete = (id: number) => {
      if (window.confirm("Bạn có chắc muốn xóa kho này không?")) {
        // Handle delete logic here
        alert(`Xóa kho: ${id}`);
      }
    };

    const handleEdit = (id: number) => {
      navigate(`/kho/edit/${id}`);
    };

    const handleView = (id: number) => {
      navigate(`/kho/view/${id}`);
    };

    return (
      <div className="w-full px-0">
        <div className="overflow-x-auto w-full px-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineOfficeBuilding className="text-blue-500" /> Tên Kho
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineLocationMarker className="text-green-500" /> Địa Chỉ
                  </span>
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <HiOutlinePhone className="text-purple-500" /> Số Điện Thoại
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
                  <td colSpan={4} className="text-center py-6 dark:text-white text-gray-700">Đang tải dữ liệu...</td>
                </tr>
              ) : warehouses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 dark:text-white text-gray-700">Không có kho nào.</td>
                </tr>
              ) : (
                warehouses.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4 font-medium dark:text-white text-gray-700">
                      <div className="flex items-center gap-2">
                        <HiOutlineOfficeBuilding className="text-blue-500 dark:text-blue-400" />
                        {item.tenKho}
                      </div>
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="text-green-500 dark:text-green-400" />
                        {item.diaChi}
                      </div>
                    </td>
                    <td className="py-4 px-4 dark:text-white text-gray-700">
                      <div className="flex items-center gap-2">
                        <HiOutlinePhone className="text-purple-500 dark:text-purple-400" />
                        {item.soDienThoai}
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
                          className="p-1.5 rounded-full text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/40 transition-colors"
                          title="Xem chi tiết"
                          onClick={() => handleView(item.id)}
                        >
                          <HiOutlineEye size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                          title="Xóa"
                          onClick={() => handleDelete(item.id)}
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

const KhoPage = () => {
  const { khoList, fetchAllKho } = useKho();
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [displayedWarehouses, setDisplayedWarehouses] = useState<KhoDto[]>([]);
  const navigate = useNavigate();

  // Load data only once when component mounts
  useEffect(() => {
    let isMounted = true;

    if (!initialLoadDone) {
      setLoading(true);
      fetchAllKho()
        .then(() => {
          if (isMounted) {
            setInitialLoadDone(true);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error("Error fetching warehouses:", error);
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [fetchAllKho, initialLoadDone]);

  // Update displayed warehouses when the khoList from context changes
  useEffect(() => {
    setDisplayedWarehouses(khoList);
  }, [khoList]);

  const handleSearch = (keyword: string) => {
    if (searchKeyword === keyword) return;

    setSearchKeyword(keyword);

    if (keyword.trim()) {
      const filtered = khoList.filter(
        item =>
          item.tenKho.toLowerCase().includes(keyword.toLowerCase()) ||
          item.diaChi.toLowerCase().includes(keyword.toLowerCase()) ||
          item.soDienThoai.includes(keyword)
      );
      setDisplayedWarehouses(filtered);
    } else {
      setDisplayedWarehouses(khoList);
    }
  };

  const handleSort = (value: string) => {
    if (sortOption === value) return;

    setSortOption(value);

    // Sort the warehouses based on the selected option
    let sortedWarehouses = [...displayedWarehouses];

    switch (value) {
      case 'az':
        sortedWarehouses.sort((a, b) => a.tenKho.localeCompare(b.tenKho));
        break;
      case 'za':
        sortedWarehouses.sort((a, b) => b.tenKho.localeCompare(a.tenKho));
        break;
      // For newest and oldest, we would need creation date fields
      // Adding them just as placeholders
      case 'newest':
      case 'oldest':
      default:
        // Keep default order if no valid sort option
        break;
    }

    setDisplayedWarehouses(sortedWarehouses);
  };

  // Prepare sort options for TableWrapper
  const sortOptionItems = [
    { value: 'az', label: 'Tên kho A-Z' },
    { value: 'za', label: 'Tên kho Z-A' }
  ];

  // Prepare stat cards for TableWrapper
  const statCards = [
    {
      title: 'Tổng số kho',
      value: khoList.length,
      icon: <HiOutlineOfficeBuilding className="text-blue-500 dark:text-blue-400 text-xl" />,
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Địa điểm',
      value: Array.from(new Set(khoList.map(k => k.diaChi.split(',').pop()?.trim()))).length,
      icon: <HiOutlineLocationMarker className="text-green-500 dark:text-green-400 text-xl" />,
      color: 'bg-green-100 dark:bg-green-900'
    }
  ];

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <TableWrapper
        title="Quản lý kho"
        subtitle="Danh sách kho"
        addButtonLink="/kho/create"
        addButtonLabel="Thêm kho"
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm kho..."
        onSort={handleSort}
        sortOptions={sortOptionItems}
        currentSortOption={sortOption}
        contextType="sanpham"
        itemLabel="kho"
        statCards={statCards}
        isLoading={loading}
        hasData={displayedWarehouses.length > 0}
        emptyStateMessage="Không có kho nào"
      >
        <CustomKhoTable
          warehouses={displayedWarehouses}
          isLoading={loading}
        />
      </TableWrapper>
    </div>
  );
};

export default KhoPage;

// src/contexts/DonHangContext.tsx
import {
  DonHangDto,
  RequestCreateDonHangDto,
  RequestUpdateDonHangDto,
  ResponseCreateDonHangDto,
  ViewResponseCreateDonHangDto,
} from '../types/donhang';
import {
  getAllDonHang,
  getDonHangById,
  createDonHang,
  updateDonHang,
  deleteDonHang,
  getCurrentUserDonHang,
} from '../api/donhang';
import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { BaseResponse } from '../types/common';

// Filter options for orders
interface FilterOptions {
  keyword?: string;
  trangThai?: string;
  tuNgay?: Date;
  denNgay?: Date;
}

// Sort options for orders
interface SortOptions {
  sortBy: string;
  ascending: boolean;
}

// Pagination information
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

interface DonHangContextType {
  orders: DonHangDto[];
  isLoading: boolean;
  searchTerm: string;
  paginationInfo: PaginationInfo;
  filterOptions: FilterOptions;
  sortOptions: SortOptions;

  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilterOptions: (options: FilterOptions) => void;
  setSortOptions: (options: SortOptions) => void;

  getAll: () => Promise<DonHangDto[]>;
  getById: (id: string) => Promise<BaseResponse<ViewResponseCreateDonHangDto>>;
  create: (data: RequestCreateDonHangDto) => Promise<BaseResponse<ResponseCreateDonHangDto>>;
  update: (id: string, data: RequestUpdateDonHangDto) => Promise<BaseResponse<ResponseCreateDonHangDto>>;
  remove: (id: string) => Promise<BaseResponse<boolean>>;
  getCurrentUserOrders: () => Promise<BaseResponse<ViewResponseCreateDonHangDto[]>>;

  fetchOrders: () => Promise<void>;
  searchAndSortOrders: () => Promise<void>;
}

const DonHangContext = createContext<DonHangContextType | undefined>(undefined);

export const DonHangProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<DonHangDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  // Filtering state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    keyword: "",
    trangThai: "",
    tuNgay: undefined,
    denNgay: undefined
  });

  // Sorting state
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: "ngayDat",
    ascending: false
  });

  const setCurrentPage = useCallback((page: number) => {
    setPaginationInfo(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPaginationInfo(prev => ({
      ...prev,
      pageSize: size,
      totalPages: Math.ceil(prev.totalItems / size)
    }));
    setCurrentPage(1); // Reset to first page when changing page size
  }, [setCurrentPage]);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllDonHang();
      setOrders(data);

      // Update pagination info
      setPaginationInfo(prev => ({
        ...prev,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / prev.pageSize)
      }));
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchAndSortOrders = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch all orders first
      let filteredOrders = await getAllDonHang();

      // Filter orders based on keyword
      if (filterOptions.keyword) {
        const keyword = filterOptions.keyword.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
          order.tenNguoiDung?.toLowerCase().includes(keyword) ||
          order.id?.toLowerCase().includes(keyword)
        );
      }

      // Filter by order status
      if (filterOptions.trangThai) {
        filteredOrders = filteredOrders.filter(order =>
          order.trangThaiDonHang === filterOptions.trangThai
        );
      }

      // Filter by date range
      if (filterOptions.tuNgay instanceof Date) {
        filteredOrders = filteredOrders.filter(order =>
          new Date(order.ngayDat) >= filterOptions.tuNgay!
        );
      }

      if (filterOptions.denNgay instanceof Date) {
        filteredOrders = filteredOrders.filter(order =>
          new Date(order.ngayDat) <= filterOptions.denNgay!
        );
      }

      // Sort orders
      filteredOrders.sort((a, b) => {
        const { sortBy, ascending } = sortOptions;
        const direction = ascending ? 1 : -1;

        switch (sortBy) {
          case "tenNguoiDung":
            return direction * (a.tenNguoiDung?.localeCompare(b.tenNguoiDung || "") || 0);
          case "tongTien":
            return direction * (a.tongTien - b.tongTien);
          case "ngayDat":
            return direction * (new Date(a.ngayDat).getTime() - new Date(b.ngayDat).getTime());
          case "trangThai":
            return direction * (a.trangThaiDonHang?.localeCompare(b.trangThaiDonHang || "") || 0);
          default:
            return 0;
        }
      });

      setOrders(filteredOrders);

      // Update pagination info
      setPaginationInfo(prev => ({
        ...prev,
        totalItems: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / prev.pageSize)
      }));
    } catch (err) {
      console.error("Lỗi khi lọc và sắp xếp đơn hàng:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filterOptions, sortOptions]);

  const value: DonHangContextType = useMemo(
    () => ({
      orders,
      isLoading,
      searchTerm,
      paginationInfo,
      filterOptions,
      sortOptions,

      setSearchTerm,
      setCurrentPage,
      setPageSize,
      setFilterOptions,
      setSortOptions,

      getAll: getAllDonHang,
      getById: async (id: string) => {
        const response = await getDonHangById(id);
        return response;
      },
      create: createDonHang,
      update: updateDonHang,
      remove: deleteDonHang,
      getCurrentUserOrders: getCurrentUserDonHang,

      fetchOrders,
      searchAndSortOrders,
    }),
    [
      orders,
      isLoading,
      searchTerm,
      paginationInfo,
      filterOptions,
      sortOptions,
      setCurrentPage,
      setPageSize,
      fetchOrders,
      searchAndSortOrders,
    ]
  );

  return <DonHangContext.Provider value={value}>{children}</DonHangContext.Provider>;
};

export const useDonHang = () => {
  const context = useContext(DonHangContext);
  if (!context) {
    throw new Error('useDonHang must be used within a DonHangProvider');
  }
  return context;
};

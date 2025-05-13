import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAllDanhMuc,
  getDanhMucById,
  createDanhMuc,
  updateDanhMuc,
  deleteDanhMuc,
  searchDanhMuc,
} from "../api/danhmuc";
import {
  DanhMucCreateDto,
  DanhMucDto,
  DanhMucUpdateDto,
} from "../types/danhmuc";

import { getAccessToken } from "../utils/auth";

// Interface cho tùy chọn sắp xếp
interface SortOptions {
  sortBy: string;
  ascending: boolean;
}

// Interface cho tùy chọn lọc
interface FilterOptions {
  keyword?: string;
}

// Interface cho thông tin phân trang
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

interface DanhMucContextType {
  danhMucs: DanhMucDto[];
  loading: boolean;
  fetchDanhMucs: () => Promise<void>;
  getById: (id: string) => Promise<DanhMucDto>;
  create: (data: DanhMucCreateDto) => Promise<DanhMucCreateDto>;
  update: (data: FormData) => Promise<void>;
  remove: (id: string) => Promise<boolean>;
  search: (keyword: string) => Promise<DanhMucDto[]>;

  // Thêm phương thức mới cho phân trang, sắp xếp, lọc
  paginationInfo: PaginationInfo;
  sortOptions: SortOptions;
  filterOptions: FilterOptions;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  setSortOptions: (options: SortOptions) => void;
  setFilterOptions: (options: FilterOptions) => void;
  handleSortOptionsChange: (options: SortOptions) => void;
  searchAndSortCategories: () => Promise<void>;
  filteredDanhMucs: DanhMucDto[]; // Danh mục sau khi lọc và sắp xếp
}

const DanhMucContext = createContext<DanhMucContextType | undefined>(undefined);

export const DanhMucProvider = ({ children }: { children: ReactNode }) => {
  const [danhMucs, setDanhMucs] = useState<DanhMucDto[]>([]);
  const [filteredDanhMucs, setFilteredDanhMucs] = useState<DanhMucDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // State cho phân trang
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  // State cho sắp xếp
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: 'tenDanhMuc',
    ascending: true
  });

  // State cho lọc
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    keyword: '',
  });

  const fetchDanhMucs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllDanhMuc();
      setDanhMucs(data);

      // Cập nhật thông tin phân trang
      setPaginationInfo(prev => ({
        ...prev,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / prev.pageSize)
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm để lọc và sắp xếp danh mục
  const searchAndSortCategories = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      // Lọc theo từ khóa
      let filtered = [...danhMucs];
      if (filterOptions.keyword) {
        const keyword = filterOptions.keyword.toLowerCase();
        filtered = filtered.filter(item =>
          item.tenDanhMuc.toLowerCase().includes(keyword) ||
          (item.moTa && item.moTa.toLowerCase().includes(keyword))
        );
      }

      // Sắp xếp
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortOptions.sortBy) {
          case 'tenDanhMuc':
            comparison = a.tenDanhMuc.localeCompare(b.tenDanhMuc);
            break;
          case 'moTa':
            comparison = (a.moTa || '').localeCompare(b.moTa || '');
            break;
          default:
            comparison = a.tenDanhMuc.localeCompare(b.tenDanhMuc);
        }

        return sortOptions.ascending ? comparison : -comparison;
      });

      // Phân trang
      const startIndex = (paginationInfo.currentPage - 1) * paginationInfo.pageSize;
      const paginatedItems = filtered.slice(startIndex, startIndex + paginationInfo.pageSize);

      // Cập nhật state
      setFilteredDanhMucs(paginatedItems);
      setPaginationInfo(prev => ({
        ...prev,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.pageSize)
      }));
    } catch (error) {
      console.error('Lỗi khi lọc và sắp xếp danh mục:', error);
    } finally {
      setLoading(false);
    }
  }, [danhMucs, filterOptions, sortOptions, paginationInfo.currentPage, paginationInfo.pageSize]);

  // Effect khi mount để tải danh mục
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted && danhMucs.length === 0) {
        await fetchDanhMucs();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Effect để lọc và sắp xếp khi các thông số thay đổi
  useEffect(() => {
    if (danhMucs.length > 0) {
      searchAndSortCategories();
    }
  }, [danhMucs, filterOptions, sortOptions, paginationInfo.currentPage, paginationInfo.pageSize, searchAndSortCategories]);

  const setPageSize = (size: number) => {
    setPaginationInfo({
      ...paginationInfo,
      pageSize: size,
      currentPage: 1 // Reset về trang 1 khi đổi page size
    });
  };

  const setCurrentPage = (page: number) => {
    setPaginationInfo({
      ...paginationInfo,
      currentPage: page
    });
  };

  // Phương thức này cho phép thay đổi tùy chọn sắp xếp
  const handleSortOptionsChange = (options: SortOptions) => {
    setSortOptions(options);
  };

  const getById = async (id: string) => {
    return await getDanhMucById(id);
  };

  const create = async (data: DanhMucCreateDto) => {
    const newItem = await createDanhMuc(data);
    await fetchDanhMucs();
    return newItem;
  };

  const update = async (data: FormData) => {
    const token = localStorage.getItem('token');
    if (token) {
      await updateDanhMuc(data);
      await fetchDanhMucs();
    } else {
      throw new Error("Token not found");
    }
  };

  const remove = async (id: string) => {
    const result = await deleteDanhMuc(id);
    await fetchDanhMucs();
    return result;
  };

  const search = async (keyword: string) => {
    return await searchDanhMuc(keyword);
  };

  return (
    <DanhMucContext.Provider
      value={{
        danhMucs,
        loading,
        fetchDanhMucs,
        getById,
        create,
        update,
        remove,
        search,
        paginationInfo,
        sortOptions,
        filterOptions,
        setPageSize,
        setCurrentPage,
        setSortOptions,
        setFilterOptions,
        handleSortOptionsChange,
        searchAndSortCategories,
        filteredDanhMucs
      }}
    >
      {children}
    </DanhMucContext.Provider>
  );
};

export const useDanhMuc = () => {
  const context = useContext(DanhMucContext);
  if (!context) throw new Error("useDanhMuc must be used within a DanhMucProvider");
  return context;
};

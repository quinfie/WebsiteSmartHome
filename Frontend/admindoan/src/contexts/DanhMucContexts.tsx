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
import { sanPhamService } from "../api/sanpham";

// Interface cho thông tin phân trang
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

// Extended DanhMucDto to include soSanPham
interface ExtendedDanhMucDto extends DanhMucDto {
  soSanPham: number;
}

interface DanhMucContextType {
  danhMucs: ExtendedDanhMucDto[];
  loading: boolean;
  fetchDanhMucs: () => Promise<void>;
  getById: (id: string) => Promise<DanhMucDto>;
  create: (data: DanhMucCreateDto) => Promise<DanhMucCreateDto>;
  update: (data: FormData) => Promise<void>;
  remove: (id: string) => Promise<boolean>;
  search: (keyword: string) => Promise<DanhMucDto[]>;

  // Phân trang
  paginationInfo: PaginationInfo;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  filteredDanhMucs: ExtendedDanhMucDto[]; // Danh mục sau khi phân trang
}

const DanhMucContext = createContext<DanhMucContextType | undefined>(undefined);

export const DanhMucProvider = ({ children }: { children: ReactNode }) => {
  const [danhMucs, setDanhMucs] = useState<ExtendedDanhMucDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // State cho phân trang
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  const getProductCountForCategory = async (categoryId: string): Promise<number> => {
    try {
      const response = await sanPhamService.search({
        maDanhMuc: categoryId,
        pageSize: 1000 // Get all products for accurate count
      });
      return response.totalItems || 0;
    } catch (error) {
      console.error(`Error getting product count for category ${categoryId}:`, error);
      return 0;
    }
  };

  const fetchDanhMucs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllDanhMuc();

      // Get product counts for all categories
      const categoriesWithCounts = await Promise.all(
        data.map(async (category): Promise<ExtendedDanhMucDto> => {
          const productCount = await getProductCountForCategory(category.id);
          return {
            ...category,
            soSanPham: productCount
          };
        })
      );

      setDanhMucs(categoriesWithCounts);
      setPaginationInfo(prev => ({
        ...prev,
        totalItems: categoriesWithCounts.length,
        totalPages: Math.ceil(categoriesWithCounts.length / prev.pageSize)
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      setDanhMucs([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Tính toán danh sách đã phân trang
  const filteredDanhMucs = danhMucs.slice(
    (paginationInfo.currentPage - 1) * paginationInfo.pageSize,
    paginationInfo.currentPage * paginationInfo.pageSize
  );

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

  const search = async (keyword: string): Promise<DanhMucDto[]> => {
    try {
      setLoading(true);
      const data = await searchDanhMuc(keyword);

      // Get product counts for all categories
      const categoriesWithCounts = await Promise.all(
        data.map(async (category): Promise<ExtendedDanhMucDto> => {
          const productCount = await getProductCountForCategory(category.id);
          return {
            ...category,
            soSanPham: productCount
          };
        })
      );

      setDanhMucs(categoriesWithCounts);
      setPaginationInfo(prev => ({
        ...prev,
        currentPage: 1, // Reset to first page when searching
        totalItems: categoriesWithCounts.length,
        totalPages: Math.ceil(categoriesWithCounts.length / prev.pageSize)
      }));

      return data; // Return the original search results
    } catch (error) {
      console.error("Lỗi khi tìm kiếm danh mục:", error);
      return []; // Return empty array on error
    } finally {
      setLoading(false);
    }
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
        setPageSize,
        setCurrentPage,
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

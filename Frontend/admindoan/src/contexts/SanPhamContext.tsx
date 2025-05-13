import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { sanPhamService } from '../api/sanpham';
import {
  SanPhamDto,
  SanPhamCreateDto,
  SanPhamUpdateDto,
  SanPhamResponseDto,
} from '../types/sanpham';
import { PagedResult } from '../types/common';

interface SortOptions {
  sortBy: string;
  ascending: boolean;
}

interface FilterOptions {
  keyword?: string;
  maDanhMuc?: string;
  maNhaCungCap?: string;
  maKho?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

interface SanPhamContextType {
  products: SanPhamDto[];
  loading: boolean;
  fetchProducts: (page?: number, pageSize?: number) => Promise<void>;
  getProductById: (id: string) => Promise<SanPhamResponseDto>;
  createProduct: (
    data: SanPhamCreateDto,
    maDanhMuc: string,
    maNhaCungCap: string,
    maKho: string
  ) => Promise<SanPhamResponseDto>;
  updateProduct: (id: string, data: SanPhamUpdateDto) => Promise<SanPhamResponseDto>;
  deleteProduct: (id: string) => Promise<boolean>;
  searchProduct: (params: any) => Promise<PagedResult<SanPhamResponseDto>>;
  getAll: (page?: number, pageSize?: number) => Promise<PagedResult<SanPhamDto>>;

  // Thêm các thuộc tính và phương thức mới
  paginationInfo: PaginationInfo;
  sortOptions: SortOptions;
  filterOptions: FilterOptions;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  setSortOptions: (options: SortOptions) => void;
  setFilterOptions: (options: FilterOptions) => void;
  searchAndSortProducts: () => Promise<void>;
  handleSortOptionsChange: (options: SortOptions) => void;
}

const SanPhamContext = createContext<SanPhamContextType | undefined>(undefined);

const getAllProducts = async (): Promise<SanPhamDto[]> => {
  const result = await sanPhamService.getAll(1, 1000); // lấy nhiều sản phẩm
  return result.items;
};

export const SanPhamProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<SanPhamDto[]>([]);
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
    sortBy: 'TenSanPham',
    ascending: true
  });

  // State cho lọc
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    keyword: '',
    maDanhMuc: '',
    maNhaCungCap: '',
    maKho: '',
  });

  const fetchProducts = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const result = await sanPhamService.getAll(page, pageSize);
      setProducts(result.items);
      setPaginationInfo({
        currentPage: page,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        pageSize: pageSize
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchAndSortProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filterOptions,
        sortBy: sortOptions.sortBy,
        ascending: sortOptions.ascending,
        page: paginationInfo.currentPage,
        pageSize: paginationInfo.pageSize
      };

      const result = await sanPhamService.search(params);
      setProducts(result.items);
      setPaginationInfo({
        ...paginationInfo,
        totalPages: result.totalPages,
        totalItems: result.totalItems
      });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  }, [filterOptions, sortOptions, paginationInfo.currentPage, paginationInfo.pageSize]);

  // Effect để tự động gọi API khi thay đổi trang, pageSize hoặc tùy chọn sắp xếp
  useEffect(() => {
    searchAndSortProducts();
  }, [paginationInfo.currentPage, paginationInfo.pageSize, sortOptions, searchAndSortProducts]);

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

  const handleSortOptionsChange = (options: SortOptions) => {
    setSortOptions(options);
  };

  const getProductById = async (id: string) => {
    return await sanPhamService.getById(id);
  };

  const createProduct = async (
    data: SanPhamCreateDto,
    maDanhMuc: string,
    maNhaCungCap: string,
    maKho: string
  ) => {
    return await sanPhamService.create(data, maDanhMuc, maNhaCungCap, maKho);
  };

  const updateProduct = async (id: string, data: SanPhamUpdateDto) => {
    return await sanPhamService.update(id, data);
  };

  const deleteProduct = async (id: string) => {
    return await sanPhamService.delete(id);
  };

  const getAll = async (page = 1, pageSize = 1000) => {
    return await sanPhamService.getAll(page, pageSize);
  };

  const searchProduct = async (params: any) => {
    return await sanPhamService.search(params);
  };

  return (
    <SanPhamContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProduct,
        getAll,
        paginationInfo,
        sortOptions,
        filterOptions,
        setPageSize,
        setCurrentPage,
        setSortOptions,
        setFilterOptions,
        searchAndSortProducts,
        handleSortOptionsChange
      }}
    >
      {children}
    </SanPhamContext.Provider>
  );
};

export const useSanPham = (): SanPhamContextType => {
  const context = useContext(SanPhamContext);
  if (!context) {
    throw new Error('useSanPham phải được dùng trong SanPhamProvider');
  }
  return context;
};

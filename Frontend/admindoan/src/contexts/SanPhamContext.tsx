import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sanPhamService } from '../api/sanpham';
import {
  SanPhamDto,
  SanPhamCreateDto,
  SanPhamUpdateDto,
  SanPhamResponseDto,
} from '../types/sanpham';
import { PagedResult } from '../types/common';

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

}

const SanPhamContext = createContext<SanPhamContextType | undefined>(undefined);

const getAllProducts = async (): Promise<SanPhamDto[]> => {
  const result = await sanPhamService.getAll(1, 1000); // lấy nhiều sản phẩm
  return result.items;
};

export const SanPhamProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<SanPhamDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const result = await sanPhamService.getAll(page, pageSize);
      setProducts(result.items);
    } catch (error) {
      console.error('Lỗi lấy danh sách sản phẩm:', error);
    } finally {
      setLoading(false);
    }
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

// src/api/sanPham.ts
import {
  SanPhamDto,
  SanPhamCreateDto,
  SanPhamUpdateDto,
  SanPhamResponseDto
} from '../types/sanpham';
import { PagedResult } from '../types/common';
import api from './axios.config';

export const sanPhamService = {
  getAll: async (page = 1, pageSize = 10): Promise<PagedResult<SanPhamDto>> => {
    const response = await api.get('/SanPham', {
      params: { page, pageSize },
    });
    return response.data.data;
  },

  getById: async (id: string): Promise<SanPhamResponseDto> => {
    const response = await api.get(`/SanPham/${id}`);
    return response.data.data;
  },

  create: async (
    data: SanPhamCreateDto,
    maDanhMuc: string,
    maNhaCungCap: string,
    maKho: string
  ): Promise<SanPhamResponseDto> => {
    const response = await api.post('/SanPham', data, {
      params: { maDanhMuc, maNhaCungCap, maKho },
    });
    return response.data.data;
  },

  update: async (
    id: string,
    data: SanPhamUpdateDto
  ): Promise<SanPhamResponseDto> => {
    const response = await api.put(`/SanPham/${id}`, data, {
      /*headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },*/
    });
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await api.delete(`/SanPham/${id}`, {
      /*headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },*/
    });
    return response.data.data;
  },

  search: async (params: {
    keyword?: string;
    maDanhMuc?: string;
    maNhaCungCap?: string;
    maKho?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    sortBy?: string;
    ascending?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<SanPhamResponseDto>> => {
    const response = await api.get('/SanPham/search', {
      params,
    });
    
    return response.data.data;
  },
  
  upload: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Sử dụng POST
      const response = await api.post('/SanPham/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const imagePath = response.data.data;
      return imagePath;
    } catch (error) {
      throw error;
    }
  },

  getByDanhMucId: async (maDanhMuc: string): Promise<SanPhamResponseDto[]> => {
    const response = await api.get('/SanPham/search', {
      params: { maDanhMuc, pageSize: 1 },
    });
    return response.data.data.items;
  },

  getByNhaCungCapId: async (maNhaCungCap: string): Promise<SanPhamResponseDto[]> => {
    const response = await api.get('/SanPham/search', {
      params: { maNhaCungCap, pageSize: 1 },
    });
    return response.data.data.items;
  },
};

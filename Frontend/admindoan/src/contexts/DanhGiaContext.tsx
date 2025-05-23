import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DanhGiaDto, CreateDanhGiaDto, UpdateDanhGiaDto, DanhGiaDetailDto } from "../types/danhgia";
import danhGiaService from "../api/danhgia";

interface DanhGiaContextProps {
  danhGiaList: DanhGiaDto[];
  fetchAllDanhGia: () => Promise<DanhGiaDto[]>;
  createDanhGia: (data: CreateDanhGiaDto) => Promise<boolean>;
  updateDanhGia: (
    maDonHang: string,
    maSanPham: string,
    data: UpdateDanhGiaDto
  ) => Promise<boolean>;
  deleteDanhGia: (id: string) => Promise<boolean>;
  searchDanhGia: (noiDung: string) => Promise<DanhGiaDto[]>;
  selectedDanhGia?: DanhGiaDto | null;
  getDetailById: (id: string) => Promise<DanhGiaDetailDto>;
}

const DanhGiaContext = createContext<DanhGiaContextProps | undefined>(undefined);

export const DanhGiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [danhGiaList, setDanhGiaList] = useState<DanhGiaDto[]>([]);

  const fetchAllDanhGia = async (): Promise<DanhGiaDto[]> => {
    try {
      const response = await danhGiaService.getAll();
      setDanhGiaList(response);
      return response;
    } catch (error) {
      console.error("Lỗi khi fetch danh sách đánh giá:", error);
      return [];
    }
  };

  const [selectedDanhGia] = useState<DanhGiaDto | null>(null);

  const createDanhGia = async (data: CreateDanhGiaDto) => {
    try {
      return await danhGiaService.create(data);
    } catch (error) {
      console.error("Lỗi khi tạo đánh giá:", error);
      return false;
    }
  };

  const updateDanhGia = async (
    maDonHang: string,
    maSanPham: string,
    data: UpdateDanhGiaDto
  ) => {
    try {
      return await danhGiaService.update(maDonHang, maSanPham, data);
    } catch (error) {
      console.error("Lỗi khi cập nhật đánh giá:", error);
      return false;
    }
  };

  const deleteDanhGia = async (id: string) => {
    try {
      return await danhGiaService.delete(id);
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      return false;
    }
  };

  const searchDanhGia = async (noiDung: string): Promise<DanhGiaDto[]> => {
    try {
      const response = await danhGiaService.search(noiDung);
      return response;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm đánh giá:", error);
      return [];
    }
  };

  const getDetailById = useCallback(async (id: string): Promise<DanhGiaDetailDto> => {
    return await danhGiaService.getDetailById(id);
  }, []);

  useEffect(() => {
    fetchAllDanhGia(); // Load all data by default
  }, []);

  return (
    <DanhGiaContext.Provider
      value={{
        danhGiaList,
        fetchAllDanhGia,
        createDanhGia,
        updateDanhGia,
        deleteDanhGia,
        searchDanhGia,
        selectedDanhGia,
        getDetailById,
      }}
    >
      {children}
    </DanhGiaContext.Provider>
  );
};

export const useDanhGia = (): DanhGiaContextProps => {
  const context = useContext(DanhGiaContext);
  if (!context) {
    throw new Error("useDanhGia must be used within a DanhGiaProvider");
  }
  return context;
};

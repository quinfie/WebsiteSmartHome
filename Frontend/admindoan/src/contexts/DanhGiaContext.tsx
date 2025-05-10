import React, { createContext, useContext, useState, useEffect } from "react";
import { DanhGiaDto, CreateDanhGiaDto, UpdateDanhGiaDto } from "../types/danhgia";
import danhGiaService from "../api/danhgia";

interface DanhGiaContextProps {
  danhGiaList: DanhGiaDto[];
  fetchAllDanhGia: () => Promise<void>;
  getDanhGiaById: (id: string) => Promise<DanhGiaDto | null>;
  createDanhGia: (data: CreateDanhGiaDto) => Promise<boolean>;
  updateDanhGia: (
    maDonHang: string,
    maSanPham: string,
    data: UpdateDanhGiaDto
  ) => Promise<boolean>;
  deleteDanhGia: (id: string) => Promise<boolean>;
  searchDanhGia: (noiDung: string) => Promise<DanhGiaDto[]>;
  selectedDanhGia?: DanhGiaDto | null;
  getById: (id: string) => Promise<void>;
}

const DanhGiaContext = createContext<DanhGiaContextProps | undefined>(undefined);

export const DanhGiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [danhGiaList, setDanhGiaList] = useState<DanhGiaDto[]>([]);

  const fetchAllDanhGia = async () => {
    try {
      const data = await danhGiaService.getAll();
      setDanhGiaList(data);
    } catch (error) {
      console.error("Lỗi khi fetch danh sách đánh giá:", error);
    }
  };

  const getDanhGiaById = async (id: string) => {
    try {
      return await danhGiaService.getById(id);
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
      return null;
    }
  };

  const [selectedDanhGia, setSelectedDanhGia] = useState<DanhGiaDto | null>(null);

  const getById = async (id: string) => {
    try {
      const data = await danhGiaService.getById(id);
      setSelectedDanhGia(data);
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };
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

  const searchDanhGia = async (noiDung: string) => {
    try {
      return await danhGiaService.search(noiDung);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm đánh giá:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchAllDanhGia();
  }, []);

  return (
    <DanhGiaContext.Provider
      value={{
        danhGiaList,
        fetchAllDanhGia,
        getDanhGiaById,
        createDanhGia,
        updateDanhGia,
        deleteDanhGia,
        searchDanhGia,
        selectedDanhGia,
        getById,
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

import { createContext, useContext } from "react";
import { phanCongDichVuApi } from "../api/phancongdichvu";
import {
  CreatePhanCongDichVuDto,
  PhanCongDichVuDto,
} from "../types/phancongdichvu";

interface PhanCongDichVuContextType {
  create: (data: CreatePhanCongDichVuDto) => Promise<PhanCongDichVuDto>;
  updateTrangThai: (id: string, trangThai: string) => Promise<PhanCongDichVuDto>;
  hoanThanh: (id: string) => Promise<PhanCongDichVuDto>;
  getByYeuCau: (yeuCauId: string) => Promise<PhanCongDichVuDto[]>;
  getByKyThuatVien: (kyThuatVienId: string) => Promise<PhanCongDichVuDto[]>;
}

const PhanCongDichVuContext = createContext<PhanCongDichVuContextType | undefined>(undefined);

export const PhanCongDichVuProvider = ({ children }: { children: React.ReactNode }) => {
  const create = async (data: CreatePhanCongDichVuDto) => {
    return await phanCongDichVuApi.create(data);
  };

  const updateTrangThai = async (id: string, trangThai: string) => {
    return await phanCongDichVuApi.updateTrangThai(id, trangThai);
  };

  const hoanThanh = async (id: string) => {
    return await phanCongDichVuApi.hoanThanh(id);
  };

  const getByYeuCau = async (yeuCauId: string) => {
    return await phanCongDichVuApi.getByYeuCau(yeuCauId);
  };

  const getByKyThuatVien = async (kyThuatVienId: string) => {
    return await phanCongDichVuApi.getByKyThuatVien(kyThuatVienId);
  };

  return (
    <PhanCongDichVuContext.Provider value={{
      create,
      updateTrangThai,
      hoanThanh,
      getByYeuCau,
      getByKyThuatVien
    }}>
      {children}
    </PhanCongDichVuContext.Provider>
  );
};

export const usePhanCongDichVu = () => {
  const context = useContext(PhanCongDichVuContext);
  if (!context) {
    throw new Error("usePhanCongDichVu must be used within a PhanCongDichVuProvider");
  }
  return context;
};

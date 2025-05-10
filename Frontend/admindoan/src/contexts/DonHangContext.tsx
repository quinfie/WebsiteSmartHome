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
import { createContext, useContext } from 'react';

interface DonHangContextType {
  getAll: () => Promise<DonHangDto[]>;

  getById: (id: string) => Promise<ViewResponseCreateDonHangDto>;
  create: (data: RequestCreateDonHangDto) => Promise<ResponseCreateDonHangDto>;
  update: (id: string, data: RequestUpdateDonHangDto) => Promise<ResponseCreateDonHangDto>;
  remove: (id: string) => Promise<boolean>;
  getCurrentUserOrders: () => Promise<ViewResponseCreateDonHangDto[]>;
}

const DonHangContext = createContext<DonHangContextType | undefined>(undefined);

export const DonHangProvider = ({ children }: { children: React.ReactNode }) => {
  const value: DonHangContextType = {
    getAll: getAllDonHang,
    getById: getDonHangById,
    create: createDonHang,
    update: updateDonHang,
    remove: deleteDonHang,
    getCurrentUserOrders: getCurrentUserDonHang,
  };

  return <DonHangContext.Provider value={value}>{children}</DonHangContext.Provider>;
};

export const useDonHang = () => {
  const context = useContext(DonHangContext);
  if (!context) throw new Error('useDonHang must be used within DonHangProvider');
  return context;
};

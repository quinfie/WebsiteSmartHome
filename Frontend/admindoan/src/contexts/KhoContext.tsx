import React, { createContext, useContext, useEffect, useState } from 'react';
import { khoApi } from '../api/kho';
import { KhoDto, KhoCreateDto } from '../types/kho';

interface KhoContextProps {
  khoList: KhoDto[];
  fetchAllKho: () => Promise<void>;
  createKho: (data: KhoCreateDto) => Promise<void>;

}

const KhoContext = createContext<KhoContextProps | undefined>(undefined);

interface KhoProviderProps {
  children: React.ReactNode;
}

export const KhoProvider = ({ children }: KhoProviderProps) => {
  const [khoList, setKhoList] = useState<KhoDto[]>([]);

  const fetchAllKho = async () => {
    try {
      const data = await khoApi.getAll();
      setKhoList(data);
    } catch (error) {
      console.error('Lỗi khi fetch danh sách kho:', error);
    }
  };

  const createKho = async (data: KhoCreateDto) => {
    try {
      await khoApi.create(data);
      await fetchAllKho();
    } catch (error) {
      console.error('Lỗi khi tạo kho:', error);
    }
  };



  useEffect(() => {
    fetchAllKho();
  }, []);

  return (
    <KhoContext.Provider value={{ khoList, fetchAllKho, createKho }}>
      {children}
    </KhoContext.Provider>
  );


};

export const useKho = () => {
  const context = useContext(KhoContext);
  if (!context) throw new Error('useKho must be used within KhoProvider');
  return context;
};

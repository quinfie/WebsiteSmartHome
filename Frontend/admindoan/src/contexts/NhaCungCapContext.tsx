import { createContext, useContext, useState, useEffect } from 'react';
import {
  getAllNhaCungCap,
  createNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
  getNhaCungCapById,
  searchNhaCungCap,
} from '../api/nhacungcap';
import { NhaCungCapDto, NhaCungCapCreateDto } from '../types/nhacungcap';
import { useAuth } from './AuthContext';

interface NhaCungCapContextType {
  suppliers: NhaCungCapDto[];
  loading: boolean;
  fetchSuppliers: () => Promise<void>;
  createSupplier: (data: NhaCungCapCreateDto) => Promise<void>;
  updateSupplier: (id: string, data: NhaCungCapCreateDto) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  getSupplierById: (id: string) => Promise<NhaCungCapDto>;
  searchSuppliers: (keyword: string) => Promise<NhaCungCapDto[]>;
}

const NhaCungCapContext = createContext<NhaCungCapContextType | undefined>(undefined);

export const NhaCungCapProvider = ({ children }: { children: React.ReactNode }) => {
  const [suppliers, setSuppliers] = useState<NhaCungCapDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getAllNhaCungCap();
      setSuppliers(res.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy nhà cung cấp:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (data: NhaCungCapCreateDto) => {
    await createNhaCungCap(data);
    await fetchSuppliers();
  };

  const updateSupplier = async (id: string, data: NhaCungCapCreateDto) => {
    await updateNhaCungCap(id, data);
    await fetchSuppliers();
  };

  const deleteSupplier = async (id: string) => {
    await deleteNhaCungCap(id);
    await fetchSuppliers();
  };

  const getSupplierById = async (id: string) => {
    const res = await getNhaCungCapById(id);
    return res.data.data;
  };

  const searchSuppliers = async (keyword: string) => {
    const res = await searchNhaCungCap(keyword);
    return res.data.data;
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted && suppliers.length === 0) {
        await fetchSuppliers();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <NhaCungCapContext.Provider
      value={{
        suppliers,
        loading,
        fetchSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        getSupplierById,
        searchSuppliers,
      }}
    >
      {children}
    </NhaCungCapContext.Provider>
  );
};

export const useNhaCungCap = () => {
  const context = useContext(NhaCungCapContext);
  if (!context) throw new Error('useNhaCungCap must be used within NhaCungCapProvider');
  return context;
};

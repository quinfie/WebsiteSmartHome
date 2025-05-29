// src/contexts/VaiTroContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
  getAllVaiTro,
  getVaiTroById,
  createVaiTro,
  updateVaiTro,
  deleteVaiTro,
  searchVaiTro,
} from "../api/vaiTroApi";
import { VaiTroDto } from "../types/vaitro";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

interface VaiTroContextType {
  vaiTros: VaiTroDto[];
  loading: boolean;
  fetchVaiTros: () => Promise<void>;
  getById: (id: string) => Promise<VaiTroDto>;
  create: (tenVaiTro: string) => Promise<void>;
  update: (id: string, tenVaiTro: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  search: (keyword: string) => Promise<void>;

  paginationInfo: PaginationInfo;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  filteredVaiTros: VaiTroDto[];
}

const VaiTroContext = createContext<VaiTroContextType | undefined>(undefined);

export const VaiTroProvider = ({ children }: { children: ReactNode }) => {
  const [vaiTros, setVaiTros] = useState<VaiTroDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });

  const fetchVaiTros = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllVaiTro();
      setVaiTros(data);
      setPaginationInfo((prev) => ({
        ...prev,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / prev.pageSize),
      }));
    } catch (error) {
      console.error("Lỗi khi tải vai trò:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaiTros();
  }, [fetchVaiTros]);

  const setPageSize = (size: number) => {
    setPaginationInfo((prev) => ({
      ...prev,
      pageSize: size,
      currentPage: 1,
      totalPages: Math.ceil(prev.totalItems / size),
    }));
  };

  const setCurrentPage = (page: number) => {
    setPaginationInfo((prev) => ({ ...prev, currentPage: page }));
  };

  const filteredVaiTros = vaiTros.slice(
    (paginationInfo.currentPage - 1) * paginationInfo.pageSize,
    paginationInfo.currentPage * paginationInfo.pageSize
  );

  const getById = async (id: string) => await getVaiTroById(id);
  const create = async (tenVaiTro: string) => {
    await createVaiTro(tenVaiTro);
    await fetchVaiTros();
  };
  const update = async (id: string, tenVaiTro: string) => {
    await updateVaiTro(id, tenVaiTro);
    await fetchVaiTros();
  };
  const remove = async (id: string) => {
    await deleteVaiTro(id);
    await fetchVaiTros();
  };
  const search = async (keyword: string) => {
    setLoading(true);
    try {
      const result = await searchVaiTro(keyword);
      setVaiTros(result);
      setPaginationInfo((prev) => ({
        ...prev,
        currentPage: 1,
        totalItems: result.length,
        totalPages: Math.ceil(result.length / prev.pageSize),
      }));
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VaiTroContext.Provider
      value={{
        vaiTros,
        loading,
        fetchVaiTros,
        getById,
        create,
        update,
        remove,
        search,
        paginationInfo,
        setPageSize,
        setCurrentPage,
        filteredVaiTros,
      }}
    >
      {children}
    </VaiTroContext.Provider>
  );
};

export const useVaiTro = () => {
  const context = useContext(VaiTroContext);
  if (!context) throw new Error("useVaiTro must be used within a VaiTroProvider");
  return context;
};

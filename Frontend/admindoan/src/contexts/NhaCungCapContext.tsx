import { createContext, useContext, useState, useCallback } from 'react';
import {
  getAllNhaCungCap,
  createNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
  getNhaCungCapById,
} from '../api/nhacungcap';
import { NhaCungCapDto, NhaCungCapCreateDto } from '../types/nhacungcap';
import { useAuth } from './AuthContext';

interface NhaCungCapContextType {
  suppliers: NhaCungCapDto[];
  loading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  createSupplier: (data: NhaCungCapCreateDto) => Promise<void>;
  updateSupplier: (id: string, data: NhaCungCapCreateDto) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  getSupplierById: (id: string) => Promise<NhaCungCapDto | undefined>;
}

const NhaCungCapContext = createContext<NhaCungCapContextType | undefined>(undefined);

export const NhaCungCapProvider = ({ children }: { children: React.ReactNode }) => {
  const [suppliers, setSuppliers] = useState<NhaCungCapDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const isAdmin = user?.vaiTro === 'Quản Trị Viên';

  const checkAdminAccess = () => {
    if (!isAdmin) {
      throw new Error('Bạn không có quyền thực hiện thao tác này');
    }
  };

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllNhaCungCap();

      if (response.code === 'OK' && Array.isArray(response.data)) {
        setSuppliers(response.data);
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách nhà cung cấp');
      }
    } catch (error: any) {
      setError(error.message || 'Đã xảy ra lỗi khi tải danh sách nhà cung cấp');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSupplier = async (data: NhaCungCapCreateDto) => {
    checkAdminAccess();
    try {
      setLoading(true);
      setError(null);
      const response = await createNhaCungCap(data);
      if (response.code === 'Success') {
        await fetchSuppliers();
      } else {
        throw new Error(response.message || 'Không thể tạo nhà cung cấp');
      }
    } catch (error: any) {
      setError(error.message || 'Đã xảy ra lỗi khi tạo nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id: string, data: NhaCungCapCreateDto) => {
    checkAdminAccess();
    try {
      setLoading(true);
      setError(null);
      const response = await updateNhaCungCap(id, data);
      if (response.code === 'Success') {
        await fetchSuppliers();
      } else {
        throw new Error(response.message || 'Không thể cập nhật nhà cung cấp');
      }
    } catch (error: any) {
      setError(error.message || 'Đã xảy ra lỗi khi cập nhật nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: string) => {
    checkAdminAccess();
    try {
      setLoading(true);
      setError(null);
      const response = await deleteNhaCungCap(id);
      if (response.code === 'Success') {
        await fetchSuppliers();
      } else {
        throw new Error(response.message || 'Không thể xóa nhà cung cấp');
      }
    } catch (error: any) {
      setError(error.message || 'Đã xảy ra lỗi khi xóa nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const getSupplierById = async (id: string): Promise<NhaCungCapDto | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNhaCungCapById(id);
      if (response.code === 'OK') {
        return response.data;
      }
      setError(response.message || 'Không thể lấy thông tin nhà cung cấp');
      return undefined;
    } catch (error: any) {
      setError(error.message || 'Đã xảy ra lỗi khi lấy thông tin nhà cung cấp');
      console.error("Error in getSupplierById context function:", error);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return (
    <NhaCungCapContext.Provider
      value={{
        suppliers,
        loading,
        error,
        fetchSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        getSupplierById,
      }}
    >
      {children}
    </NhaCungCapContext.Provider>
  );
};

export const useNhaCungCap = () => {
  const context = useContext(NhaCungCapContext);
  if (!context) {
    throw new Error('useNhaCungCap must be used within NhaCungCapProvider');
  }
  return context;
};

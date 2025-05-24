import React, { createContext, useContext, useEffect, useState } from 'react';
import { khoApi } from '../api/kho';
import { KhoDto, KhoCreateDto } from '../types/kho';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface KhoContextProps {
  khoList: KhoDto[];
  fetchAllKho: () => Promise<void>;
  createKho: (data: KhoCreateDto) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const KhoContext = createContext<KhoContextProps | undefined>(undefined);

interface KhoProviderProps {
  children: React.ReactNode;
}

export const KhoProvider = ({ children }: KhoProviderProps) => {
  const [khoList, setKhoList] = useState<KhoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Check if user has Admin or Manager role
  const canAccessKho = user?.vaiTro?.includes('Quản Trị Viên') || user?.vaiTro?.includes('Quản Lí');

  const fetchAllKho = async () => {
    // Only attempt to fetch if user is authenticated and has access
    if (!isAuthenticated || !user || !canAccessKho) {
      if (!isAuthenticated || !user) {
        toast.error('Vui lòng đăng nhập để xem danh sách kho');
      } else if (!canAccessKho) {
        toast.error('Bạn không có quyền xem danh sách kho');
      }
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await khoApi.getAll();
      setKhoList(response);
    } catch (error: any) {
      const errorMessage = error.message || 'Có lỗi xảy ra khi tải danh sách kho';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createKho = async (data: KhoCreateDto) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để tạo kho mới');
      return;
    }

    if (!canAccessKho) {
      toast.error('Bạn không có quyền tạo kho mới');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await khoApi.create(data);
      toast.success('Tạo kho mới thành công!');
      await fetchAllKho();
    } catch (error: any) {
      const errorMessage = error.message || 'Có lỗi xảy ra khi tạo kho mới';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      // Fetch kho list only if mounted, user is authenticated, user object exists, has access, and list is empty
      if (isMounted && isAuthenticated && user && canAccessKho && khoList.length === 0) {
        await fetchAllKho();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, canAccessKho]);

  return (
    <KhoContext.Provider value={{ khoList, fetchAllKho, createKho, loading, error }}>
      {children}
    </KhoContext.Provider>
  );
};

export const useKho = () => {
  const context = useContext(KhoContext);
  if (!context) throw new Error('useKho must be used within KhoProvider');
  return context;
};

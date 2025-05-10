// src/contexts/NguoiDungContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as nguoiDungApi from "../api/nguoidung";
import {
  NguoiDungDto,
  NguoiDungCreateDto,
  NguoiDungUpdateDto,
} from "../types/nguoidung";

interface NguoiDungContextType {
  users: NguoiDungDto[];
  isLoading: boolean;
  searchTerm: string;
  currentPage: number;
  rowsPerPage: number;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const NguoiDungContext = createContext<NguoiDungContextType | undefined>(
  undefined
);

export const NguoiDungProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<NguoiDungDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      let data: NguoiDungDto[];
      if (searchTerm) {
        data = await nguoiDungApi.searchNguoiDung(searchTerm);
      } else {
        data = await nguoiDungApi.getAllNguoiDung();
      }
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await nguoiDungApi.deleteNguoiDung(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      users,
      isLoading,
      searchTerm,
      currentPage,
      rowsPerPage,
      setSearchTerm,
      setCurrentPage,
      setRowsPerPage,
      fetchUsers,
      deleteUser,
    }),
    [
      users,
      isLoading,
      searchTerm,
      currentPage,
      rowsPerPage,
      fetchUsers,
      deleteUser,
    ]
  );

  return (
    <NguoiDungContext.Provider value={contextValue}>
      {children}
    </NguoiDungContext.Provider>
  );
};

export const useNguoiDung = () => {
  const context = useContext(NguoiDungContext);
  if (!context)
    throw new Error("useNguoiDung must be used within NguoiDungProvider");
  return context;
};

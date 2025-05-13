// src/contexts/NguoiDungContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { nguoiDungService } from "../api/nguoiDungApi";
import { taiKhoanService } from "../api/taiKhoanApi";
import {
  NguoiDungDto,
  NguoiDungCreateDto,
  NguoiDungUpdateDto,
} from "../types/nguoidung";

interface FilterOptions {
  keyword?: string;
  gioiTinh?: string;
  tuNgaySinh?: Date;
  denNgaySinh?: Date;
  diaChi?: string;
}

interface SortOptions {
  sortBy: string;
  ascending: boolean;
}

interface NguoiDungContextType {
  users: NguoiDungDto[];
  isLoading: boolean;
  searchTerm: string;
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  totalItems: number;
  filterOptions: FilterOptions;
  sortOptions: SortOptions;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setFilterOptions: (options: FilterOptions) => void;
  handleSortOptionsChange: (options: SortOptions) => void;
  fetchUsers: () => Promise<void>;
  searchAndSortUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const NguoiDungContext = createContext<NguoiDungContextType | undefined>(
  undefined
);

export const NguoiDungProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<NguoiDungDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    keyword: "",
    gioiTinh: "",
    tuNgaySinh: undefined,
    denNgaySinh: undefined,
    diaChi: "",
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: "TenNguoiDung",
    ascending: true,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      // Lưu ý: Tùy thuộc vào API backend thực tế, bạn có thể cần điều chỉnh gọi API
      const data = await nguoiDungService.getAll();

      // Chuẩn hóa dữ liệu ngày tháng
      const processedData = data.map((u) => ({
        ...u,
        ngaySinh: u.ngaySinh ? new Date(u.ngaySinh) : new Date(0),
      }));

      setUsers(processedData);
      setTotalItems(processedData.length);
      setTotalPages(Math.ceil(processedData.length / rowsPerPage));
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
    } finally {
      setIsLoading(false);
    }
  }, [rowsPerPage]);

  const searchAndSortUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      // Trong trường hợp thực tế, bạn sẽ gửi các tham số lọc/sắp xếp đến API
      // Nếu API không hỗ trợ, chúng ta sẽ xử lý ở phía client
      let filteredUsers = await nguoiDungService.getAll();

      // Chuẩn hóa dữ liệu ngày tháng
      filteredUsers = filteredUsers.map((u) => ({
        ...u,
        ngaySinh: u.ngaySinh ? new Date(u.ngaySinh) : new Date(0),
      }));

      // Lọc theo từ khóa (tên người dùng)
      if (filterOptions.keyword) {
        const keyword = filterOptions.keyword.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.tenNguoiDung?.toLowerCase().includes(keyword)
        );
      }

      // Lọc theo giới tính
      if (filterOptions.gioiTinh) {
        filteredUsers = filteredUsers.filter(user =>
          user.gioiTinh === filterOptions.gioiTinh
        );
      }

      // Lọc theo khoảng ngày sinh
      if (filterOptions.tuNgaySinh instanceof Date) {
        filteredUsers = filteredUsers.filter(user =>
          user.ngaySinh >= filterOptions.tuNgaySinh!
        );
      }

      if (filterOptions.denNgaySinh instanceof Date) {
        filteredUsers = filteredUsers.filter(user =>
          user.ngaySinh <= filterOptions.denNgaySinh!
        );
      }

      // Lọc theo địa chỉ
      if (filterOptions.diaChi) {
        const diaChiKeyword = filterOptions.diaChi.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.diaChi?.toLowerCase().includes(diaChiKeyword)
        );
      }

      // Sắp xếp danh sách người dùng
      filteredUsers.sort((a, b) => {
        const { sortBy, ascending } = sortOptions;
        const direction = ascending ? 1 : -1;

        switch (sortBy) {
          case "TenNguoiDung":
            return direction * (a.tenNguoiDung?.localeCompare(b.tenNguoiDung || "") || 0);
          case "NgaySinh":
            return direction * (a.ngaySinh.getTime() - b.ngaySinh.getTime());
          default:
            return 0;
        }
      });

      setUsers(filteredUsers);
      setTotalItems(filteredUsers.length);
      setTotalPages(Math.ceil(filteredUsers.length / rowsPerPage));

    } catch (error) {
      console.error("Lỗi khi lọc và sắp xếp người dùng:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterOptions, sortOptions, rowsPerPage]);

  const handleSortOptionsChange = useCallback((options: SortOptions) => {
    setSortOptions(options);
    setTimeout(() => {
      searchAndSortUsers();
    }, 0);
  }, [searchAndSortUsers]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      // Tìm người dùng trong danh sách
      const userToDelete = users.find((u) => u.id === id);

      if (!userToDelete) {
        throw new Error("Không tìm thấy người dùng để xóa!");
      }

      // Kiểm tra xem người dùng có tài khoản hay không
      if (userToDelete.maTaiKhoan) {
        // Nếu có tài khoản, xóa tài khoản liên quan
        await taiKhoanService.delete(userToDelete.maTaiKhoan);
      }

      // Xóa người dùng
      await nguoiDungService.delete(id);

      // Cập nhật danh sách người dùng
      setUsers(prevUsers => prevUsers.filter(u => u.id !== id));

      // Cập nhật số trang nếu cần
      setTotalItems(prev => prev - 1);
      setTotalPages(Math.ceil((totalItems - 1) / rowsPerPage));

    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  }, [users, totalItems, rowsPerPage]);

  const contextValue = useMemo(
    () => ({
      users,
      isLoading,
      searchTerm,
      currentPage,
      rowsPerPage,
      totalPages,
      totalItems,
      filterOptions,
      sortOptions,
      setSearchTerm,
      setCurrentPage,
      setRowsPerPage,
      setFilterOptions,
      handleSortOptionsChange,
      fetchUsers,
      searchAndSortUsers,
      deleteUser,
    }),
    [
      users,
      isLoading,
      searchTerm,
      currentPage,
      rowsPerPage,
      totalPages,
      totalItems,
      filterOptions,
      sortOptions,
      fetchUsers,
      searchAndSortUsers,
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

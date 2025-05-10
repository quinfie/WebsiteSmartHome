import {
    createContext,
    useCallback,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  import {
    getAllDanhMuc,
    getDanhMucById,
    createDanhMuc,
    updateDanhMuc,
    deleteDanhMuc,
    searchDanhMuc,
  } from "@/api/danhmuc";
  import {
    DanhMucCreateDto,
    DanhMucDto,
    DanhMucUpdateDto,
  } from "@/types/danhmuc";
  import { getAccessToken } from "@/utils/auth";
  
  interface DanhMucContextType {
    danhMucs: DanhMucDto[];
    fetchDanhMucs: () => Promise<void>;
    getById: (id: string) => Promise<DanhMucDto>;
    create: (data: DanhMucCreateDto) => Promise<DanhMucCreateDto>;
    update: (data: FormData) => Promise<void>; 
    remove: (id: string) => Promise<boolean>;
    search: (keyword: string) => Promise<DanhMucDto[]>;
  }
  
  const DanhMucContext = createContext<DanhMucContextType | undefined>(undefined);
  
  export const DanhMucProvider = ({ children }: { children: ReactNode }) => {
    const [danhMucs, setDanhMucs] = useState<DanhMucDto[]>([]);
  
    const fetchDanhMucs = useCallback(async () => {
      const data = await getAllDanhMuc();
      setDanhMucs(data);
    }, []);
  
    useEffect(() => {
      fetchDanhMucs();
    }, [fetchDanhMucs]);
  
    const getById = async (id: string) => {
      return await getDanhMucById(id);
    };
  
    const create = async (data: DanhMucCreateDto) => {
      const newItem = await createDanhMuc(data);
      await fetchDanhMucs();
      return newItem;
    };
  
    const update = async (data: FormData) => {
        const token = localStorage.getItem('token');  
        if (token) {
          await updateDanhMuc(data);
          await fetchDanhMucs();
        } else {
          throw new Error("Token not found");
        }
      };
      
      
  
    const remove = async (id: string) => {
      const result = await deleteDanhMuc(id);
      await fetchDanhMucs();
      return result;
    };
  
    const search = async (keyword: string) => {
      return await searchDanhMuc(keyword);
    };
  
    return (
      <DanhMucContext.Provider
        value={{ danhMucs, fetchDanhMucs, getById, create, update, remove, search }}
      >
        {children}
      </DanhMucContext.Provider>
    );
  };
  
  export const useDanhMuc = () => {
    const context = useContext(DanhMucContext);
    if (!context) throw new Error("useDanhMuc must be used within a DanhMucProvider");
    return context;
  };
  
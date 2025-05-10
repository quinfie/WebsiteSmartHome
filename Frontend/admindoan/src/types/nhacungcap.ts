// src/types/nhaCungCap.ts
export interface NhaCungCapDto {
    id: string;
    tenNhaCungCap: string;
    sdt: string;
    email: string;
    diaChi: string;
  }
  
  export interface NhaCungCapCreateDto {
    tenNhaCungCap: string;
    sdt: string;
    email: string;
    diaChi: string;
  }
  
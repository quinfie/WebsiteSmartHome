export interface CreatePhanCongDichVuDto {
    maYeuCau: string;
    maKyThuatVien: string;
    ghiChu?: string;
  }
  
  export interface PhanCongDichVuDto {
    id: string;
    maYeuCau: string;
    maKyThuatVien: string;
    ghiChu?: string;
    ngayPhanCong: string;
    ngayHoanThanh: string;
    trangThaiPhanCong: string;
  }
  
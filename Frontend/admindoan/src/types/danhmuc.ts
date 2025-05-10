// Dùng để hiển thị hoặc chỉnh sửa danh mục
export interface DanhMucDto {
    id: string;
    tenDanhMuc: string;
    moTa?: string;
    hinhAnh?:string;
  }
  
  // Dùng khi tạo mới
  export interface DanhMucCreateDto {
    tenDanhMuc: string;
    moTa: string;
  }
  
  // Dùng khi cập nhật
  export interface DanhMucUpdateDto {
    id: string;
    tenDanhMuc: string;
    moTa: string;
  }
  
  // Response từ backend nếu có gói trong wrapper BaseResponse
  export interface DanhMucResponseDto {
    statusCode: number;
    message: string;
    data: DanhMucDto | DanhMucDto[];
  }
  
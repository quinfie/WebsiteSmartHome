export interface KhuyenMaiDto {
    id: string;
    tenKhuyenMai: string;
    phanTramGiam: number;
    ngayBatDau: string;
    ngayKetThuc: string;
}

export interface KhuyenMaiCreateDto {
    tenKhuyenMai: string;
    phanTramGiam: number;
    ngayBatDau: string;
    ngayKetThuc: string;
}

export interface KhuyenMaiUpdateDto {
    tenKhuyenMai: string;
    phanTramGiam: number;
    ngayBatDau: string;
    ngayKetThuc: string;
}

export interface KhuyenMaiApplyDto {
    id: string;
    tenKhuyenMai: string;
    phanTramGiam: number;
    soTienGiam: number;
    tongTienSauGiam: number;
} 
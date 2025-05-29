// Định nghĩa các giá trị enum của backend
export type TypeServiceHelperEnum = 'BaoTri' | 'BaoHanh' | 'SuaChua';

export interface LichBaoTriDto {
    id: string;
    maChiTietDonHang: number;
    ngayBaoTri: string;
    loaiBaoTri: 'Bảo hành' | 'Bảo trì' | 'Sữa chữa';
    trangThai: 'Đã thông báo' | 'Chưa thông báo';
    nguonPhatSinh: 'Tự động' | 'Yêu cầu';
    maYeuCauDichVu?: string;
    tenSanPham?: string;
}

// Mapping từ giá trị hiển thị sang giá trị enum
export const DisplayToEnumMapping: Record<string, TypeServiceHelperEnum> = {
    'Bảo trì': 'BaoTri',
    'Bảo hành': 'BaoHanh',
    'Sữa chữa': 'SuaChua'
};

// Mapping từ giá trị enum sang giá trị hiển thị
export const EnumToDisplayMapping: Record<string, string> = {
    'BaoTri': 'Bảo trì',
    'BaoHanh': 'Bảo hành',
    'SuaChua': 'Sữa chữa'
};

// Mapping màu sắc cho từng loại bảo trì
export const LoaiBaoTriColors: Record<string, string> = {
    'Bảo hành': 'text-blue-500',
    'Bảo trì': 'text-purple-500',
    'Sữa chữa': 'text-red-500'
};
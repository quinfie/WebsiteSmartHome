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
  
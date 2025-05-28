namespace WebsiteSmartHome.Core.DTOs
{
    public class PhanCongCalendarDto
    {
        public string Id { get; set; } = string.Empty;
        public DateTime NgayPhanCong { get; set; }
        public string TrangThaiPhanCong { get; set; } = string.Empty;
        public string GhiChu { get; set; } = string.Empty;
        // Thông tin yêu cầu dịch vụ
        public string YeuCauId { get; set; } = string.Empty;
        public string LoaiDichVu { get; set; } = string.Empty;
        public string MoTaYeuCau { get; set; } = string.Empty;
        // Thông tin đơn hàng
        public string DonHangId { get; set; } = string.Empty;
        public string MaDonHang { get; set; } = string.Empty;
        // Thông tin sản phẩm
        public string SanPhamId { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public string MaSanPham { get; set; } = string.Empty;
        public string MoTaSanPham { get; set; } = string.Empty;
        public decimal GiaSanPham { get; set; } = 0;
        public int ThoiGianBaoHanh { get; set; } = 0;
        public DateTime NgayHetHanBaoHanh { get; set; }
        public DateTime? NgayHoanThanh { get; set; }
        public DateTime? NgayXuLy { get; set; }
        // Thông tin khách hàng
        public string KhachHangId { get; set; } = string.Empty;
        public string TenKhachHang { get; set; } = string.Empty;
        public string EmailKhachHang { get; set; } = string.Empty;
        public string SoDienThoaiKhachHang { get; set; } = string.Empty;
        public string DiaChiKhachHang { get; set; } = string.Empty;
        public string KyThuatVienId { get; set; } = string.Empty;
    }
}
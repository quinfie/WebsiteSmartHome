namespace WebsiteSmartHome.Core.DTOs
{
    public class ThongKeDonHangDto
    {
        public DateTime Ngay { get; set; }
        public int SoDonHang { get; set; }
        public decimal TongTien { get; set; }
    }

    public class ThongKeSanPhamDto
    {
        public string TenSanPham { get; set; } = string.Empty;
        public int SoLuongBan { get; set; }
        public decimal DoanhThu { get; set; }
    }

    public class ThongKeDanhMucDto
    {
        public string TenDanhMuc { get; set; } = string.Empty;
        public int SoLuongSanPham { get; set; }
        public decimal TongTien { get; set; }
    }

    public class ThongKeDichVuDto
    {
        public string LoaiDichVu { get; set; } = string.Empty;
        public int SoLuong { get; set; }
        public decimal TongTien { get; set; }
    }

    public class ThongKeDanhGiaDto
    {
        public int Rating { get; set; }
        public int SoLuong { get; set; }
    }
} 
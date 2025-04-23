namespace WebsiteSmartHome.Core.DTOs
{
    public class UpdateDonHangDto
    {
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; } = string.Empty;
        public string? MaKhuyenMai { get; set; }
    }
}

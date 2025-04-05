namespace WebsiteSmartHome.Core.DTOs
{
    public class DonHangDto
    {
        public string Id { get; set; } = null!;
        public string MaNguoiDung { get; set; } = null!;
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; } = null!;
        public DateTime NgayDat { get; set; }
        public string? MaKhuyenMai { get; set; }
    }

}

namespace WebsiteSmartHome.Core.DTOs
{
    public class DonHangDto
    {
        public Guid Id { get; set; }
        public Guid MaNguoiDung { get; set; }
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; } = null!;
        public DateTime NgayDat { get; set; }
        public Guid? MaKhuyenMai { get; set; }
    }
}

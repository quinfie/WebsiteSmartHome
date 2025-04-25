// CreateChiTietDonHangDto.cs
namespace WebsiteSmartHome.Core.DTOs
{
    public class CreateChiTietDonHangDto
    {
        public string MaDonHang { get; set; } = null!;
        public string MaSanPham { get; set; } = null!;
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }
}

using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.Core.DTOs
{
    public class ChiTietDonHangDto
    {
        public string Id { get; set; } = string.Empty;
        public string MaDonHang { get; set; } = string.Empty;
        public string MaSanPham { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }

    public class UpdateChiTietDonHangDto
    {
        public int SoLuongMoi { get; set; }
        public decimal DonGiaMoi { get; set; }
    }

    public class RequestCreateChiTietDonHangDto
    {
        public string MaSanPham { get; set; } = string.Empty;
        public int SoLuongMua { get; set; }
        public decimal DonGiaMua { get; set; }
    }
}

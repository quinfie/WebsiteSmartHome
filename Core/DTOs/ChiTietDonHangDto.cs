using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Core.DTOs
{
    public class ChiTietDonHangDto
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string MaDonHang { get; set; } = null!;
        public string MaSanPham { get; set; } = null!;
        public int ThoiGianBaoHanh { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }

        public decimal ThanhTien => SoLuong * DonGia;

        public virtual SanPham? SanPham { get; set; }

    }
}

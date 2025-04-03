using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Core.DTOs
{
    public class ChiTietDonHangDto
    {
        public Guid MaDonHang { get; set; }
        public Guid MaSanPham { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien => SoLuong * DonGia;//Tinh tong tien cua tung san pham
        public virtual SanPham? SanPham { get; set; }  // Cho phép null

    }
}

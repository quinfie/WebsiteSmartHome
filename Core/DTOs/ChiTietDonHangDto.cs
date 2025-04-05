using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Core.DTOs
{
    public class ChiTietDonHangDto
    {
<<<<<<< HEAD
        public string MaDonHang { get; set; } = null!;
        public string MaSanPham { get; set; } = null!;
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }

        public decimal ThanhTien => SoLuong * DonGia;

        public virtual SanPham? SanPham { get; set; }
=======
        public Guid MaDonHang { get; set; }
        public Guid MaSanPham { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien => SoLuong * DonGia;//Tinh tong tien cua tung san pham
        public virtual SanPham? SanPham { get; set; }  // Cho phép null

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
    }
}

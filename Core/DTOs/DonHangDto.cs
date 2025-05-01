using System.ComponentModel.DataAnnotations;
using WebsiteSmartHome.Core.Utils;

namespace WebsiteSmartHome.Core.DTOs
{
    public class DonHangDto
    {
        public string Id { get; set; }
        public string TenNguoiDung { get; set; }
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; }
        public DateTime NgayDat { get; set; }
        public string? TenKhuyenMai { get; set; }
    }

    public class ViewCreateChiTietDonHangDto
    {
        public string TenSanPham { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }

    public class ViewResponseCreateDonHangDto
    {
        public string TenNguoiDung { get; set; }
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; }
        public string? TenKhuyenMai { get; set; }
        public List<ViewCreateChiTietDonHangDto> ChiTietDonHangs { get; set; }
    }
}

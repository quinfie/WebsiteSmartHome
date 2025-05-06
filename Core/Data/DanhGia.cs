
namespace WebsiteSmartHome.Core.Data
{
    public partial class DanhGia
    {
        public Guid Id { get; set; }

        public Guid MaDonHang { get; set; }

        public Guid MaSanPham { get; set; }

        public int SoSao { get; set; }

        public string? NoiDung { get; set; }

        public DateTime? NgayDanhGia { get; set; }

        public virtual DonHang MaDonHangNavigation { get; set; } = null!;

        public virtual SanPham MaSanPhamNavigation { get; set; } = null!;
    }
}

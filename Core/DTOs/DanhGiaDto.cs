namespace WebsiteSmartHome.Core.DTOs
{
    public class DanhGiaDto
    {
        public Guid Id { get; set; }
        public Guid MaDonHang { get; set; }
        public Guid MaSanPham { get; set; }
        public int SoSao { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? NgayDanhGia { get; set; }
    }
}


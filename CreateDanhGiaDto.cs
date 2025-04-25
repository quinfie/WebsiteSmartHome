namespace WebsiteSmartHome.Core.DTOs
{
    public class CreateDanhGiaDto
    {
        public string MaDonHang { get; set; } = null!;
        public string MaSanPham { get; set; } = null!;
        public int SoSao { get; set; }
        public string NoiDung { get; set; } = string.Empty;
        public DateTime NgayDanhGia { get; set; } = DateTime.Now;
    }

}

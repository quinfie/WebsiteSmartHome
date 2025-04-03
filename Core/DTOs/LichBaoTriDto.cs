namespace WebsiteSmartHome.Core.DTOs
{
    public class LichBaoTriDto
    {
        public Guid Id { get; set; }
        public Guid MaDonHang { get; set; }
        public Guid MaSanPham { get; set; }
        public DateTime NgayBaoTriKeTiep { get; set; }
        public bool? DaThongBao { get; set; }
    }
}


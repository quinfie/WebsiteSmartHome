namespace WebsiteSmartHome.Core.DTOs
{
    public class LichBaoTriDto
    {
        public string Id { get; set; } = string.Empty;
        public int MaChiTietDonHang { get; set; }
        public DateTime NgayBaoTri { get; set; }
        public string LoaiBaoTri { get; set; } = string.Empty;
        public string TrangThai { get; set; } = string.Empty;
    }

}


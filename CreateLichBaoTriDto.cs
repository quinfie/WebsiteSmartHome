namespace WebsiteSmartHome.Core.DTOs
{
    public class CreateLichBaoTriDto
    {
        public int MaChiTietDonHang { get; set; }
        public DateTime NgayBaoTri { get; set; }
        public string LoaiBaoTri { get; set; } = string.Empty;
        public string TrangThai { get; set; } = string.Empty;
    }
}


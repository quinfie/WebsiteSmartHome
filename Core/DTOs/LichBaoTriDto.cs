namespace WebsiteSmartHome.Core.DTOs
{
    public class LichBaoTriDto
    {
        public string Id { get; set; } = string.Empty;
        public int MaChiTietDonHang { get; set; }
        public DateTime NgayBaoTri { get; set; }
        public string LoaiBaoTri { get; set; } = string.Empty;
        public string TrangThai { get; set; } = string.Empty;
        public string NguonPhatSinh { get; set; } = string.Empty;
        public string? MaYeuCauDichVu { get; set; }
    }

    public class CreateLichBaoTriDto
    {
        public int MaChiTietDonHang { get; set; }
        public DateTime NgayBaoTri { get; set; }
        public required string LoaiBaoTri { get; set; }
        public required string TrangThai { get; set; }
        public required string NguonPhatSinh { get; set; }
        public string? MaYeuCauDichVu { get; set; }
    }

    public class UpdateLichBaoTriDto
    {
        public DateTime NgayBaoTri { get; set; }
        public string LoaiBaoTri { get; set; } = string.Empty;
        public string TrangThai { get; set; } = string.Empty;
    }
}


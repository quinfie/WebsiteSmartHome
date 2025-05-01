namespace WebsiteSmartHome.Core.DTOs
{
    public class TaiKhoanDto
    {
        public string Id { get; set; } = string.Empty;
        public required string Email { get; set; }
        public required string TenTaiKhoan { get; set; }
        public required string MatKhau { get; set; }
        public DateTime? NgayTao { get; set; } = DateTime.Now;
        public string TrangThai { get; set; } = string.Empty;
    }

    public class TaiKhoanCreateDto
    {
        public required string Email { get; set; }
        public required string TenTaiKhoan { get; set; }
        public required string MatKhau { get; set; }
        public string TrangThai { get; set; } = "Hoạt động";
        public System.DateTime NgayTao { get; set; } = System.DateTime.Now;
        public required string MaNguoiDung { get; set; }
    }

    public class TaiKhoanUpdateDto
    {
        public string? Email { get; set; }
        public string? MatKhau { get; set; }
        public string? TenVaiTro { get; set; }
        public string? TrangThai { get; set; }
    }
}

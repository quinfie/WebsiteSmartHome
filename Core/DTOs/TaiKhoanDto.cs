namespace WebsiteSmartHome.Core.DTOs
{
    public class TaiKhoanDto
    {
        public required string Email { get; set; }
        public required string TenTaiKhoan { get; set; }
        public required string MatKhau { get; set; }
        public DateTime? NgayTao { get; set; } = DateTime.Now;
        public string TrangThai { get; set; } = string.Empty;
    }
}

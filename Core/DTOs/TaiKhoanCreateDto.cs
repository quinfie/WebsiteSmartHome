using WebsiteSmartHome.Core.Utils;

namespace WebsiteSmartHome.Core.DTOs
{
    public class TaiKhoanCreateDto
    {
        public required string Email { get; set; }
        public required string TenTaiKhoan { get; set; }
        public required string MatKhau { get; set; }
        public string TenVaiTro { get; set; } = string.Empty;
        public string TrangThai { get; set; } = string.Empty;
    }
}

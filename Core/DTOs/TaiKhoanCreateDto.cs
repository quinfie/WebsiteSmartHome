using WebsiteSmartHome.Core.Utils;

namespace WebsiteSmartHome.Core.DTOs
{
    public class TaiKhoanCreateDto
    {
        public required string Email { get; set; }
        public required string TenTaiKhoan { get; set; }
        public required string MatKhau { get; set; }
        public string TrangThai { get; set; } = "Hoạt động";
        public System.DateTime NgayTao { get; set; } = System.DateTime.Now;
    }
}

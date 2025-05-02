using System.ComponentModel.DataAnnotations;

namespace WebsiteSmartHome.Core.DTOs
{
    public class UpdateNguoiDungDto
    {
        [Required]
        public string TenNguoiDung { get; set; }

        public string? SoDienThoai { get; set; }

        public string? CCCD { get; set; }

        public DateTime? NgaySinh { get; set; }

        public string? GioiTinh { get; set; }

        public string? DiaChi { get; set; }
    }
} 
using System.ComponentModel.DataAnnotations;

namespace WebsiteSmartHome.Core.DTOs
{
    public class UpdateTaiKhoanDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string TenTaiKhoan { get; set; }

        [Required]
        public string TrangThai { get; set; }
    }
} 
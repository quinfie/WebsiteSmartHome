using System.ComponentModel.DataAnnotations;

namespace WebsiteSmartHome.Core.DTOs
{
    public class KhuyenMaiDto
    {
        public string Id { get; set; } = null!;
        public string TenKhuyenMai { get; set; } = null!;
        public int PhanTramGiam { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
    }

    public class KhuyenMaiCreateDto
    {
        [Required(ErrorMessage = "Tên khuyến mãi không được để trống")]
        [StringLength(200, ErrorMessage = "Tên khuyến mãi không được vượt quá 200 ký tự")]
        public string TenKhuyenMai { get; set; } = null!;

        [Required(ErrorMessage = "Phần trăm giảm không được để trống")]
        [Range(1, 100, ErrorMessage = "Phần trăm giảm phải từ 1-100%")]
        public int PhanTramGiam { get; set; }

        [Required(ErrorMessage = "Ngày bắt đầu không được để trống")]
        public DateTime NgayBatDau { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc không được để trống")]
        public DateTime NgayKetThuc { get; set; }
    }

    public class KhuyenMaiUpdateDto
    {
        public string Id { get; set; } = null!;

        [Required(ErrorMessage = "Tên khuyến mãi không được để trống")]
        [StringLength(200, ErrorMessage = "Tên khuyến mãi không được vượt quá 200 ký tự")]
        public string TenKhuyenMai { get; set; } = null!;

        [Required(ErrorMessage = "Phần trăm giảm không được để trống")]
        [Range(1, 100, ErrorMessage = "Phần trăm giảm phải từ 1-100%")]
        public int PhanTramGiam { get; set; }

        [Required(ErrorMessage = "Ngày bắt đầu không được để trống")]
        public DateTime NgayBatDau { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc không được để trống")]
        public DateTime NgayKetThuc { get; set; }
    }

    public class KhuyenMaiApplyDto
    {
        public string Id { get; set; } = null!;
        public string TenKhuyenMai { get; set; } = null!;
        public int PhanTramGiam { get; set; }
        public decimal SoTienGiam { get; set; }
        public decimal TongTienSauGiam { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace WebsiteSmartHome.Core.DTOs
{
    public class CreatePhanCongDichVuDto
    {
        [Required(ErrorMessage = "Mã yêu cầu không được để trống")]
        public string MaYeuCau { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã kỹ thuật viên không được để trống")]
        public string MaKyThuatVien { get; set; } = string.Empty;

        public string? GhiChu { get; set; }
    }

    public class PhanCongDichVuDto
    {
        public string Id { get; set; } = string.Empty;
        public string MaYeuCau { get; set; } = string.Empty;
        public string MaKyThuatVien { get; set; } = string.Empty;
        public string? GhiChu { get; set; }
        public DateTime NgayPhanCong { get; set; } = System.DateTime.Now;
        public DateTime? NgayHoanThanh { get; set; }
        public required string TrangThaiPhanCong { get; set; }
    }
}
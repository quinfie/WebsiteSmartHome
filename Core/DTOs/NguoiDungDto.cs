using System.ComponentModel.DataAnnotations;

namespace WebsiteSmartHome.Core.DTOs
{
    public class NguoiDungDto
    {
        public string Id { get; set; } = string.Empty;
        public required string TenNguoiDung { get; set; }
        public required string GioiTinh { get; set; }
        public required DateTime? NgaySinh { get; set; }
        public required string Cccd { get; set; }
        public required string soDienThoai { get; set; }
        public required string DiaChi { get; set; }
        public decimal TongTienMua { get; set; }
        public bool IsVip { get; set; }
    }

    public class NguoiDungCreateDto
    {
        public required string TenNguoiDung { get; set; }
        public required string GioiTinh { get; set; }
        public required DateTime? NgaySinh { get; set; }
        public required string Cccd { get; set; }
        public required string Sdt { get; set; }
        public required string DiaChi { get; set; }
        public required string TenVaiTro { get; set; }
        public required string MaTaiKhoan { get; set; }
    }

    public class NguoiDungUpdateDto
    {
        public string? TenNguoiDung { get; set; }
        public string? GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? DiaChi { get; set; }
        public string? Cccd { get; set; }
        public string? Sdt { get; set; }
        public string? MaVaiTro { get; set; }
    }

    public class UpdateNguoiDungDto
    {
        [Required]
        public string? TenNguoiDung { get; set; }

        public string? SoDienThoai { get; set; }

        public string? CCCD { get; set; }

        public DateTime? NgaySinh { get; set; }

        public string? GioiTinh { get; set; }

        public string? DiaChi { get; set; }
    }
}
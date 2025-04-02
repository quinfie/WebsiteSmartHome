using System.ComponentModel.DataAnnotations;

namespace WebsiteSmartHome.Core.DTOs
{
    public class SanPhamDto
    {
        public Guid Id { get; set; }

        public string TenSanPham { get; set; } = null!;

        public decimal Gia { get; set; }

        public int? SoLuongTon { get; set; }

        public int ThoiGianBaoHanh { get; set; }

        public int ThoiGianBaoTri { get; set; }

        public string? MoTa { get; set; }
    }
}

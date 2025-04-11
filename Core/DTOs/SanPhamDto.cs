using System.ComponentModel.DataAnnotations;

namespace WebsiteSmartHome.Core.DTOs
{
    public class SanPhamDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public decimal DonGia { get; set; }
        public int SoLuongTon { get; set; } = 0;
        public int ThoiGianBaoHanh { get; set; } // số lượng tháng bảo hành sản phẩm
        public System.DateTime NgaySanXuat { get; set; }
        public string MoTa { get; set; } = string.Empty;
    }

    public class SanPhamResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public decimal DonGia { get; set; }
        public int SoLuongTon { get; set; } = 0;
        public int ThoiGianBaoHanh { get; set; } // số lượng tháng bảo hành sản phẩm
        public System.DateTime NgaySanXuat { get; set; }
        public string MoTa { get; set; } = string.Empty;
        public string TenDanhMuc { get; set; } = string.Empty;
        public string TenNhaCungCap { get; set; } = string.Empty;
        public string TenKho { get; set; } = string.Empty;
    }

    public class SanPhamCreateDto
    {
        public required string TenSanPham { get; set; }
        public required decimal DonGia { get; set; } = 0;
        public required int SoLuongTon { get; set; } = 0;
        public required int ThoiGianBaoHanh { get; set; }
        public  required System.DateTime NgaySanXuat { get; set; }
        public string MoTa { get; set; } = string.Empty;
    }

    public class SanPhamUpdateDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public decimal DonGia { get; set; } = 0;
        public int? SoLuongTon { get; set; } = 0;
        public int ThoiGianBaoHanh { get; set; }
        public System.DateTime NgaySanXuat { get; set; }
        public string MoTa { get; set; } = string.Empty;
        public string MaDanhMuc { get; set; } = string.Empty;
        public string MaNhaCungCap { get; set; } = string.Empty;
        public string MaKho { get; set; } = string.Empty;
    }
}

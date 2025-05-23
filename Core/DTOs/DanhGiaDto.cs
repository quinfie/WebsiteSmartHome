namespace WebsiteSmartHome.Core.DTOs
{
    public class DanhGiaDto
    {
        public string? Id { get; set; }
        public string? MaDonHang { get; set; }
        public string? MaSanPham { get; set; }
        public int SoSao { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? NgayDanhGia { get; set; }
    }

    public class CreateDanhGiaDto
    {
        public string MaDonHang { get; set; } = null!;
        public string MaSanPham { get; set; } = null!;
        public int SoSao { get; set; }
        public string NoiDung { get; set; } = string.Empty;
        public DateTime NgayDanhGia { get; set; } = DateTime.Now;
    }

    public class UpdateDanhGiaDto
    {
        public int SoSao { get; set; }
        public string NoiDung { get; set; } = "";
    }

    public class DanhGiaDetailDto
    {
        public string? Id { get; set; }
        public string? MaDonHang { get; set; }
        public string? MaSanPham { get; set; }
        public string? MaNguoiDung { get; set; }
        public int SoSao { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? NgayDanhGia { get; set; }
        public string? TenNguoiDung { get; set; }
        public string? TenSanPham { get; set; }
        public DateTime? NgayDatHang { get; set; }
    }
}

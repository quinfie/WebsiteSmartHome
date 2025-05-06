namespace WebsiteSmartHome.Core.DTOs
{
    public class CreateYeuCauDichVuDto
    {
        public int MaChiTietDonHang { get; set; }
        public required string LoaiDichVu { get; set; }
        public string MoTa { get; set; }
        public DateOnly NgayHen { get; set; }
    }

    public class YeuCauDichVuDto
    {
        public string Id { get; set; } = string.Empty;
        public int MaChiTietDonHang { get; set; }
        public required string LoaiDichVu { get; set; }
        public required string TrangThaiYeuCau { get; set; }
        public decimal ChiPhiYeuCau { get; set; }
        public DateOnly NgayHen { get; set; }
        public DateTime? NgayXuLy { get; set; }
        public string? MoTa { get; set; }
        public bool DaPhanCong { get; set; }
    }
}
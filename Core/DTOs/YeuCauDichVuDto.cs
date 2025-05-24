namespace WebsiteSmartHome.Core.DTOs
{
    public class CreateYeuCauDichVuDto
    {
        public int MaChiTietDonHang { get; set; }
        public required string MoTa { get; set; }
        public DateOnly NgayHen { get; set; }
    }

    // DTO đầy đủ cho nhân viên/admin
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
        public string? TenSanPham { get; set; }
        public NguoiDungDto? KhachHang { get; set; }
    }

    // DTO giới hạn cho khách hàng
    public class YeuCauDichVuKhachHangDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public required string LoaiDichVu { get; set; }
        public required string TrangThaiYeuCau { get; set; }
        public DateOnly NgayHen { get; set; }
        public string? MoTa { get; set; }
        public decimal ChiPhiYeuCau { get; set; }
    }

    // DTO cho cập nhật chi phí
    public class UpdateChiPhiYeuCauDto
    {
        public required string Id { get; set; }
        public decimal ChiPhiYeuCau { get; set; }
    }

    public class UpdateMoTaDto
    {
        public string MoTa { get; set; } = string.Empty;
        public bool IsKetQua { get; set; }
    }

    // DTO cho cập nhật trạng thái yêu cầu dịch vụ
    public class UpdateTrangThaiYeuCauDto
    {
        public required string TrangThai { get; set; }
        public DateTime? NgayXuLy { get; set; }
    }
}
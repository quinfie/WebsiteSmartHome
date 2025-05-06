namespace WebsiteSmartHome.Core.DTOs
{
    public class DonHangDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenNguoiDung { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; } = string.Empty;
        public DateTime NgayDat { get; set; }
        public string? TenKhuyenMai { get; set; }
    }

    public class ViewResponseCreateDonHangDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenNguoiDung { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; } = string.Empty;
        public string? TenKhuyenMai { get; set; }
        public DateTime NgayDat { get; set; }
        public List<ChiTietDonHangDto>? ChiTietDonHangs { get; set; }
    }

    public class RequestUpdateDonHangDto
    {
        public required string TrangThaiDonHang { get; set; }
        public string? MaKhuyenMai { get; set; }
        public List<RequestCreateChiTietDonHangDto>? ChiTietDonHangs { get; set; }
    }

    public class RequestCreateDonHangDto
    {
        public string? MaKhuyenMai { get; set; }
        public List<RequestCreateChiTietDonHangDto>? ChiTietDonHangs { get; set; }
    }

    public class ResponseCreateDonHangDto
    {
        public string MaNguoiDung { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; } = string.Empty;
        public string? MaKhuyenMai { get; set; }
        public List<RequestCreateChiTietDonHangDto>? ChiTietDonHangs { get; set; }
    }
}

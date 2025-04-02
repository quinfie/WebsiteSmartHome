namespace WebsiteSmartHome.Core.DTOs
{
    public class NhaCungCapDto
    {
        public Guid Id { get; set; }
        public string TenNhaCungCap { get; set; } = null!;
        public string SDT { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? DiaChi { get; set; }
    }
}

namespace WebsiteSmartHome.Core.DTOs
{
    public class NhaCungCapDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenNhaCungCap { get; set; } = string.Empty;
        public string SDT { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
    }

    public class NhaCungCapCreateDto
    {
        public string TenNhaCungCap { get; set; } = string.Empty;
        public string SDT { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
    }
}

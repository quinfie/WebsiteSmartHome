namespace WebsiteSmartHome.Core.DTOs
{
    public class KhoDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenKho { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
    }

    public class KhoCreateDto
    {
        public string TenKho { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
    }
}

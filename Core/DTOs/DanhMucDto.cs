namespace WebsiteSmartHome.Core.DTOs
{
    public class DanhMucDto
    {
        public string Id { get; set; } = string.Empty;
        public string TenDanhMuc { get; set; } = string.Empty;
        public string MoTa { get; set; } = string.Empty;
    }

    public class DanhMucCreateDto
    {
        public string TenDanhMuc { get; set; } = string.Empty;
        public string MoTa { get; set; } = string.Empty;
    }
}

namespace WebsiteSmartHome.Core.DTOs
{
    public class DanhMucDto
    {
        public Guid Id { get; set; }
        public string TenDanhMuc { get; set; } = null!;
        public string? MoTa { get; set; }
    }
}

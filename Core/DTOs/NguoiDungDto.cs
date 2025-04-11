namespace WebsiteSmartHome.Core.DTOs
{
    public class NguoiDungDto
    {
        public string id { get; set; } = string.Empty;
        public required string TenNguoiDung { get; set; }
        public required string GioiTinh { get; set; }
        public required DateTime? NgaySinh { get; set; }
        public required string Cccd { get; set; }
        public required string Sdt { get; set; }
        public required string DiaChi { get; set; }
    }
}
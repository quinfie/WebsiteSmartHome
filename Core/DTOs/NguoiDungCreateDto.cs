namespace WebsiteSmartHome.Core.DTOs
{
    public class NguoiDungCreateDto
    {
        public required string TenNguoiDung { get; set; }
        public required string GioiTinh { get; set; }
        public required DateOnly? NgaySinh { get; set; }
        public required string Cccd { get; set; }
        public required string Sdt { get; set; }
        public required string DiaChi { get; set; }
    }
}
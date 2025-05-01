namespace WebsiteSmartHome.Core.DTOs
{
    public class ResponseCreateDonHangDto
    {
        public string MaNguoiDung { get; set; }
        public decimal TongTien {  get; set; }
        public string TrangThaiDonHang { get; set; }
        public string? MaKhuyenMai { get; set; }
        public List<RequestCreateChiTietDonHangDto> ChiTietDonHangs { get; set; }
    }

    public class RequestCreateDonHangDto
    {
        public string MaNguoiDung { get; set; }
        public string TrangThaiDonHang { get; set; } = "Chờ xác nhận";
        public string? MaKhuyenMai { get; set; }
        public List<RequestCreateChiTietDonHangDto> ChiTietDonHangs { get; set; }
    }
}

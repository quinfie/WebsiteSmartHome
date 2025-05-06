namespace WebsiteSmartHome.Core.DTOs
{
    public class DanhGiaDto
    {
        public string? Id { get; set; }
        public string? MaDonHang { get; set; }
        public string? MaSanPham { get; set; }
        public int SoSao { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? NgayDanhGia { get; set; }
    }

    public class CreateDanhGiaDto
    {
        public string MaDonHang { get; set; } = null!;
        public string MaSanPham { get; set; } = null!;
        public int SoSao { get; set; }
        public string NoiDung { get; set; } = string.Empty;
        public DateTime NgayDanhGia { get; set; } = DateTime.Now;
    }

    public class UpdateDanhGiaDto
    {
        //Không cần truyền lại MaDonHang và MaSanPham vì sẽ lấy từ route (URL) để xác định duy nhất bản ghi đánh giá cần sửa.
        public int SoSao { get; set; }              // Cho phép cập nhật số sao
        public string NoiDung { get; set; } = "";   // Cho phép chỉnh sửa nội dung đánh giá
    }
}

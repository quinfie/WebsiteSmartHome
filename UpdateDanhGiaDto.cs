namespace WebsiteSmartHome.Core.DTOs
{
    public class UpdateDanhGiaDto
    {
        //Không cần truyền lại MaDonHang và MaSanPham vì sẽ lấy từ route (URL) để xác định duy nhất bản ghi đánh giá cần sửa.
        public int SoSao { get; set; }              // Cho phép cập nhật số sao
        public string NoiDung { get; set; } = "";   // Cho phép chỉnh sửa nội dung đánh giá
    }

}

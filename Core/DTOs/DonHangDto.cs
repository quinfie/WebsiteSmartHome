
using WebsiteSmartHome.Core.Utils;

namespace WebsiteSmartHome.Core.DTOs
{
    public class DonHangDto
    {
        public DonHangDto()
        {
            TrangThaiDonHang = OrderStatusHelper.Pending.ToString();
            NgayDat = DateTime.Now;
        }

        public string Id { get; set; } = Guid.NewGuid().ToString(); // Gán giá trị mặc định

        public string MaNguoiDung { get; set; } = null!;
        public decimal TongTien { get; set; }
        public string TrangThaiDonHang { get; set; }
        public DateTime NgayDat { get; set; }
        public string? MaKhuyenMai { get; set; }
    }


}

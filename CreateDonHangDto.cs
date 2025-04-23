namespace WebsiteSmartHome.Core.DTOs
{
    public class CreateDonHangDto
    {
        public string MaNguoiDung { get; set; } // Mã người dùng
        public string MaSanPham { get; set; } // Mã sản phẩm
        public int SoLuong { get; set; } // Số lượng
        public decimal TongTien { get; set; } // Tổng tiền đơn hàng
        public string TrangThaiDonHang { get; set; } // Trạng thái đơn hàng
        public string? MaKhuyenMai { get; set; }

      //  public List<CreateChiTietDonHangDto> SanPhamList { get; set; }
    }
}

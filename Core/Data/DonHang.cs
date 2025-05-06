
namespace WebsiteSmartHome.Core.Data
{
    public partial class DonHang
    {
        public Guid Id { get; set; }

        public Guid MaNguoiDung { get; set; }

        public decimal TongTien { get; set; }

        public string TrangThaiDonHang { get; set; } = null!;

        public DateTime NgayDat { get; set; }

        public Guid? MaKhuyenMai { get; set; }

        public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

        public virtual ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();

        public virtual KhuyenMai? MaKhuyenMaiNavigation { get; set; }

        public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
    }
}



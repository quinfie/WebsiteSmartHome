
namespace WebsiteSmartHome.Core.Data
{
    public partial class KhuyenMai
    {
        public Guid Id { get; set; }

        public string TenKhuyenMai { get; set; } = null!;

        public int PhanTramGiam { get; set; }

        public DateTime NgayBatDau { get; set; }

        public DateTime NgayKetThuc { get; set; }

        public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();
    }
}


namespace WebsiteSmartHome.Core.Data
{
    public partial class NguoiDung
    {
        public Guid Id { get; set; }

        public string TenNguoiDung { get; set; } = null!;

        public string DiaChi { get; set; } = null!;

        public string GioiTinh { get; set; } = null!;

        public string Cccd { get; set; } = null!;

        public string SoDienThoai { get; set; } = null!;

        public DateTime? NgaySinh { get; set; }

        public Guid MaTaiKhoan { get; set; }

        public Guid MaVaiTro { get; set; }

        public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();

        public virtual TaiKhoan MaTaiKhoanNavigation { get; set; } = null!;

        public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;

        public virtual ICollection<PhanCongDichVu> PhanCongDichVus { get; set; } = new List<PhanCongDichVu>();
    }
}


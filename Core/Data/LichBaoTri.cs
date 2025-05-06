
namespace WebsiteSmartHome.Core.Data
{
    public partial class LichBaoTri
    {
        public Guid Id { get; set; }

        public int MaChiTietDonHang { get; set; }

        public DateTime NgayBaoTri { get; set; }

        public string LoaiBaoTri { get; set; } = null!;

        public string TrangThai { get; set; } = null!;

        public string NguonPhatSinh { get; set; } = null!;

        public Guid? MaYeuCauDichVu { get; set; }

        public virtual ChiTietDonHang MaChiTietDonHangNavigation { get; set; } = null!;

        public virtual YeuCauDichVu? MaYeuCauDichVuNavigation { get; set; }
    }
}


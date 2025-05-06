
namespace WebsiteSmartHome.Core.Data
{
    public partial class YeuCauDichVu
    {
        public Guid Id { get; set; }

        public int MaChiTietDonHang { get; set; }

        public string LoaiDichVu { get; set; } = null!;

        public string TrangThaiYeuCau { get; set; } = null!;

        public decimal ChiPhiYeuCau { get; set; }

        public DateOnly NgayHen { get; set; }

        public DateTime? NgayXuLy { get; set; }

        public string? MoTa { get; set; }

        public bool DaPhanCong { get; set; }

        public virtual ICollection<LichBaoTri> LichBaoTris { get; set; } = new List<LichBaoTri>();

        public virtual ChiTietDonHang MaChiTietDonHangNavigation { get; set; } = null!;

        public virtual ICollection<PhanCongDichVu> PhanCongDichVus { get; set; } = new List<PhanCongDichVu>();
    }

}

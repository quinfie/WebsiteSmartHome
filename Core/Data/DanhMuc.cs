

namespace WebsiteSmartHome.Core.Data
{
    public partial class DanhMuc
    {
        public Guid Id { get; set; }

        public string TenDanhMuc { get; set; } = null!;

        public string? MoTa { get; set; }

        public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
    }

}

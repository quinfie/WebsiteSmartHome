namespace WebsiteSmartHome.Data;

public partial class DanhGia
{
    public Guid Id { get; set; }

    public Guid MaDonHang { get; set; }

    public Guid MaSanPham { get; set; }

    public int SoSao { get; set; }

    public string? NoiDung { get; set; }

    public System.DateTime? NgayDanhGia { get; set; }

    public virtual ChiTietDonHang ChiTietDonHang { get; set; } = null!;
}

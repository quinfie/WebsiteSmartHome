namespace WebsiteSmartHome.Data;

public partial class TaiKhoan
{
    public Guid Id { get; set; }

    public Guid MaNguoiDung { get; set; }

    public string Email { get; set; } = null!;

    public string TenTaiKhoan { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public Guid MaVaiTro { get; set; }

    public string TrangThai { get; set; } = null!;

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;
}

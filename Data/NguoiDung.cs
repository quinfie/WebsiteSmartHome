using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class NguoiDung
{
    public Guid Id { get; set; }

    public string TenNguoiDung { get; set; } = null!;

    public string DiaChi { get; set; } = null!;

    public string GioiTinh { get; set; } = null!;

    public string CCCD { get; set; } = null!;

    public string SoDienThoai { get; set; } = null!;

    public System.DateTime? NgaySinh { get; set; }

    public Guid MaTaiKhoan { get; set; }

    public Guid MaVaiTro { get; set; }

    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();

    public virtual TaiKhoan MaTaiKhoanNavigation { get; set; } = null!;

    public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;

    public virtual ICollection<YeuCauDichVu> YeuCauDichVus { get; set; } = new List<YeuCauDichVu>();
}

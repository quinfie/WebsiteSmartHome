using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class LichBaoTri
{
    public Guid Id { get; set; }

    public Guid MaDonHang { get; set; }

    public Guid MaSanPham { get; set; }

    public System.DateTime NgayBaoTri { get; set; }

    public bool? DaThongBao { get; set; }

    public virtual ChiTietDonHang ChiTietDonHang { get; set; } = null!;
}

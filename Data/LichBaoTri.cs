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
    // Điều hướng (navigation properties)
    public virtual DonHang DonHang { get; set; } = null!;  // Điều hướng đến bảng DonHang
    public virtual SanPham SanPham { get; set; } = null!;  // Điều hướng đến bảng SanPham
    public virtual ChiTietDonHang ChiTietDonHang { get; set; } = null!;
}

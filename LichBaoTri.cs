using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class LichBaoTri
{
    public Guid Id { get; set; }

    public int MaChiTietDonHang { get; set; }

    public DateTime NgayBaoTri { get; set; }

    public string LoaiBaoTri { get; set; } = null!;

    public string TrangThai { get; set; } = null!;

    // Điều hướng
    public virtual ChiTietDonHang ChiTietDonHang { get; set; } = null!;
}


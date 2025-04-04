using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class KhuyenMai
{
    public Guid Id { get; set; }

    public string TenKhuyenMai { get; set; } = null!;

    public decimal PhanTramGiam { get; set; }

    public DateTime NgayBatDau { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public virtual DonHang? DonHang { get; set; }
}

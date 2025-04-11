using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class NhaCungCap
{
    public Guid Id { get; set; }

    public string TenNhaCungCap { get; set; } = null!;

    public string? DiaChi { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
}

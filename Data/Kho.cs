using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class Kho
{
    public Guid Id { get; set; }

    public string TenKho { get; set; } = null!;

    public string DiaChi { get; set; } = null!;

    public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
}

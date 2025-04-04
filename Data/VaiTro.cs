using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class VaiTro
{
    public Guid Id { get; set; }

    public string TenVaiTro { get; set; } = null!;

    public virtual ICollection<TaiKhoan> TaiKhoans { get; set; } = new List<TaiKhoan>();
}

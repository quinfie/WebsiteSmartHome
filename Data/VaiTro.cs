using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class VaiTro
{
    public Guid Id { get; set; }

    public string TenVaiTro { get; set; } = null!;

    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
}

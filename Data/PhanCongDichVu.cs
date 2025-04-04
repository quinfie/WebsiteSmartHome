using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class PhanCongDichVu
{
    public Guid Id { get; set; }

    public Guid MaYeuCau { get; set; }

    public Guid MaKyThuatVien { get; set; }

    public DateTime? NgayPhanCong { get; set; }

    public string TrangThaiPhanCong { get; set; } = null!;

    public virtual NguoiDung MaKyThuatVienNavigation { get; set; } = null!;

    public virtual YeuCauDichVu MaYeuCauNavigation { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class TaiKhoan
{
    public Guid Id { get; set; }

    public string TenTaiKhoan { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public string Email { get; set; } = null!;

    public System.DateTime? NgayTao { get; set; }

    public string TrangThai { get; set; } = null!;

    public virtual NguoiDung? NguoiDung { get; set; }
}

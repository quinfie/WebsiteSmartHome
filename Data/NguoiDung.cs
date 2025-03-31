using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class NguoiDung
{
    public Guid Id { get; set; }

    public string TenNguoiDung { get; set; } = null!;

    public string? GioiTinh { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string? Cccd { get; set; }

    public string? Sdt { get; set; }

    public string DiaChi { get; set; } = null!;

    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();

    public virtual ICollection<PhanCongDichVu> PhanCongDichVus { get; set; } = new List<PhanCongDichVu>();

    public virtual ICollection<TaiKhoan> TaiKhoans { get; set; } = new List<TaiKhoan>();

    public virtual ICollection<YeuCauDichVu> YeuCauDichVus { get; set; } = new List<YeuCauDichVu>();
}

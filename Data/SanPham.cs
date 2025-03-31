using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class SanPham
{
    public Guid Id { get; set; }

    public string TenSanPham { get; set; } = null!;

    public decimal Gia { get; set; }

    public int? SoLuongTon { get; set; }

    public int ThoiGianBaoHanh { get; set; }

    public int ThoiGianBaoTri { get; set; }

    public string? MoTa { get; set; }

    public Guid MaDanhMuc { get; set; }

    public Guid MaNhaCungCap { get; set; }

    public Guid MaKho { get; set; }

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    public virtual DanhMuc MaDanhMucNavigation { get; set; } = null!;

    public virtual Kho MaKhoNavigation { get; set; } = null!;

    public virtual NhaCungCap MaNhaCungCapNavigation { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class DonHang
{
    public Guid Id { get; set; }

    public Guid MaNguoiDung { get; set; }

    public decimal TongTien { get; set; }

    public string TrangThaiDonHang { get; set; } = null!;

    public System.DateTime NgayDat { get; set; }

    public Guid? MaKhuyenMai { get; set; }

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    public virtual KhuyenMai? MaKhuyenMaiNavigation { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class ChiTietDonHang
{
    public Guid MaDonHang { get; set; }

    public Guid MaSanPham { get; set; }

    public int SoLuong { get; set; }

    public decimal DonGia { get; set; }

    public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    public virtual ICollection<LichBaoTri> LichBaoTris { get; set; } = new List<LichBaoTri>();

    public virtual DonHang MaDonHangNavigation { get; set; } = null!;

    public virtual SanPham MaSanPhamNavigation { get; set; } = null!;

    public virtual ICollection<YeuCauDichVu> YeuCauDichVus { get; set; } = new List<YeuCauDichVu>();
}

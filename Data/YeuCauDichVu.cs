using System;
using System.Collections.Generic;

namespace WebsiteSmartHome.Data;

public partial class YeuCauDichVu
{
    public Guid Id { get; set; }

    public Guid MaDonHang { get; set; }

    public Guid MaSanPham { get; set; }

    public string LoaiDichVu { get; set; } = null!;

    public string TrangThaiYeuCau { get; set; } = null!;

    public decimal? ChiPhiPhatSinh { get; set; }

    public DateTime? NgayHen { get; set; }

    public string? MoTa { get; set; }

    public Guid MaNguoiTao { get; set; }

    public virtual ChiTietDonHang ChiTietDonHang { get; set; } = null!;

    public virtual NguoiDung MaNguoiTaoNavigation { get; set; } = null!;

    public virtual ICollection<PhanCongDichVu> PhanCongDichVus { get; set; } = new List<PhanCongDichVu>();
}

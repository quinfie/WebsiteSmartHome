using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebsiteSmartHome.Data;

public partial class ChiTietDonHang
{
    public int Id { get; set; }
    public Guid MaDonHang { get; set; }

    public Guid MaSanPham { get; set; }

    public int SoLuong { get; set; }

    public decimal DonGia { get; set; }

    /// <summary>
    /// Tập hợp các đánh giá liên quan đến chi tiết đơn hàng này.
    /// </summary>
    public ICollection<DanhGia> DanhGias { get; set; } = new List<DanhGia>();

    public virtual ICollection<LichBaoTri> LichBaoTris { get; set; } = new List<LichBaoTri>();

    public virtual DonHang MaDonHangNavigation { get; set; } = null!;

    public virtual SanPham MaSanPhamNavigation { get; set; } = null!;

    [NotMapped]
    public virtual SanPham SanPham { get; set; } = new SanPham();
    public virtual ICollection<YeuCauDichVu> YeuCauDichVus { get; set; } = new List<YeuCauDichVu>();
    //public ICollection<YeuCauDichVu> YeuCauDichVus { get; set; }
}

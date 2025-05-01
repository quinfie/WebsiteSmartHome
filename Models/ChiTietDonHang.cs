using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("ChiTietDonHang")]
[Index("MaDonHang", "MaSanPham", Name = "UQ_ChiTietDonHang_MaDonHang_MaSanPham", IsUnique = true)]
public partial class ChiTietDonHang
{
    [Key]
    public int Id { get; set; }

    public Guid MaDonHang { get; set; }

    public Guid MaSanPham { get; set; }

    public int SoLuong { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal DonGia { get; set; }

    [InverseProperty("ChiTietDonHang")]
    public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    [InverseProperty("MaChiTietDonHangNavigation")]
    public virtual ICollection<LichBaoTri> LichBaoTris { get; set; } = new List<LichBaoTri>();

    [ForeignKey("MaDonHang")]
    [InverseProperty("ChiTietDonHangs")]
    public virtual DonHang MaDonHangNavigation { get; set; } = null!;

    [ForeignKey("MaSanPham")]
    [InverseProperty("ChiTietDonHangs")]
    public virtual SanPham MaSanPhamNavigation { get; set; } = null!;

    [InverseProperty("MaChiTietDonHangNavigation")]
    public virtual ICollection<YeuCauDichVu> YeuCauDichVus { get; set; } = new List<YeuCauDichVu>();
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("YeuCauDichVu")]
public partial class YeuCauDichVu
{
    [Key]
    public Guid Id { get; set; }

    public int MaChiTietDonHang { get; set; }

    [StringLength(20)]
    public string LoaiDichVu { get; set; } = null!;

    [StringLength(50)]
    public string TrangThaiYeuCau { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal ChiPhiYeuCau { get; set; }

    public DateOnly NgayHen { get; set; }

    public string? MoTa { get; set; }

    [ForeignKey("MaChiTietDonHang")]
    [InverseProperty("YeuCauDichVus")]
    public virtual ChiTietDonHang MaChiTietDonHangNavigation { get; set; } = null!;

    [InverseProperty("MaYeuCauNavigation")]
    public virtual ICollection<PhanCongDichVu> PhanCongDichVus { get; set; } = new List<PhanCongDichVu>();
}

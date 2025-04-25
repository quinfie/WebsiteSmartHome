using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("SanPham")]
[Index("TenSanPham", Name = "UQ__SanPham__FCA8046956C1DB55", IsUnique = true)]
public partial class SanPham
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(255)]
    public string TenSanPham { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Gia { get; set; }

    public int? SoLuongTon { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime NgaySanXuat { get; set; }

    public int ThoiGianBaoHanh { get; set; }

    public string? MoTa { get; set; }

    public Guid MaDanhMuc { get; set; }

    public Guid MaNhaCungCap { get; set; }

    public Guid MaKho { get; set; }

    [InverseProperty("MaSanPhamNavigation")]
    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    [ForeignKey("MaDanhMuc")]
    [InverseProperty("SanPhams")]
    public virtual DanhMuc MaDanhMucNavigation { get; set; } = null!;

    [ForeignKey("MaKho")]
    [InverseProperty("SanPhams")]
    public virtual Kho MaKhoNavigation { get; set; } = null!;

    [ForeignKey("MaNhaCungCap")]
    [InverseProperty("SanPhams")]
    public virtual NhaCungCap MaNhaCungCapNavigation { get; set; } = null!;
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("Kho")]
[Index("SoDienThoai", Name = "UQ__Kho__0389B7BDDF5347DE", IsUnique = true)]
[Index("TenKho", Name = "UQ__Kho__33A304E19BB394EA", IsUnique = true)]
public partial class Kho
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(255)]
    public string TenKho { get; set; } = null!;

    public string? DiaChi { get; set; }

    [StringLength(10)]
    public string? SoDienThoai { get; set; }

    [InverseProperty("MaKhoNavigation")]
    public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
}

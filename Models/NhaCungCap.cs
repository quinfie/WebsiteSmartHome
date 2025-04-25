using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("NhaCungCap")]
[Index("SoDienThoai", Name = "UQ__NhaCungC__0389B7BDC26790F5", IsUnique = true)]
[Index("Email", Name = "UQ__NhaCungC__A9D10534FF896F7A", IsUnique = true)]
[Index("TenNhaCungCap", Name = "UQ__NhaCungC__C6818DB2BC5E7CE6", IsUnique = true)]
public partial class NhaCungCap
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(255)]
    public string TenNhaCungCap { get; set; } = null!;

    public string? DiaChi { get; set; }

    [StringLength(10)]
    public string? SoDienThoai { get; set; }

    [StringLength(255)]
    public string? Email { get; set; }

    [InverseProperty("MaNhaCungCapNavigation")]
    public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
}

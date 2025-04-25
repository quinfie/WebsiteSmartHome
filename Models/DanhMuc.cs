using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("DanhMuc")]
[Index("TenDanhMuc", Name = "UQ__DanhMuc__650CAE4EF19C64B0", IsUnique = true)]
public partial class DanhMuc
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(255)]
    public string TenDanhMuc { get; set; } = null!;

    public string? MoTa { get; set; }

    [InverseProperty("MaDanhMucNavigation")]
    public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("KhuyenMai")]
[Index("TenKhuyenMai", Name = "UQ__KhuyenMa__A956B87C202B1025", IsUnique = true)]
public partial class KhuyenMai
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(100)]
    public string TenKhuyenMai { get; set; } = null!;

    public int PhanTramGiam { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime NgayBatDau { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime NgayKetThuc { get; set; }

    [InverseProperty("MaKhuyenMaiNavigation")]
    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();
}

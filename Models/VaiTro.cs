using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("VaiTro")]
[Index("TenVaiTro", Name = "UQ__VaiTro__1DA55814B23A047B", IsUnique = true)]
public partial class VaiTro
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(100)]
    public string TenVaiTro { get; set; } = null!;

    [InverseProperty("MaVaiTroNavigation")]
    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
}

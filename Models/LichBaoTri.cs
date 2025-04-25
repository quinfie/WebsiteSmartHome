using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("LichBaoTri")]
public partial class LichBaoTri
{
    [Key]
    public Guid Id { get; set; }

    public int MaChiTietDonHang { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime NgayBaoTri { get; set; }

    [StringLength(50)]
    public string LoaiBaoTri { get; set; } = null!;

    [StringLength(50)]
    public string TrangThai { get; set; } = null!;

    [ForeignKey("MaChiTietDonHang")]
    [InverseProperty("LichBaoTris")]
    public virtual ChiTietDonHang MaChiTietDonHangNavigation { get; set; } = null!;
}

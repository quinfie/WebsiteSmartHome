using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

public partial class DanhGia
{
    [Key]
    public Guid Id { get; set; }

    public Guid MaDonHang { get; set; }

    public Guid MaSanPham { get; set; }

    public int SoSao { get; set; }

    [StringLength(500)]
    public string? NoiDung { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayDanhGia { get; set; }

    [ForeignKey("MaDonHang, MaSanPham")]
    [InverseProperty("DanhGia")]
    public virtual ChiTietDonHang ChiTietDonHang { get; set; } = null!;
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("DonHang")]
public partial class DonHang
{
    [Key]
    public Guid Id { get; set; }

    public Guid MaNguoiDung { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal TongTien { get; set; }

    [StringLength(50)]
    public string TrangThaiDonHang { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime NgayDat { get; set; }

    public Guid? MaKhuyenMai { get; set; }

    [InverseProperty("MaDonHangNavigation")]
    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    [ForeignKey("MaKhuyenMai")]
    [InverseProperty("DonHangs")]
    public virtual KhuyenMai? MaKhuyenMaiNavigation { get; set; }

    [ForeignKey("MaNguoiDung")]
    [InverseProperty("DonHangs")]
    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}

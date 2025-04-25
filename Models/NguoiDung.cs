using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("NguoiDung")]
[Index("MaTaiKhoan", Name = "UQ__NguoiDun__AD7C6528FB4359A4", IsUnique = true)]
public partial class NguoiDung
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(255)]
    public string TenNguoiDung { get; set; } = null!;

    public string DiaChi { get; set; } = null!;

    [StringLength(3)]
    public string GioiTinh { get; set; } = null!;

    [Column("CCCD")]
    [StringLength(12)]
    [Unicode(false)]
    public string Cccd { get; set; } = null!;

    [StringLength(10)]
    public string SoDienThoai { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? NgaySinh { get; set; }

    public Guid MaTaiKhoan { get; set; }

    public Guid MaVaiTro { get; set; }

    [InverseProperty("MaNguoiDungNavigation")]
    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();

    [ForeignKey("MaTaiKhoan")]
    [InverseProperty("NguoiDung")]
    public virtual TaiKhoan MaTaiKhoanNavigation { get; set; } = null!;

    [ForeignKey("MaVaiTro")]
    [InverseProperty("NguoiDungs")]
    public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;

    [InverseProperty("MaKyThuatVienNavigation")]
    public virtual ICollection<PhanCongDichVu> PhanCongDichVus { get; set; } = new List<PhanCongDichVu>();
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("TaiKhoan")]
[Index("Email", Name = "UQ__TaiKhoan__A9D1053492856D42", IsUnique = true)]
[Index("TenTaiKhoan", Name = "UQ__TaiKhoan__B106EAF836A161B9", IsUnique = true)]
public partial class TaiKhoan
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(100)]
    public string TenTaiKhoan { get; set; } = null!;

    [StringLength(255)]
    public string MatKhau { get; set; } = null!;

    [StringLength(255)]
    public string Email { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [StringLength(20)]
    public string TrangThai { get; set; } = null!;

    [InverseProperty("MaTaiKhoanNavigation")]
    public virtual NguoiDung? NguoiDung { get; set; }
}

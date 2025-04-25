using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

[Table("PhanCongDichVu")]
public partial class PhanCongDichVu
{
    [Key]
    public Guid Id { get; set; }

    public Guid MaYeuCau { get; set; }

    public Guid MaKyThuatVien { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime NgayPhanCong { get; set; }

    [StringLength(100)]
    public string TrangThaiPhanCong { get; set; } = null!;

    [ForeignKey("MaKyThuatVien")]
    [InverseProperty("PhanCongDichVus")]
    public virtual NguoiDung MaKyThuatVienNavigation { get; set; } = null!;

    [ForeignKey("MaYeuCau")]
    [InverseProperty("PhanCongDichVus")]
    public virtual YeuCauDichVu MaYeuCauNavigation { get; set; } = null!;
}

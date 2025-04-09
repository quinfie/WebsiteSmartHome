using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebsiteSmartHome.Data;

public partial class SanPham
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string TenSanPham { get; set; } = null!;

    [Required]
    public decimal Gia { get; set; }

    public int? SoLuongTon { get; set; }

    [Required]
    public int ThoiGianBaoHanh { get; set; }

    [Required]
    public int ThoiGianBaoTri { get; set; }

    public string? MoTa { get; set; }

    [Required]
    public Guid MaDanhMuc { get; set; }

    [Required]
    public Guid MaNhaCungCap { get; set; }

    [Required]
    public Guid MaKho { get; set; }

    // Định nghĩa khóa ngoại rõ ràng
    [ForeignKey("MaDanhMuc")]
    public virtual DanhMuc DanhMuc { get; set; } = null!;

    [ForeignKey("MaNhaCungCap")]
    public virtual NhaCungCap NhaCungCap { get; set; } = null!;

    [ForeignKey("MaKho")]
    public virtual Kho Kho { get; set; } = null!;

}

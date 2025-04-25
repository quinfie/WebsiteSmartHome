using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Models;

public partial class WebsiteSmartHomeContext : DbContext
{
    public WebsiteSmartHomeContext()
    {
    }

    public WebsiteSmartHomeContext(DbContextOptions<WebsiteSmartHomeContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }

    public virtual DbSet<DanhGium> DanhGia { get; set; }

    public virtual DbSet<DanhMuc> DanhMucs { get; set; }

    public virtual DbSet<DonHang> DonHangs { get; set; }

    public virtual DbSet<Kho> Khos { get; set; }

    public virtual DbSet<KhuyenMai> KhuyenMais { get; set; }

    public virtual DbSet<LichBaoTri> LichBaoTris { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NhaCungCap> NhaCungCaps { get; set; }

    public virtual DbSet<PhanCongDichVu> PhanCongDichVus { get; set; }

    public virtual DbSet<SanPham> SanPhams { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    public virtual DbSet<VaiTro> VaiTros { get; set; }

    public virtual DbSet<YeuCauDichVu> YeuCauDichVus { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=(local);uid=sa;pwd=123;database=WebsiteSmartHome;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChiTietDonHang>(entity =>
        {
            // Chỉ định rõ tên bảng
            entity.ToTable("ChiTietDonHang");

            // Khóa chính
            entity.HasKey(e => e.Id).HasName("PK__ChiTietD__3214EC07B2A258C5");

            // Quan hệ với bảng DonHang
            entity.HasOne(d => d.MaDonHangNavigation)
                  .WithMany(p => p.ChiTietDonHangs)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_ChiTietDonHang_DonHang");

            // Quan hệ với bảng SanPham
            entity.HasOne(d => d.MaSanPhamNavigation)
                  .WithMany(p => p.ChiTietDonHangs)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_ChiTietDonHang_SanPham");
        });

        modelBuilder.Entity<DanhGium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DanhGia__3214EC0710E6DDCE");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayDanhGia).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.ChiTietDonHang).WithMany(p => p.DanhGia)
                .HasPrincipalKey(p => new { p.MaDonHang, p.MaSanPham })
                .HasForeignKey(d => new { d.MaDonHang, d.MaSanPham })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DanhGia_ChiTietDH");
        });

        modelBuilder.Entity<DanhMuc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DanhMuc__3214EC0758C083E5");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DonHang__3214EC07E3266E49");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayDat).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaKhuyenMaiNavigation)      // DonHang → KhuyenMai
           .WithMany(k => k.DonHangs)                  // KhuyenMai → ICollection<DonHang>
           .HasForeignKey(d => d.MaKhuyenMai)          // rõ ràng MaKhuyenMai là FK
           .OnDelete(DeleteBehavior.ClientSetNull)           // hoặc ClientSetNull tùy bạn
           .HasConstraintName("FK_DonHang_KhuyenMai");


            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.DonHangs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DonHang_NguoiDung");
        });

        modelBuilder.Entity<Kho>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Kho__3214EC07036D7ED2");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
        });

        modelBuilder.Entity<KhuyenMai>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__KhuyenMa__3214EC07EC81046B");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

            // Xác định lại mối quan hệ từ KhuyenMai tới DonHang
            entity.HasMany(k => k.DonHangs)
                .WithOne(d => d.MaKhuyenMaiNavigation)
                .HasForeignKey(d => d.MaKhuyenMai)
                .HasConstraintName("FK_DonHang_KhuyenMai");
        });

        modelBuilder.Entity<LichBaoTri>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__LichBaoT__3214EC07D91B6491");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

            entity.HasOne(d => d.MaChiTietDonHangNavigation).WithMany(p => p.LichBaoTris)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LichBaoTri_ChiTietDonHang");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__NguoiDun__3214EC07E4D367BB");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithOne(p => p.NguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NguoiDung_TaiKhoan");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.NguoiDungs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NguoiDung_VaiTro");
        });

        modelBuilder.Entity<NhaCungCap>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__NhaCungC__3214EC07D44E96FC");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
        });

        modelBuilder.Entity<PhanCongDichVu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PhanCong__3214EC072F21DE35");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.TrangThaiPhanCong).HasDefaultValue("Đang chờ xử lý");

            entity.HasOne(d => d.MaKyThuatVienNavigation).WithMany(p => p.PhanCongDichVus)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PCDV_KyThuatVien");

            entity.HasOne(d => d.MaYeuCauNavigation).WithMany(p => p.PhanCongDichVus)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PCDV_YeuCauDichVu");
        });

        modelBuilder.Entity<SanPham>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SanPham__3214EC070C203B72");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.SoLuongTon).HasDefaultValue(0);

            entity.HasOne(d => d.MaDanhMucNavigation).WithMany(p => p.SanPhams)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_DanhMuc");

            entity.HasOne(d => d.MaKhoNavigation).WithMany(p => p.SanPhams)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_Kho");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.SanPhams)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_NhaCungCap");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TaiKhoan__3214EC0779FCBCB2");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TrangThai).HasDefaultValue("Chờ xác minh");
        });

        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__VaiTro__3214EC078FB904D1");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
        });

        modelBuilder.Entity<YeuCauDichVu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__YeuCauDi__3214EC073574199A");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())"); // Nếu Id là Guid
            entity.Property(e => e.TrangThaiYeuCau).HasDefaultValue("Đang chờ xử lý");

            entity.HasOne(d => d.MaChiTietDonHangNavigation)
        .WithMany(p => p.YeuCauDichVus)
        .HasForeignKey(d => d.MaChiTietDonHang)
        .OnDelete(DeleteBehavior.ClientSetNull)
        .HasConstraintName("FK_YeuCauDichVu_ChiTietDonHang");
        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

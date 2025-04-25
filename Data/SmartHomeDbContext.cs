using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Data;

public partial class SmartHomeDbContext : DbContext
{
    public SmartHomeDbContext(DbContextOptions<SmartHomeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; } = null!;

    public virtual DbSet<DanhGia> DanhGias { get; set; } = null!;

    public virtual DbSet<DanhMuc> DanhMucs { get; set; } = null!;

    public virtual DbSet<DonHang> DonHangs { get; set; } = null!;

    public virtual DbSet<Kho> Khos { get; set; } = null!;

    public virtual DbSet<KhuyenMai> KhuyenMais { get; set; } = null!;

    public virtual DbSet<LichBaoTri> LichBaoTris { get; set; } = null!;

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; } = null!;

    public virtual DbSet<NhaCungCap> NhaCungCaps { get; set; } = null!;

    public virtual DbSet<SanPham> SanPhams { get; set; } = null!;

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; } = null!;

    public virtual DbSet<VaiTro> VaiTros { get; set; } = null!;

    public virtual DbSet<YeuCauDichVu> YeuCauDichVus { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Ánh xạ ChiTietDonHang
        modelBuilder.Entity<ChiTietDonHang>(entity =>
        {
            entity.ToTable("ChiTietDonHang");

            // Khóa chính
            entity.HasKey(e => e.Id)
                  .HasName("PK_ChiTietDonHang");

            entity.HasAlternateKey(e => new { e.MaDonHang, e.MaSanPham })
            .HasName("AK_ChiTietDonHang_MaDonHang_MaSanPham");
            // Các cột
            entity.Property(e => e.MaDonHang).IsRequired();
            entity.Property(e => e.MaSanPham).IsRequired();
            entity.Property(e => e.SoLuong).IsRequired();
            entity.Property(e => e.DonGia)
                  .HasColumnType("decimal(18,2)")
                  .IsRequired();

            // Quan hệ đến DonHang
            entity.HasOne(e => e.MaDonHangNavigation)           // navigation property
                  .WithMany(dh => dh.ChiTietDonHangs)           // DonHang.ChiTietDonHangs
                  .HasForeignKey(e => e.MaDonHang)              // FK cột MaDonHang
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_ChiTietDonHang_DonHang");

            // Quan hệ đến SanPham
            entity.HasOne(e => e.MaSanPhamNavigation)          // navigation property
                  .WithMany(sp => sp.ChiTietDonHangs)           // SanPham.ChiTietDonHangs
                  .HasForeignKey(e => e.MaSanPham)              // FK cột MaSanPham
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_ChiTietDonHang_SanPham");
        });

        modelBuilder.Entity<DanhGia>(entity =>
        {
            entity.ToTable("DanhGia");
            entity.HasKey(e => e.Id).HasName("PK__DanhGia__3214EC07224FF011");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())");

            entity.Property(e => e.NgayDanhGia)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.NoiDung)
                .HasMaxLength(500);

            // Thiết lập quan hệ nhiều - một (Many-to-One) với ChiTietDonHang
            entity.HasOne(d => d.ChiTietDonHang)
                .WithMany(p => p.DanhGias) // ChiTietDonHang có nhiều DanhGia
                .HasForeignKey(d => new { d.MaDonHang, d.MaSanPham }) // Khóa ngoại composite
                .HasPrincipalKey(p => new { p.MaDonHang, p.MaSanPham }) // Khóa chính composite
                .OnDelete(DeleteBehavior.ClientSetNull) // Thiết lập hành vi khi xóa
                .HasConstraintName("FK_DanhGia_ChiTietDonHang"); // Đặt tên cho constraint

        });

        modelBuilder.Entity<DanhMuc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DanhMuc__3214EC075C527BD0");

            entity.ToTable("DanhMuc");

            entity.HasIndex(e => e.TenDanhMuc, "UQ__DanhMuc__650CAE4E0F3F8749").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.TenDanhMuc).HasMaxLength(255);
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DonHang__3214EC07F056B45F");

            entity.ToTable("DonHang");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayDat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TongTien).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TrangThaiDonHang).HasMaxLength(50);

            entity.HasOne(d => d.MaKhuyenMaiNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaKhuyenMai)
                .HasConstraintName("FK_DonHang_KhuyenMai");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DonHang_NguoiDung");
        });

        modelBuilder.Entity<Kho>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Kho__3214EC075065BD3C");

            entity.ToTable("Kho");

            entity.HasIndex(e => e.SoDienThoai, "UQ__Kho__0389B7BDA85F47D1").IsUnique();

            entity.HasIndex(e => e.TenKho, "UQ__Kho__33A304E163B31276").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.SoDienThoai).HasMaxLength(10);
            entity.Property(e => e.TenKho).HasMaxLength(255);
        });

        modelBuilder.Entity<KhuyenMai>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__KhuyenMa__3214EC0763F4EF6F");

            entity.ToTable("KhuyenMai");

            entity.HasIndex(e => e.TenKhuyenMai, "UQ__KhuyenMa__A956B87C3A0FFBD5").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayBatDau).HasColumnType("datetime");
            entity.Property(e => e.NgayKetThuc).HasColumnType("datetime");
            entity.Property(e => e.TenKhuyenMai).HasMaxLength(100);
        });

        base.OnModelCreating(modelBuilder);
        OnModelCreatingPartial(modelBuilder);
        // --- 2. Định nghĩa LichBaoTri: FK -> ChiTietDonHang.Id ---
        modelBuilder.Entity<LichBaoTri>(entity =>
        {
            entity.ToTable("LichBaoTri");

            // Khóa chính
            entity.HasKey(e => e.Id)
                  .HasName("PK_LichBaoTri");

            entity.Property(e => e.Id)
                  .HasDefaultValueSql("NEWID()");

            // Ánh xạ cột MaChiTietDonHang
            entity.Property(e => e.MaChiTietDonHang)
                  .HasColumnName("MaChiTietDonHang")
                  .IsRequired();

            entity.Property(e => e.NgayBaoTri)
                  .HasColumnName("NgayBaoTri")
                  .HasColumnType("datetime")
                  .IsRequired();

            entity.Property(e => e.LoaiBaoTri)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.Property(e => e.TrangThai)
                  .HasMaxLength(50)
                  .IsRequired();

            // FK về ChiTietDonHang.Id
            entity.HasOne(e => e.ChiTietDonHang)
                  .WithMany(ct => ct.LichBaoTris)
                  .HasForeignKey(e => e.MaChiTietDonHang)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_LichBaoTri_ChiTietDonHang");
        });


        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__NguoiDun__3214EC07F4F20181");

            entity.ToTable("NguoiDung");

            entity.HasIndex(e => e.MaTaiKhoan, "UQ__NguoiDun__AD7C6528AAFDE54C").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.CCCD)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.GioiTinh).HasMaxLength(3);
            entity.Property(e => e.NgaySinh).HasColumnType("datetime");
            entity.Property(e => e.SoDienThoai).HasMaxLength(10);
            entity.Property(e => e.TenNguoiDung).HasMaxLength(255);

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithOne(p => p.NguoiDung)
                .HasForeignKey<NguoiDung>(d => d.MaTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NguoiDung_TaiKhoan");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaVaiTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NguoiDung_VaiTro");
        });

        modelBuilder.Entity<NhaCungCap>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__NhaCungC__3214EC071829E405");

            entity.ToTable("NhaCungCap");

            entity.HasIndex(e => e.SoDienThoai, "UQ__NhaCungC__0389B7BD21A1A401").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__NhaCungC__A9D1053401C44114").IsUnique();

            entity.HasIndex(e => e.TenNhaCungCap, "UQ__NhaCungC__C6818DB23E0D50B0").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.SoDienThoai).HasMaxLength(10);
            entity.Property(e => e.TenNhaCungCap).HasMaxLength(255);
        });

        modelBuilder.Entity<SanPham>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SanPham__3214EC078A505991");

            entity.ToTable("SanPham");

            entity.HasIndex(e => e.TenSanPham, "UQ__SanPham__FCA80469DB7CBCA2").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Gia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.NgaySanXuat).HasColumnType("datetime");
            entity.Property(e => e.SoLuongTon).HasDefaultValue(0);
            entity.Property(e => e.TenSanPham).HasMaxLength(255);

            entity.HasOne(d => d.MaDanhMucNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaDanhMuc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_DanhMuc");

            entity.HasOne(d => d.MaKhoNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaKho)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_Kho");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_NhaCungCap");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TaiKhoan__3214EC07DB12ACAE");

            entity.ToTable("TaiKhoan");

            entity.HasIndex(e => e.Email, "UQ__TaiKhoan__A9D1053453F5538D").IsUnique();

            entity.HasIndex(e => e.TenTaiKhoan, "UQ__TaiKhoan__B106EAF8F6E64956").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.MatKhau).HasMaxLength(255);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenTaiKhoan).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Chờ xác minh");
        });

        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__VaiTro__3214EC076A4826A9");

            entity.ToTable("VaiTro");

            entity.HasIndex(e => e.TenVaiTro, "UQ__VaiTro__1DA55814B0D53D6F").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.TenVaiTro).HasMaxLength(100);
        });

        modelBuilder.Entity<YeuCauDichVu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__YeuCauDi__3214EC07F8C47CCA");

            entity.ToTable("YeuCauDichVu");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.ChiPhiPhatSinh)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LoaiDichVu).HasMaxLength(20);
            entity.Property(e => e.NgayHen).HasColumnType("datetime");
            entity.Property(e => e.TrangThaiYeuCau)
                .HasMaxLength(50)
                .HasDefaultValue("Đang chờ xử lý");

            entity.HasOne(d => d.MaNguoiTaoNavigation).WithMany(p => p.YeuCauDichVus)
                .HasForeignKey(d => d.MaNguoiTao)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_YCDV_NguoiTao");

            // FK → ChiTietDonHang.Id
            entity.HasOne(d => d.ChiTietDonHang)
                .WithMany(c => c.YeuCauDichVus)
                .HasForeignKey(d => d.MaChiTietDonHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_YeuCauDichVu_ChiTietDonHang");

        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

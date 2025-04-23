using System;
using System.Collections.Generic;
using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Data;

public partial class SmartHomeDbContext : DbContext
{
    public SmartHomeDbContext()
    {
    }

    public SmartHomeDbContext(DbContextOptions<SmartHomeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }

    public virtual DbSet<DanhGia> DanhGia { get; set; }

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

       


        modelBuilder.Entity<DanhMuc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DanhMuc__3214EC07950AC90E");

            entity.ToTable("DanhMuc");

            entity.HasIndex(e => e.TenDanhMuc, "UQ_DanhMuc_TenDanhMuc").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.TenDanhMuc).HasMaxLength(255);
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


        modelBuilder.Entity<Kho>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Kho__3214EC07CE39DBF1");

            entity.ToTable("Kho");

            entity.HasIndex(e => e.TenKho, "UQ_Kho_TenVaiTro").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.TenKho).HasMaxLength(255);
        });

        modelBuilder.Entity<KhuyenMai>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__KhuyenMa__3214EC07C74A905F");

            entity.ToTable("KhuyenMai");

            entity.HasIndex(e => e.TenKhuyenMai, "UQ_KhuyenMai_TenDanhMuc").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayBatDau).HasColumnType("datetime");
            entity.Property(e => e.NgayKetThuc).HasColumnType("datetime");
            entity.Property(e => e.PhanTramGiam).HasColumnType("decimal(5, 2)");
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
            entity.HasKey(e => e.Id).HasName("PK__NguoiDun__3214EC07FABF4072");

            entity.ToTable("NguoiDung");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Cccd)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("CCCD");
            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.GioiTinh).HasMaxLength(3);
            entity.Property(e => e.Sdt)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("SDT");
            entity.Property(e => e.TenNguoiDung).HasMaxLength(100);
        });

        modelBuilder.Entity<NhaCungCap>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__NhaCungC__3214EC07536663CC");

            entity.ToTable("NhaCungCap");

            entity.HasIndex(e => e.Email, "UQ_NhaCungCap_Email").IsUnique();

            entity.HasIndex(e => e.TenNhaCungCap, "UQ_NhaCungCap_TenVaiTro").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Sdt)
                .HasMaxLength(11)
                .IsUnicode(false)
                .HasColumnName("SDT");
            entity.Property(e => e.TenNhaCungCap).HasMaxLength(255);
        });

        modelBuilder.Entity<PhanCongDichVu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PhanCong__3214EC075170783A");

            entity.ToTable("PhanCongDichVu");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayPhanCong)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TrangThaiPhanCong)
                .HasMaxLength(100)
                .HasDefaultValue("Đang chờ xử lý");

            entity.HasOne(d => d.MaKyThuatVienNavigation).WithMany(p => p.PhanCongDichVus)
                .HasForeignKey(d => d.MaKyThuatVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhanCongD__MaKyT__0C85DE4D");

            entity.HasOne(d => d.MaYeuCauNavigation).WithMany(p => p.PhanCongDichVus)
                .HasForeignKey(d => d.MaYeuCau)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhanCongD__MaYeu__0B91BA14");
        });

        modelBuilder.Entity<SanPham>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SanPham__3214EC076F8BBC44");

            entity.ToTable("SanPham");

            entity.HasIndex(e => e.TenSanPham, "UQ_SanPham_TenSanPham").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Gia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SoLuongTon).HasDefaultValue(0);
            entity.Property(e => e.TenSanPham).HasMaxLength(255);
            entity.Property(e => e.ThoiGianBaoHanh).HasDefaultValue(12);

            entity.HasOne(d => d.MaDanhMucNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaDanhMuc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SanPham__MaDanhM__60A75C0F");

            entity.HasOne(d => d.MaKhoNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaKho)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SanPham__MaKho__628FA481");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SanPham__MaNhaCu__619B8048");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TaiKhoan__3214EC0757401007");

            entity.ToTable("TaiKhoan");

            entity.HasIndex(e => e.Email, "UQ_TaiKhoan_Email").IsUnique();

            entity.HasIndex(e => e.TenTaiKhoan, "UQ_TaiKhoan_TenTaiKhoan").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__TaiKhoan__A9D105348803A0F5").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.MatKhau).HasMaxLength(255);
            entity.Property(e => e.TenTaiKhoan).HasMaxLength(255);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Chờ xác minh");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.TaiKhoans)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TaiKhoan__MaNguo__571DF1D5");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.TaiKhoans)
                .HasForeignKey(d => d.MaVaiTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TaiKhoan__MaVaiT__5812160E");
        });

        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__VaiTro__3214EC07B56A837B");

            entity.ToTable("VaiTro");

            entity.HasIndex(e => e.TenVaiTro, "UQ_VaiTro_TenVaiTro").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.TenVaiTro).HasMaxLength(50);
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.ToTable("DonHang"); // Khớp đúng với tên trong database

            entity.HasKey(e => e.Id).HasName("PK_DonHang");


            // Cấu hình mối quan hệ giữa DonHang và NguoiDung
            entity.HasOne(d => d.MaNguoiDungNavigation)
                  .WithMany(nd => nd.DonHangs)  // assuming NguoiDung has ICollection<DonHang> DonHangs
                  .HasForeignKey(d => d.MaNguoiDung)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_DonHang_NguoiDung");


            entity.HasOne(dh => dh.MaKhuyenMaiNavigation)
                  .WithMany(km => km.DonHangs)
                  .HasForeignKey(dh => dh.MaKhuyenMai)
                  .HasConstraintName("FK_DonHang_KhuyenMai");

            entity.Property(e => e.TongTien)
          .HasColumnType("decimal(18,2)");
        });


        modelBuilder.Entity<YeuCauDichVu>(entity =>
        {
            entity.ToTable("YeuCauDichVu");

            entity.HasKey(e => e.Id).HasName("PK__YeuCauDi__3214EC073574199A");
            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

            entity.Property(e => e.LoaiDichVu).HasMaxLength(20).IsRequired();
            entity.Property(e => e.TrangThaiYeuCau).HasMaxLength(50).IsRequired();
            entity.Property(e => e.ChiPhiYeuCau).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.NgayHen).HasColumnType("datetime");
            entity.Property(e => e.MoTa);

            // FK → ChiTietDonHang.Id
            entity.HasOne(d => d.ChiTietDonHang)
                .WithMany(c => c.YeuCauDichVus)
                .HasForeignKey(d => d.MaChiTietDonHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_YeuCauDichVu_ChiTietDonHang");

            // FK → NguoiDung.Id
            entity.HasOne(d => d.MaNguoiTaoNavigation)
                .WithMany(u => u.YeuCauDichVus)
                .HasForeignKey(d => d.MaNguoiTao)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_YeuCauDichVu_NguoiDung");
        });

    }
    //    OnModelCreatingPartial(modelBuilder);
    //    modelBuilder.Entity<LichBaoTri>()
    //    .HasOne(lb => lb.DonHang)
    //    .WithMany() // Nếu quan hệ là 1-N
    //    .HasForeignKey(lb => lb.MaDonHang)
    //    .HasConstraintName("FK_LichBaoTri_DonHang"); // Tùy chỉnh tên của foreign key (nếu cần)

    //    modelBuilder.Entity<LichBaoTri>()
    //        .HasOne(lb => lb.SanPham)
    //        .WithMany() // Nếu quan hệ là 1-N
    //        .HasForeignKey(lb => lb.MaSanPham)
    //        .HasConstraintName("FK_LichBaoTri_SanPham"); // Tùy chỉnh tên của foreign key (nếu cần)

    //    // Các ánh xạ khác
    //    modelBuilder.Entity<LichBaoTri>()
    //        .Property(lb => lb.MaDonHang)
    //        .HasColumnName("MaDonHang"); // Nếu cần thiết lập lại tên cột trong cơ sở dữ liệu

    //    modelBuilder.Entity<LichBaoTri>()
    //        .Property(lb => lb.MaSanPham)
    //        .HasColumnName("MaSanPham"); // Tương tự cho MaSanPham
    //}

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChiTietDonHang>(entity =>
        {
            entity.HasKey(e => new { e.MaDonHang, e.MaSanPham }).HasName("PK__ChiTietD__DD39F0EF17D272C8");

            entity.ToTable("ChiTietDonHang");

            entity.Property(e => e.DonGia).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.MaDonHangNavigation).WithMany(p => p.ChiTietDonHangs)
                .HasForeignKey(d => d.MaDonHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietDo__MaDon__76969D2E");

            //entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.ChiTietDonHangs)
            //    .HasForeignKey(d => d.MaSanPham)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__ChiTietDo__MaSan__778AC167");
        });

        modelBuilder.Entity<DanhGium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DanhGia__3214EC07224FF011");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayDanhGia)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NoiDung).HasMaxLength(500);

            entity.HasOne(d => d.ChiTietDonHang).WithMany(p => p.DanhGia)
                .HasForeignKey(d => new { d.MaDonHang, d.MaSanPham })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DanhGia__14270015");
        });

        modelBuilder.Entity<DanhMuc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DanhMuc__3214EC07950AC90E");

            entity.ToTable("DanhMuc");

            entity.HasIndex(e => e.TenDanhMuc, "UQ_DanhMuc_TenDanhMuc").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.TenDanhMuc).HasMaxLength(255);
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DonHang__3214EC075CFB9141");

            entity.ToTable("DonHang");

            entity.HasIndex(e => e.MaKhuyenMai, "UQ_DonHang_MaKhuyenMai").IsUnique();

            entity.HasIndex(e => e.TrangThaiDonHang, "UQ_DonHang_TrangThai").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayDat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TongTien).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TrangThaiDonHang).HasMaxLength(50);

            entity.HasOne(d => d.MaKhuyenMaiNavigation).WithOne(p => p.DonHang)
                .HasForeignKey<DonHang>(d => d.MaKhuyenMai)
                .HasConstraintName("FK__DonHang__MaKhuye__6E01572D");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHang__MaNguoi__6D0D32F4");
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

        modelBuilder.Entity<LichBaoTri>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__LichBaoT__3214EC076ACCC0CE");

            entity.ToTable("LichBaoTri");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DaThongBao).HasDefaultValue(false);
            entity.Property(e => e.NgayBaoTriKeTiep).HasColumnType("datetime");

            entity.HasOne(d => d.ChiTietDonHang).WithMany(p => p.LichBaoTris)
                .HasForeignKey(d => new { d.MaDonHang, d.MaSanPham })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichBaoTri__04E4BC85");
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
            entity.Property(e => e.SDT)
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
            entity.Property(e => e.ThoiGianBaoTri).HasDefaultValue(12);

            //entity.HasOne(d => d.MaDanhMucNavigation).WithMany(p => p.SanPhams)
            //    .HasForeignKey(d => d.MaDanhMuc)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__SanPham__MaDanhM__60A75C0F");

            //entity.HasOne(d => d.MaKhoNavigation).WithMany(p => p.SanPhams)
            //    .HasForeignKey(d => d.MaKho)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__SanPham__MaKho__628FA481");

            //entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.SanPhams)
            //    .HasForeignKey(d => d.MaNhaCungCap)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__SanPham__MaNhaCu__619B8048");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TaiKhoan__3214EC0757401007");

            entity.ToTable("TaiKhoan");

            entity.HasIndex(e => e.Email, "UQ_TaiKhoan_Email").IsUnique();

            entity.HasIndex(e => e.MaNguoiDung, "UQ_TaiKhoan_MaNguoiDung").IsUnique();

            entity.HasIndex(e => e.TenTaiKhoan, "UQ_TaiKhoan_TenTaiKhoan").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__TaiKhoan__A9D105348803A0F5").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.MatKhau).HasMaxLength(255);
            entity.Property(e => e.TenTaiKhoan).HasMaxLength(255);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Chờ xác minh");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.TaiKhoan)
                .HasForeignKey<TaiKhoan>(d => d.MaNguoiDung)
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

        modelBuilder.Entity<YeuCauDichVu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__YeuCauDi__3214EC07A0802D14");

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
                .HasConstraintName("FK__YeuCauDic__MaNgu__7D439ABD");

            entity.HasOne(d => d.ChiTietDonHang).WithMany(p => p.YeuCauDichVus)
                .HasForeignKey(d => new { d.MaDonHang, d.MaSanPham })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauDichVu__7C4F7684");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

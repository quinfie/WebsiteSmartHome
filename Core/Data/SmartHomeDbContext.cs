using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore.SqlServer.Metadata.Internal;

namespace WebsiteSmartHome.Core.Data
{
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

        public virtual DbSet<DanhGia> DanhGias { get; set; }

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
                entity.HasKey(e => e.Id).HasName("PK__ChiTietD__3214EC079AE6E40C");

                entity.ToTable("ChiTietDonHang");

                entity.Property(e => e.DonGia).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.MaDonHangNavigation).WithMany(p => p.ChiTietDonHangs)
                    .HasForeignKey(d => d.MaDonHang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChiTietDonHang_DonHang");

                entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.ChiTietDonHangs)
                    .HasForeignKey(d => d.MaSanPham)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChiTietDonHang_SanPham");
            });

            modelBuilder.Entity<DanhGia>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__DanhGia__3214EC07D09015E8");

                entity.ToTable("DanhGia");

                entity.HasIndex(e => new { e.MaDonHang, e.MaSanPham }, "UC_DanhGia").IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.NgayDanhGia)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.NoiDung).HasMaxLength(500);

                entity.HasOne(d => d.MaDonHangNavigation).WithMany(p => p.DanhGias)
                    .HasForeignKey(d => d.MaDonHang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DanhGia_DonHang");

                entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.DanhGias)
                    .HasForeignKey(d => d.MaSanPham)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DanhGia_SanPham");
            });

            modelBuilder.Entity<DanhMuc>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__DanhMuc__3214EC07BD778A95");

                entity.ToTable("DanhMuc");

                entity.HasIndex(e => e.TenDanhMuc, "UQ__DanhMuc__650CAE4EF19C64B0").IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.TenDanhMuc).HasMaxLength(255);
            });

            modelBuilder.Entity<DonHang>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__DonHang__3214EC07E20EBC8F");

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
                entity.HasKey(e => e.Id).HasName("PK__Kho__3214EC07BC75C3E7");

                entity.ToTable("Kho");

                entity.HasIndex(e => e.SoDienThoai, "UQ__Kho__0389B7BDDF5347DE").IsUnique();

                entity.HasIndex(e => e.TenKho, "UQ__Kho__33A304E19BB394EA").IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.SoDienThoai).HasMaxLength(10);
                entity.Property(e => e.TenKho).HasMaxLength(255);
            });

            modelBuilder.Entity<KhuyenMai>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__KhuyenMa__3214EC07A503CC05");

                entity.ToTable("KhuyenMai");

                entity.HasIndex(e => e.TenKhuyenMai, "UQ__KhuyenMa__A956B87C202B1025").IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.NgayBatDau).HasColumnType("datetime");
                entity.Property(e => e.NgayKetThuc).HasColumnType("datetime");
                entity.Property(e => e.TenKhuyenMai).HasMaxLength(100);
            });

            modelBuilder.Entity<LichBaoTri>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__LichBaoT__3214EC0735001FAD");

                entity.ToTable("LichBaoTri");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.LoaiBaoTri).HasMaxLength(50);
                entity.Property(e => e.NgayBaoTri).HasColumnType("datetime");
                entity.Property(e => e.NguonPhatSinh)
                    .HasMaxLength(20)
                    .HasDefaultValue("Tự động");
                entity.Property(e => e.TrangThai).HasMaxLength(50);

                entity.HasOne(d => d.MaChiTietDonHangNavigation).WithMany(p => p.LichBaoTris)
                    .HasForeignKey(d => d.MaChiTietDonHang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_LichBaoTri_ChiTietDonHang");

                entity.HasOne(d => d.MaYeuCauDichVuNavigation).WithMany(p => p.LichBaoTris)
                    .HasForeignKey(d => d.MaYeuCauDichVu)
                    .HasConstraintName("FK_LichBaoTri_YeuCauDichVu");
            });

            modelBuilder.Entity<NguoiDung>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__NguoiDun__3214EC07F82845AD");

                entity.ToTable("NguoiDung");

                entity.HasIndex(e => e.MaTaiKhoan, "UQ__NguoiDun__AD7C6528FB4359A4").IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.Cccd)
                    .HasMaxLength(12)
                    .IsUnicode(false)
                    .HasColumnName("CCCD");
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
                entity.HasKey(e => e.Id).HasName("PK__NhaCungC__3214EC07F4A15727");

                entity.ToTable("NhaCungCap");

                entity.HasIndex(e => e.SoDienThoai, "UQ__NhaCungC__0389B7BDC26790F5").IsUnique();

                entity.HasIndex(e => e.Email, "UQ__NhaCungC__A9D10534FF896F7A").IsUnique();

                entity.HasIndex(e => e.TenNhaCungCap, "UQ__NhaCungC__C6818DB2BC5E7CE6").IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.Email).HasMaxLength(255);
                entity.Property(e => e.SoDienThoai).HasMaxLength(10);
                entity.Property(e => e.TenNhaCungCap).HasMaxLength(255);
            });

            modelBuilder.Entity<PhanCongDichVu>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__PhanCong__3214EC075B79B03E");

                entity.ToTable("PhanCongDichVu");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.NgayHoanThanh).HasColumnType("datetime");
                entity.Property(e => e.NgayPhanCong).HasColumnType("datetime");
                entity.Property(e => e.TrangThaiPhanCong)
                    .HasMaxLength(100)
                    .HasDefaultValue("Đang chờ xử lý");

                entity.HasOne(d => d.MaKyThuatVienNavigation).WithMany(p => p.PhanCongDichVus)
                    .HasForeignKey(d => d.MaKyThuatVien)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PCDV_KyThuatVien");

                entity.HasOne(d => d.MaYeuCauNavigation).WithMany(p => p.PhanCongDichVus)
                    .HasForeignKey(d => d.MaYeuCau)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PCDV_YeuCauDichVu");
            });

            modelBuilder.Entity<SanPham>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__SanPham__3214EC075F75C32E");

                entity.ToTable("SanPham");

                entity.HasIndex(e => e.TenSanPham, "UQ__SanPham__FCA8046956C1DB55").IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.Gia).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.NgaySanXuat).HasColumnType("datetime");
                entity.Property(e => e.SoLuongTon).HasDefaultValue(0);
                entity.Property(e => e.TenSanPham).HasMaxLength(255);
                entity.Property(e => e.img).HasMaxLength(255);

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
                entity.HasKey(e => e.Id).HasName("PK__TaiKhoan__3214EC070D16E4F0");

                entity.ToTable("TaiKhoan");

                entity.HasIndex(e => e.Email, "UQ__TaiKhoan__A9D1053492856D42").IsUnique();

                entity.HasIndex(e => e.TenTaiKhoan, "UQ__TaiKhoan__B106EAF836A161B9").IsUnique();

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
                entity.HasKey(e => e.Id).HasName("PK__VaiTro__3214EC071F158C0E");

                entity.ToTable("VaiTro");

                entity.HasIndex(e => e.TenVaiTro, "UQ__VaiTro__1DA55814B23A047B").IsUnique();

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.TenVaiTro).HasMaxLength(100);
            });

            modelBuilder.Entity<YeuCauDichVu>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__YeuCauDi__3214EC07BC346401");

                entity.ToTable("YeuCauDichVu");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.ChiPhiYeuCau).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.LoaiDichVu).HasMaxLength(20);
                entity.Property(e => e.NgayXuLy).HasColumnType("datetime");
                entity.Property(e => e.TrangThaiYeuCau)
                    .HasMaxLength(50)
                    .HasDefaultValue("Đang chờ xử lý");

                entity.HasOne(d => d.MaChiTietDonHangNavigation).WithMany(p => p.YeuCauDichVus)
                    .HasForeignKey(d => d.MaChiTietDonHang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_YeuCauDichVu_ChiTietDonHang");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }

}

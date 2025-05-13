using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebsiteSmartHome.Migrations
{
    /// <inheritdoc />
    public partial class AddImgToSanPham : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DanhMuc",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    TenDanhMuc = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DanhMuc__3214EC07BD778A95", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kho",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    TenKho = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SoDienThoai = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Kho__3214EC07BC75C3E7", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KhuyenMai",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    TenKhuyenMai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PhanTramGiam = table.Column<int>(type: "int", nullable: false),
                    NgayBatDau = table.Column<DateTime>(type: "datetime", nullable: false),
                    NgayKetThuc = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__KhuyenMa__3214EC07A503CC05", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NhaCungCap",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    TenNhaCungCap = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SoDienThoai = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NhaCungC__3214EC07F4A15727", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    TenTaiKhoan = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MatKhau = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Chờ xác minh")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TaiKhoan__3214EC070D16E4F0", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VaiTro",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    TenVaiTro = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__VaiTro__3214EC071F158C0E", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SanPham",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    TenSanPham = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Gia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SoLuongTon = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    NgaySanXuat = table.Column<DateTime>(type: "datetime", nullable: false),
                    ThoiGianBaoHanh = table.Column<int>(type: "int", nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaDanhMuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MaNhaCungCap = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MaKho = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    img = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SanPham__3214EC075F75C32E", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SanPham_DanhMuc",
                        column: x => x.MaDanhMuc,
                        principalTable: "DanhMuc",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SanPham_Kho",
                        column: x => x.MaKho,
                        principalTable: "Kho",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SanPham_NhaCungCap",
                        column: x => x.MaNhaCungCap,
                        principalTable: "NhaCungCap",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    TenNguoiDung = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GioiTinh = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    CCCD = table.Column<string>(type: "varchar(12)", unicode: false, maxLength: 12, nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime", nullable: true),
                    MaTaiKhoan = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MaVaiTro = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NguoiDun__3214EC07F82845AD", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NguoiDung_TaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_NguoiDung_VaiTro",
                        column: x => x.MaVaiTro,
                        principalTable: "VaiTro",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DonHang",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    MaNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TongTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TrangThaiDonHang = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NgayDat = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    MaKhuyenMai = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DonHang__3214EC07E20EBC8F", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonHang_KhuyenMai",
                        column: x => x.MaKhuyenMai,
                        principalTable: "KhuyenMai",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DonHang_NguoiDung",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ChiTietDonHang",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDonHang = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MaSanPham = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ChiTietD__3214EC079AE6E40C", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChiTietDonHang_DonHang",
                        column: x => x.MaDonHang,
                        principalTable: "DonHang",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ChiTietDonHang_SanPham",
                        column: x => x.MaSanPham,
                        principalTable: "SanPham",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DanhGia",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    MaDonHang = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MaSanPham = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SoSao = table.Column<int>(type: "int", nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NgayDanhGia = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DanhGia__3214EC07D09015E8", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DanhGia_DonHang",
                        column: x => x.MaDonHang,
                        principalTable: "DonHang",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DanhGia_SanPham",
                        column: x => x.MaSanPham,
                        principalTable: "SanPham",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "YeuCauDichVu",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    MaChiTietDonHang = table.Column<int>(type: "int", nullable: false),
                    LoaiDichVu = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TrangThaiYeuCau = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Đang chờ xử lý"),
                    ChiPhiYeuCau = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NgayHen = table.Column<DateOnly>(type: "date", nullable: false),
                    NgayXuLy = table.Column<DateTime>(type: "datetime", nullable: true),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DaPhanCong = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__YeuCauDi__3214EC07BC346401", x => x.Id);
                    table.ForeignKey(
                        name: "FK_YeuCauDichVu_ChiTietDonHang",
                        column: x => x.MaChiTietDonHang,
                        principalTable: "ChiTietDonHang",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "LichBaoTri",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    MaChiTietDonHang = table.Column<int>(type: "int", nullable: false),
                    NgayBaoTri = table.Column<DateTime>(type: "datetime", nullable: false),
                    LoaiBaoTri = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NguonPhatSinh = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Tự động"),
                    MaYeuCauDichVu = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LichBaoT__3214EC0735001FAD", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LichBaoTri_ChiTietDonHang",
                        column: x => x.MaChiTietDonHang,
                        principalTable: "ChiTietDonHang",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LichBaoTri_YeuCauDichVu",
                        column: x => x.MaYeuCauDichVu,
                        principalTable: "YeuCauDichVu",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PhanCongDichVu",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    MaYeuCau = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MaKyThuatVien = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayPhanCong = table.Column<DateTime>(type: "datetime", nullable: false),
                    NgayHoanThanh = table.Column<DateTime>(type: "datetime", nullable: true),
                    TrangThaiPhanCong = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: "Đang chờ xử lý")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PhanCong__3214EC075B79B03E", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PCDV_KyThuatVien",
                        column: x => x.MaKyThuatVien,
                        principalTable: "NguoiDung",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PCDV_YeuCauDichVu",
                        column: x => x.MaYeuCau,
                        principalTable: "YeuCauDichVu",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDonHang_MaDonHang",
                table: "ChiTietDonHang",
                column: "MaDonHang");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDonHang_MaSanPham",
                table: "ChiTietDonHang",
                column: "MaSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGia_MaSanPham",
                table: "DanhGia",
                column: "MaSanPham");

            migrationBuilder.CreateIndex(
                name: "UC_DanhGia",
                table: "DanhGia",
                columns: new[] { "MaDonHang", "MaSanPham" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__DanhMuc__650CAE4EF19C64B0",
                table: "DanhMuc",
                column: "TenDanhMuc",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_MaKhuyenMai",
                table: "DonHang",
                column: "MaKhuyenMai");

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_MaNguoiDung",
                table: "DonHang",
                column: "MaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "UQ__Kho__0389B7BDDF5347DE",
                table: "Kho",
                column: "SoDienThoai",
                unique: true,
                filter: "[SoDienThoai] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__Kho__33A304E19BB394EA",
                table: "Kho",
                column: "TenKho",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__KhuyenMa__A956B87C202B1025",
                table: "KhuyenMai",
                column: "TenKhuyenMai",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LichBaoTri_MaChiTietDonHang",
                table: "LichBaoTri",
                column: "MaChiTietDonHang");

            migrationBuilder.CreateIndex(
                name: "IX_LichBaoTri_MaYeuCauDichVu",
                table: "LichBaoTri",
                column: "MaYeuCauDichVu");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_MaVaiTro",
                table: "NguoiDung",
                column: "MaVaiTro");

            migrationBuilder.CreateIndex(
                name: "UQ__NguoiDun__AD7C6528FB4359A4",
                table: "NguoiDung",
                column: "MaTaiKhoan",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__NhaCungC__0389B7BDC26790F5",
                table: "NhaCungCap",
                column: "SoDienThoai",
                unique: true,
                filter: "[SoDienThoai] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__NhaCungC__A9D10534FF896F7A",
                table: "NhaCungCap",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__NhaCungC__C6818DB2BC5E7CE6",
                table: "NhaCungCap",
                column: "TenNhaCungCap",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PhanCongDichVu_MaKyThuatVien",
                table: "PhanCongDichVu",
                column: "MaKyThuatVien");

            migrationBuilder.CreateIndex(
                name: "IX_PhanCongDichVu_MaYeuCau",
                table: "PhanCongDichVu",
                column: "MaYeuCau");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_MaDanhMuc",
                table: "SanPham",
                column: "MaDanhMuc");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_MaKho",
                table: "SanPham",
                column: "MaKho");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_MaNhaCungCap",
                table: "SanPham",
                column: "MaNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "UQ__SanPham__FCA8046956C1DB55",
                table: "SanPham",
                column: "TenSanPham",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__TaiKhoan__A9D1053492856D42",
                table: "TaiKhoan",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__TaiKhoan__B106EAF836A161B9",
                table: "TaiKhoan",
                column: "TenTaiKhoan",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__VaiTro__1DA55814B23A047B",
                table: "VaiTro",
                column: "TenVaiTro",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauDichVu_MaChiTietDonHang",
                table: "YeuCauDichVu",
                column: "MaChiTietDonHang");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DanhGia");

            migrationBuilder.DropTable(
                name: "LichBaoTri");

            migrationBuilder.DropTable(
                name: "PhanCongDichVu");

            migrationBuilder.DropTable(
                name: "YeuCauDichVu");

            migrationBuilder.DropTable(
                name: "ChiTietDonHang");

            migrationBuilder.DropTable(
                name: "DonHang");

            migrationBuilder.DropTable(
                name: "SanPham");

            migrationBuilder.DropTable(
                name: "KhuyenMai");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "DanhMuc");

            migrationBuilder.DropTable(
                name: "Kho");

            migrationBuilder.DropTable(
                name: "NhaCungCap");

            migrationBuilder.DropTable(
                name: "TaiKhoan");

            migrationBuilder.DropTable(
                name: "VaiTro");
        }
    }
}

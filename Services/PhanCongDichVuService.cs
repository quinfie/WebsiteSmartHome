using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Services
{
    public class PhanCongDichVuService : IPhanCongDichVuService
    {
        private readonly IUnitOfWork _unitOfWork;
        public PhanCongDichVuService(IUnitOfWork unitOfWork) { _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork)); }

        public async Task<PhanCongDichVuDto> PhanCongAsync(CreatePhanCongDichVuDto dto)
        {
            // Kiểm tra yêu cầu tồn tại và ở trạng thái đã xác nhận
            var yeuCau = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(dto.MaYeuCau));
            if (yeuCau == null)
            {
                throw new BaseException.NotFoundException("not_found", "Yêu cầu không tồn tại");
            }
            if (yeuCau.TrangThaiYeuCau != TrangThaiYeuCauDichVu.DaXacNhan.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu)))
            {
                throw new BaseException.ValidationException("invalid_status", "Yêu cầu không ở trạng thái chờ xác nhận");
            }

            // Kiểm tra yêu cầu đã được phân công chưa
            if (yeuCau.DaPhanCong == true)
            {
                throw new BaseException.ValidationException("already_assigned", "Yêu cầu đã được phân công");
            }

            // Kiểm tra kỹ thuật viên tồn tại và có vai trò phù hợp
            var kyThuatVien = await _unitOfWork.GetRepository<NguoiDung>()
                .GetEntitiesWithCondition(nd => nd.Id == Guid.Parse(dto.MaKyThuatVien))
                .Include(nd => nd.MaVaiTroNavigation)
                .FirstOrDefaultAsync();

            if (kyThuatVien == null || kyThuatVien.MaVaiTroNavigation?.TenVaiTro != RoleHelper.NhanVien.ToString().GetDescription(typeof(RoleHelper)))
            {
                throw new BaseException.ValidationException("invalid_technician", "Kỹ thuật viên không hợp lệ");
            }

            var entity = new PhanCongDichVu
            {
                MaYeuCau = Guid.Parse(dto.MaYeuCau),
                MaKyThuatVien = Guid.Parse(dto.MaKyThuatVien),
                GhiChu = dto.GhiChu,
                NgayPhanCong = DateTime.Now,
                TrangThaiPhanCong = TrangThaiPhanCong.DangChoXacNhan.ToString().GetDescription(typeof(TrangThaiPhanCong))
            };
            await _unitOfWork.GetRepository<PhanCongDichVu>().InsertAsync(entity);

            // Cập nhật trạng thái yêu cầu
            yeuCau.TrangThaiYeuCau = TrangThaiYeuCauDichVu.DaXacNhan.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu));
            yeuCau.DaPhanCong = true;
            await _unitOfWork.SaveAsync();

            return new PhanCongDichVuDto
            {
                Id = entity.Id.ToString(),
                MaYeuCau = entity.MaYeuCau.ToString(),
                MaKyThuatVien = entity.MaKyThuatVien.ToString(),
                GhiChu = entity.GhiChu,
                NgayPhanCong = entity.NgayPhanCong,
                TrangThaiPhanCong = entity.TrangThaiPhanCong
            };
        }

        public async Task<PhanCongDichVuDto> UpdateTrangThaiAsync(string phanCongId, string trangThai)
        {
            ValidationHelper.ValidateTrangThai<TrangThaiPhanCong>(trangThai);

            var entity = await _unitOfWork.GetRepository<PhanCongDichVu>().GetByIdAsync(Guid.Parse(phanCongId));
            if (entity == null)
            {
                throw new BaseException.NotFoundException("not_found", "Phân công không tồn tại");
            }

            // Kiểm tra không cho phép cập nhật khi đã hoàn thành
            if (entity.TrangThaiPhanCong == TrangThaiPhanCong.HoanThanh.ToString().GetDescription(typeof(TrangThaiPhanCong)))
            {
                throw new BaseException.ValidationException("invalid_status", "Không thể cập nhật trạng thái khi đã hoàn thành");
            }

            entity.TrangThaiPhanCong = trangThai;

            // Nếu trạng thái mới là "Hoàn thành", cập nhật trạng thái Yêu Cầu Dịch Vụ và NgayHoanThanh
            if (trangThai == TrangThaiPhanCong.HoanThanh.ToString().GetDescription(typeof(TrangThaiPhanCong)))
            {
                var yeuCau = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(entity.MaYeuCau);
                if (yeuCau != null)
                {
                    yeuCau.TrangThaiYeuCau = TrangThaiYeuCauDichVu.HoanThanh.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu));
                }
                // Luôn cập nhật NgayHoanThanh khi trạng thái là Hoàn thành
                entity.NgayHoanThanh = DateTime.Now;
            }

            await _unitOfWork.SaveAsync();

            return new PhanCongDichVuDto
            {
                Id = entity.Id.ToString(),
                MaYeuCau = entity.MaYeuCau.ToString(),
                MaKyThuatVien = entity.MaKyThuatVien.ToString(),
                GhiChu = entity.GhiChu,
                NgayPhanCong = entity.NgayPhanCong,
                NgayHoanThanh = entity.NgayHoanThanh,
                TrangThaiPhanCong = entity.TrangThaiPhanCong
            };
        }

        public async Task<PhanCongDichVuDto> HoanThanhAsync(string phanCongId)
        {
            var entity = await _unitOfWork.GetRepository<PhanCongDichVu>().GetByIdAsync(Guid.Parse(phanCongId));
            if (entity == null)
            {
                throw new BaseException.NotFoundException("not_found", "Phân công không tồn tại");
            }

            // Kiểm tra không cho phép hoàn thành khi đã hoàn thành
            if (entity.TrangThaiPhanCong == TrangThaiPhanCong.HoanThanh.ToString().GetDescription(typeof(TrangThaiPhanCong)))
            {
                throw new BaseException.ValidationException("invalid_status", "Phân công đã hoàn thành");
            }

            entity.TrangThaiPhanCong = TrangThaiPhanCong.HoanThanh.ToString().GetDescription(typeof(TrangThaiPhanCong));
            entity.NgayHoanThanh = DateTime.Now;

            // Cập nhật trạng thái yêu cầu
            var yeuCau = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(entity.MaYeuCau);
            if (yeuCau != null)
            {
                yeuCau.TrangThaiYeuCau = TrangThaiYeuCauDichVu.HoanThanh.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu));
            }

            await _unitOfWork.SaveAsync();

            return new PhanCongDichVuDto
            {
                Id = entity.Id.ToString(),
                MaYeuCau = entity.MaYeuCau.ToString(),
                MaKyThuatVien = entity.MaKyThuatVien.ToString(),
                GhiChu = entity.GhiChu,
                NgayPhanCong = entity.NgayPhanCong,
                NgayHoanThanh = entity.NgayHoanThanh,
                TrangThaiPhanCong = entity.TrangThaiPhanCong
            };
        }

        // Phương thức mới
        public async Task<List<PhanCongDichVuDto>> GetPhanCongByYeuCauAsync(string yeuCauId)
        {
            var entities = await _unitOfWork.GetRepository<PhanCongDichVu>()
                .GetEntitiesWithCondition(pc => pc.MaYeuCau == Guid.Parse(yeuCauId))
                .Include(pc => pc.MaKyThuatVienNavigation)
                .Include(pc => pc.MaYeuCauNavigation)
                    .ThenInclude(yc => yc.MaChiTietDonHangNavigation)
                        .ThenInclude(ctdh => ctdh.MaDonHangNavigation)
                            .ThenInclude(dh => dh.MaNguoiDungNavigation)
                .Include(pc => pc.MaYeuCauNavigation)
                     .ThenInclude(yc => yc.MaChiTietDonHangNavigation)
                         .ThenInclude(ctdh => ctdh.MaSanPhamNavigation)
                .ToListAsync();

            return entities.Select(entity => new PhanCongDichVuDto
            {
                Id = entity.Id.ToString(),
                MaYeuCau = entity.MaYeuCau.ToString(),
                MaKyThuatVien = entity.MaKyThuatVien.ToString(),
                GhiChu = entity.GhiChu,
                NgayPhanCong = entity.NgayPhanCong,
                NgayHoanThanh = entity.NgayHoanThanh,
                TrangThaiPhanCong = entity.TrangThaiPhanCong,
                KyThuatVien = entity.MaKyThuatVienNavigation != null ? new PhanCongDichVuDto.KyThuatVienDetailDto
                {
                    Id = entity.MaKyThuatVienNavigation.Id.ToString(),
                    TenNguoiDung = entity.MaKyThuatVienNavigation.TenNguoiDung,
                    SoDienThoai = entity.MaKyThuatVienNavigation.SoDienThoai
                } : null,
                yeuCauDichVu = entity.MaYeuCauNavigation != null ? new PhanCongDichVuDto.YeuCauDichVuDetailDto
                {
                    id = entity.MaYeuCauNavigation.Id.ToString(),
                    tieuDe = "",
                    moTa = entity.MaYeuCauNavigation.MoTa,
                    trangThaiYeuCau = entity.MaYeuCauNavigation.TrangThaiYeuCau,
                    loaiDichVu = entity.MaYeuCauNavigation.LoaiDichVu,
                    khachHang = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation?.MaDonHangNavigation?.MaNguoiDungNavigation != null ? new PhanCongDichVuDto.YeuCauDichVuDetailDto.KhachHangDetailDto
                    {
                        id = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.Id.ToString(),
                        tenNguoiDung = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.TenNguoiDung,
                        soDienThoai = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.SoDienThoai,
                        diaChi = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.DiaChi
                    } : null
                } : null
            }).ToList();
        }

        public async Task<List<PhanCongDichVuDto>> GetPhanCongByKyThuatVienAsync(string kyThuatVienId)
        {
            var entities = await _unitOfWork.GetRepository<PhanCongDichVu>()
                .GetEntitiesWithCondition(pc => pc.MaKyThuatVien == Guid.Parse(kyThuatVienId))
                .Include(pc => pc.MaKyThuatVienNavigation)
                .Include(pc => pc.MaYeuCauNavigation)
                    .ThenInclude(yc => yc.MaChiTietDonHangNavigation)
                        .ThenInclude(ctdh => ctdh.MaDonHangNavigation)
                            .ThenInclude(dh => dh.MaNguoiDungNavigation)
                .Include(pc => pc.MaYeuCauNavigation)
                    .ThenInclude(yc => yc.MaChiTietDonHangNavigation)
                        .ThenInclude(ctdh => ctdh.MaSanPhamNavigation)
                .ToListAsync();

            return entities.Select(entity => new PhanCongDichVuDto
            {
                Id = entity.Id.ToString(),
                MaYeuCau = entity.MaYeuCau.ToString(),
                MaKyThuatVien = entity.MaKyThuatVien.ToString(),
                GhiChu = entity.GhiChu,
                NgayPhanCong = entity.NgayPhanCong,
                NgayHoanThanh = entity.NgayHoanThanh,
                TrangThaiPhanCong = entity.TrangThaiPhanCong,
                KyThuatVien = entity.MaKyThuatVienNavigation != null ? new PhanCongDichVuDto.KyThuatVienDetailDto
                {
                    Id = entity.MaKyThuatVienNavigation.Id.ToString(),
                    TenNguoiDung = entity.MaKyThuatVienNavigation.TenNguoiDung,
                    SoDienThoai = entity.MaKyThuatVienNavigation.SoDienThoai
                } : null,
                yeuCauDichVu = entity.MaYeuCauNavigation != null ? new PhanCongDichVuDto.YeuCauDichVuDetailDto
                {
                    id = entity.MaYeuCauNavigation.Id.ToString(),
                    tieuDe = "",
                    moTa = entity.MaYeuCauNavigation.MoTa,
                    trangThaiYeuCau = entity.MaYeuCauNavigation.TrangThaiYeuCau,
                    loaiDichVu = entity.MaYeuCauNavigation.LoaiDichVu,
                    khachHang = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation?.MaDonHangNavigation?.MaNguoiDungNavigation != null ? new PhanCongDichVuDto.YeuCauDichVuDetailDto.KhachHangDetailDto
                    {
                        id = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.Id.ToString(),
                        tenNguoiDung = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.TenNguoiDung,
                        soDienThoai = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.SoDienThoai,
                        diaChi = entity.MaYeuCauNavigation.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.DiaChi
                    } : null
                } : null
            }).ToList();
        }

        public async Task<List<PhanCongCalendarDto>> GetPhanCongCalendarByKyThuatVienAsync(string kyThuatVienId)
        {
            // Kiểm tra người dùng có tồn tại và là nhân viên không
            var nguoiDung = await _unitOfWork.GetRepository<NguoiDung>()
                .GetEntitiesWithCondition(nd => nd.Id == Guid.Parse(kyThuatVienId))
                .Include(nd => nd.MaVaiTroNavigation)
                .FirstOrDefaultAsync();

            if (nguoiDung == null)
            {
                throw new BaseException.NotFoundException("not_found", "Người dùng không tồn tại");
            }

            if (nguoiDung.MaVaiTroNavigation?.TenVaiTro != RoleHelper.NhanVien.ToString().GetDescription(typeof(RoleHelper)))
            {
                throw new BaseException.ValidationException("unauthorized", "Chỉ nhân viên mới có thể xem lịch phân công của mình");
            }

            var phanCongs = await _unitOfWork.GetRepository<PhanCongDichVu>()
                .FindByCondition(pc => pc.MaKyThuatVien == Guid.Parse(kyThuatVienId))
                .Include(pc => pc.MaYeuCauNavigation)
                .ToListAsync();

            var result = new List<PhanCongCalendarDto>();

            foreach (var pc in phanCongs)
            {
                // 1. Sử dụng YeuCauDichVu đã được Include
                var yeuCau = pc.MaYeuCauNavigation;

                // Khai báo các biến cần thiết ở đầu scope loop
                ChiTietDonHang? chiTietDonHang = null;
                DonHang? donHang = null;
                NguoiDung? khachHang = null;
                SanPham? sanPham = null;
                DateTime ngayHetHanBaoHanh = DateTime.Now; // Default value

                if (yeuCau != null)
                {
                    // 2. Lấy chi tiết đơn hàng từ yêu cầu dịch vụ
                    chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>().GetByIdAsync(yeuCau.MaChiTietDonHang);

                    if (chiTietDonHang != null)
                    {
                        // 3. Lấy đơn hàng từ chi tiết đơn hàng
                        donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(chiTietDonHang.MaDonHang);

                        // 4. Lấy thông tin sản phẩm
                        sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(chiTietDonHang.MaSanPham);
                    }
                }

                // 5. Lấy khách hàng từ đơn hàng (sau khi đã lấy được donHang)
                if (donHang != null)
                {
                    khachHang = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(donHang.MaNguoiDung);
                }

                // Tính ngày hết hạn bảo hành (sau khi đã lấy được donHang và sanPham)
                if (sanPham != null && donHang != null)
                {
                    // Ngày hết hạn = Ngày mua hàng + Thời gian bảo hành (tháng)
                    ngayHetHanBaoHanh = donHang.NgayDat.AddMonths(sanPham.ThoiGianBaoHanh);
                }

                result.Add(new PhanCongCalendarDto
                {
                    Id = pc.Id.ToString(),
                    NgayPhanCong = pc.NgayPhanCong,
                    TrangThaiPhanCong = pc.TrangThaiPhanCong,
                    GhiChu = pc.GhiChu ?? string.Empty,
                    YeuCauId = yeuCau?.Id.ToString() ?? string.Empty,
                    LoaiDichVu = yeuCau?.LoaiDichVu ?? string.Empty,
                    MoTaYeuCau = yeuCau?.MoTa ?? string.Empty,
                    DonHangId = donHang?.Id.ToString() ?? string.Empty,
                    MaDonHang = donHang?.Id.ToString() ?? string.Empty,
                    // Thông tin sản phẩm
                    SanPhamId = sanPham?.Id.ToString() ?? string.Empty,
                    TenSanPham = sanPham?.TenSanPham ?? string.Empty,
                    MoTaSanPham = sanPham?.MoTa ?? string.Empty,
                    GiaSanPham = sanPham?.Gia ?? 0,
                    ThoiGianBaoHanh = sanPham?.ThoiGianBaoHanh ?? 0,
                    NgayHetHanBaoHanh = ngayHetHanBaoHanh,
                    NgayHoanThanh = pc.NgayHoanThanh,
                    // Thông tin khách hàng
                    KhachHangId = khachHang?.Id.ToString() ?? string.Empty,
                    TenKhachHang = khachHang?.TenNguoiDung ?? string.Empty,
                    SoDienThoaiKhachHang = khachHang?.SoDienThoai ?? string.Empty,
                    DiaChiKhachHang = khachHang?.DiaChi ?? string.Empty,
                    NgayXuLy = yeuCau?.NgayXuLy
                });
            }

            return result;
        }

        public async Task<PhanCongCalendarDto?> GetPhanCongCalendarByIdAsync(string id)
        {
            var pc = await _unitOfWork.GetRepository<PhanCongDichVu>().GetByIdAsync(Guid.Parse(id));
            if (pc == null) return null;

            var yeuCau = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(pc.MaYeuCau);
            ChiTietDonHang? chiTietDonHang = null;
            if (yeuCau != null)
                chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>().GetByIdAsync(yeuCau.MaChiTietDonHang);
            DonHang? donHang = null;
            if (chiTietDonHang != null)
                donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(chiTietDonHang.MaDonHang);
            NguoiDung? khachHang = null;
            if (donHang != null)
                khachHang = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(donHang.MaNguoiDung);

            // Lấy thông tin sản phẩm
            SanPham? sanPham = null;
            if (chiTietDonHang != null)
                sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(chiTietDonHang.MaSanPham);

            // Tính ngày hết hạn bảo hành
            DateTime ngayHetHanBaoHanh = DateTime.Now;
            if (sanPham != null && donHang != null)
            {
                // Ngày hết hạn = Ngày mua hàng + Thời gian bảo hành (tháng)
                ngayHetHanBaoHanh = donHang.NgayDat.AddMonths(sanPham.ThoiGianBaoHanh);
            }

            return new PhanCongCalendarDto
            {
                Id = pc.Id.ToString(),
                NgayPhanCong = pc.NgayPhanCong,
                TrangThaiPhanCong = pc.TrangThaiPhanCong,
                GhiChu = pc.GhiChu ?? string.Empty,
                YeuCauId = yeuCau?.Id.ToString() ?? string.Empty,
                LoaiDichVu = yeuCau?.LoaiDichVu ?? string.Empty,
                MoTaYeuCau = yeuCau?.MoTa ?? string.Empty,
                DonHangId = donHang?.Id.ToString() ?? string.Empty,
                MaDonHang = donHang?.Id.ToString() ?? string.Empty,
                // Thông tin sản phẩm
                SanPhamId = sanPham?.Id.ToString() ?? string.Empty,
                TenSanPham = sanPham?.TenSanPham ?? string.Empty,
                MoTaSanPham = sanPham?.MoTa ?? string.Empty,
                GiaSanPham = sanPham?.Gia ?? 0,
                ThoiGianBaoHanh = sanPham?.ThoiGianBaoHanh ?? 0,
                NgayHetHanBaoHanh = ngayHetHanBaoHanh,
                NgayHoanThanh = pc.NgayHoanThanh,
                // Thông tin khách hàng
                KhachHangId = khachHang?.Id.ToString() ?? string.Empty,
                TenKhachHang = khachHang?.TenNguoiDung ?? string.Empty,
                SoDienThoaiKhachHang = khachHang?.SoDienThoai ?? string.Empty,
                DiaChiKhachHang = khachHang?.DiaChi ?? string.Empty,
                NgayXuLy = yeuCau?.NgayXuLy
            };
        }
    }
}
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Utils;

namespace WebsiteSmartHome.Services
{
    public class YeuCauDichVuService : IYeuCauDichVuService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public YeuCauDichVuService(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        public async Task<YeuCauDichVuDto> TaoYeuCauAsync(CreateYeuCauDichVuDto dto, string khachHangId)
        {
            // Validate MaChiTietDonHang
            var chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByConditionWithIncludesAsync(
                    ct => ct.Id == dto.MaChiTietDonHang,
                    ct => ct.MaDonHangNavigation,
                    ct => ct.MaSanPhamNavigation
                );

            if (chiTietDonHang == null)
                throw new BaseException.ValidationException("invalid_chi_tiet_don_hang", "Chi tiết đơn hàng không tồn tại");

            // Kiểm tra trạng thái đơn hàng
            var donHang = chiTietDonHang.MaDonHangNavigation;
            if (donHang.TrangThaiDonHang != "Hoàn thành")
            {
                throw new BaseException.ValidationException(
                    "invalid_order_status",
                    "Chỉ có thể tạo yêu cầu dịch vụ cho đơn hàng đã hoàn thành"
                );
            }

            // Validate các trường
            ValidationHelper.ValidateNgayHen(dto.NgayHen.ToDateTime(TimeOnly.MinValue));
            ValidationHelper.ValidateMoTa(dto.MoTa);

            var sanPham = chiTietDonHang.MaSanPhamNavigation;
            if (sanPham == null)
                throw new BaseException.NotFoundException("not_found", "Sản phẩm không tồn tại");

            // Kiểm tra thời hạn bảo hành và tự động xác định loại dịch vụ
            var ngayMua = donHang.NgayDat;
            var hanBaoHanh = ngayMua.AddMonths(sanPham.ThoiGianBaoHanh);
            decimal chiPhi = 0;
            string loaiDichVu;

            if (DateTime.Now <= hanBaoHanh)
            {
                // Còn hạn bảo hành -> tự động set loại dịch vụ là Bảo hành
                loaiDichVu = "Bảo hành";
                chiPhi = 0;
            }
            else
            {
                // Hết hạn bảo hành -> tự động set loại dịch vụ là Sửa chữa
                loaiDichVu = "Sửa chữa";
                // Chi phí sẽ được cập nhật sau bởi nhân viên
                chiPhi = 0;
            }

            var entity = new YeuCauDichVu
            {
                MaChiTietDonHang = dto.MaChiTietDonHang,
                LoaiDichVu = loaiDichVu,
                MoTa = dto.MoTa,
                NgayHen = dto.NgayHen,
                TrangThaiYeuCau = "Đang chờ xác nhận",
                DaPhanCong = false,
                ChiPhiYeuCau = chiPhi
            };

            await _unitOfWork.GetRepository<YeuCauDichVu>().InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return await MapToDtoAsync(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateChiPhiAsync(string id, decimal chiPhi, string nhanVienId)
        {
            // Kiểm tra quyền nhân viên
            var nhanVien = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(Guid.Parse(nhanVienId));
            if (nhanVien == null || nhanVien.MaVaiTroNavigation.TenVaiTro != "Nhân viên")
            {
                throw new BaseException.UnauthorizedException("unauthorized", "Không có quyền cập nhật chi phí");
            }

            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null)
                throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            // Chỉ cho phép cập nhật chi phí cho yêu cầu sửa chữa
            if (entity.LoaiDichVu != "Sửa chữa")
            {
                throw new BaseException.ValidationException(
                    "invalid_service_type",
                    "Chỉ có thể cập nhật chi phí cho yêu cầu sửa chữa"
                );
            }

            ValidationHelper.ValidateChiPhi(chiPhi);
            entity.ChiPhiYeuCau = chiPhi;
            await _unitOfWork.SaveAsync();

            return await MapToDtoAsync(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateNgayXuLyAsync(string id, DateTime ngayXuLy)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            entity.NgayXuLy = ngayXuLy;
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateMoTaAsync(string id, string moTa, bool isKetQua = false)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            entity.MoTa = moTa;
            if (isKetQua)
                entity.TrangThaiYeuCau = "Hoàn thành";
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateTrangThaiAsync(string id, string trangThai, DateTime? ngayXuLy)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            // Validate trạng thái mới
            ValidationHelper.ValidateTrangThaiYeuCau(trangThai);

            // Logic kiểm tra và cập nhật NgayXuLy khi trạng thái là "Đã xác nhận"
            if (trangThai == "Đã xác nhận")
            {
                // Kiểm tra ràng buộc: Nếu trạng thái là "Đã xác nhận", DaPhanCong phải là true
                if (!entity.DaPhanCong)
                {
                    throw new BaseException.ValidationException("missing_assignment", "Yêu cầu cần được phân công trước khi xác nhận.");
                }

                if (!ngayXuLy.HasValue)
                {
                    throw new BaseException.ValidationException("missing_ngay_xu_ly", "Ngày xử lý là bắt buộc khi chuyển trạng thái sang Đã xác nhận");
                }
                // Tùy chọn: Thêm validation cho NgayXuLy nếu cần (ví dụ: không được trong quá khứ, phải sau NgayHen...)
                // const ngayHen = entity.NgayHen.ToDateTime(TimeOnly.MinValue);
                // if (ngayXuLy.Value < ngayHen) {
                //     throw new BaseException.ValidationException("invalid_ngay_xu_ly", "Ngày xử lý không được phép trước ngày hẹn.");
                // }

                entity.NgayXuLy = ngayXuLy.Value; // Update NgayXuLy
            }
            else // Nếu trạng thái không phải "Đã xác nhận", có thể set NgayXuLy về null nếu cần
            {
                entity.NgayXuLy = null; // Tùy chỉnh: set null hoặc giữ giá trị cũ
            }

            entity.TrangThaiYeuCau = trangThai; // Cập nhật trạng thái
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> HuyYeuCauAsync(string id)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            entity.TrangThaiYeuCau = "Đã hủy";
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> XacNhanYeuCauAsync(string yeuCauId, string quanLiId)
        {
            // Kiểm tra quyền quản lý
            var quanLi = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(Guid.Parse(quanLiId));
            if (quanLi == null || quanLi.MaVaiTroNavigation.TenVaiTro != "Quản lý")
            {
                throw new BaseException.UnauthorizedException("invalid_role", "Không có quyền xác nhận yêu cầu");
            }

            // Kiểm tra yêu cầu tồn tại
            var yeuCau = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(yeuCauId));
            if (yeuCau == null)
            {
                throw new BaseException.NotFoundException("not_found", "Yêu cầu không tồn tại");
            }

            // Kiểm tra trạng thái hiện tại
            if (yeuCau.TrangThaiYeuCau != "Chờ xác nhận")
            {
                throw new BaseException.ValidationException("invalid_status", "Yêu cầu không ở trạng thái chờ xác nhận");
            }

            // Kiểm tra ngày hẹn
            if (yeuCau.NgayHen.ToDateTime(TimeOnly.MinValue) < DateTime.Today)
            {
                throw new BaseException.ValidationException("invalid_date", "Ngày hẹn không hợp lệ");
            }

            // Kiểm tra chi phí cho sửa chữa
            if (yeuCau.LoaiDichVu == "Sửa chữa" && yeuCau.ChiPhiYeuCau <= 0)
            {
                throw new BaseException.ValidationException("missing_cost", "Chưa có báo giá cho yêu cầu sửa chữa");
            }

            // Cập nhật trạng thái
            yeuCau.TrangThaiYeuCau = "Đã xác nhận";
            await _unitOfWork.SaveAsync();

            // Tạo lịch bảo trì
            var lichBaoTriService = new LichBaoTriService(_unitOfWork);
            await lichBaoTriService.TaoLichBaoTriTuYeuCauAsync(yeuCauId);

            return MapToDto(yeuCau);
        }

        private YeuCauDichVuDto MapToDto(YeuCauDichVu entity)
        {
            return new YeuCauDichVuDto
            {
                Id = entity.Id.ToString(),
                MaChiTietDonHang = entity.MaChiTietDonHang,
                LoaiDichVu = entity.LoaiDichVu,
                TrangThaiYeuCau = entity.TrangThaiYeuCau,
                ChiPhiYeuCau = entity.ChiPhiYeuCau,
                NgayHen = entity.NgayHen,
                NgayXuLy = entity.NgayXuLy,
                MoTa = entity.MoTa,
                DaPhanCong = entity.DaPhanCong
            };
        }

        public async Task<List<YeuCauDichVuKhachHangDto>> GetYeuCauByKhachHangAsync(string khachHangId)
        {
            var query = _unitOfWork.GetRepository<YeuCauDichVu>()
                .GetEntitiesWithCondition(x => true)
                .Include(x => x.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaDonHangNavigation)
                .Include(x => x.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaSanPhamNavigation)
                .Where(x => x.MaChiTietDonHangNavigation != null &&
                           x.MaChiTietDonHangNavigation.MaDonHangNavigation != null &&
                           x.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDung == Guid.Parse(khachHangId));

            var yeuCaus = await query
                .Select(y => new YeuCauDichVuKhachHangDto
                {
                    Id = y.Id.ToString(),
                    TenSanPham = y.MaChiTietDonHangNavigation.MaSanPhamNavigation.TenSanPham,
                    LoaiDichVu = y.LoaiDichVu,
                    TrangThaiYeuCau = y.TrangThaiYeuCau,
                    NgayHen = y.NgayHen,
                    MoTa = y.MoTa,
                    ChiPhiYeuCau = y.ChiPhiYeuCau
                })
                .ToListAsync();

            return yeuCaus;
        }

        public async Task<YeuCauDichVuDto> GetByIdAsync(string id)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));

            if (entity == null)
            {
                throw new BaseException.NotFoundException("not_found", "Yêu cầu dịch vụ không tồn tại");
            }

            return new YeuCauDichVuDto
            {
                Id = entity.Id.ToString(),
                MaChiTietDonHang = entity.MaChiTietDonHang,
                LoaiDichVu = entity.LoaiDichVu,
                TrangThaiYeuCau = entity.TrangThaiYeuCau,
                ChiPhiYeuCau = entity.ChiPhiYeuCau,
                NgayHen = entity.NgayHen,
                NgayXuLy = entity.NgayXuLy,
                MoTa = entity.MoTa,
                DaPhanCong = entity.DaPhanCong
            };
        }

        private async Task<YeuCauDichVuDto> MapToDtoAsync(YeuCauDichVu entity)
        {
            var chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.Id == entity.MaChiTietDonHang)
                .Include(ct => ct.MaSanPhamNavigation)
                .Include(ct => ct.MaDonHangNavigation)
                    .ThenInclude(dh => dh.MaNguoiDungNavigation)
                .FirstOrDefaultAsync();

            return new YeuCauDichVuDto
            {
                Id = entity.Id.ToString(),
                MaChiTietDonHang = chiTietDonHang?.Id ?? 0,
                LoaiDichVu = entity.LoaiDichVu,
                TrangThaiYeuCau = entity.TrangThaiYeuCau,
                ChiPhiYeuCau = entity.ChiPhiYeuCau,
                NgayHen = entity.NgayHen,
                NgayXuLy = entity.NgayXuLy,
                MoTa = entity.MoTa,
                DaPhanCong = entity.DaPhanCong,
                TenSanPham = chiTietDonHang?.MaSanPhamNavigation?.TenSanPham,
                KhachHang = chiTietDonHang?.MaDonHangNavigation?.MaNguoiDungNavigation != null ? new NguoiDungDto
                {
                    TenNguoiDung = chiTietDonHang.MaDonHangNavigation.MaNguoiDungNavigation.TenNguoiDung ?? "",
                    Sdt = chiTietDonHang.MaDonHangNavigation.MaNguoiDungNavigation.SoDienThoai ?? "",
                    DiaChi = chiTietDonHang.MaDonHangNavigation.MaNguoiDungNavigation.DiaChi ?? "",
                    Cccd = chiTietDonHang.MaDonHangNavigation.MaNguoiDungNavigation.Cccd ?? "",
                    NgaySinh = chiTietDonHang.MaDonHangNavigation.MaNguoiDungNavigation.NgaySinh ?? null,
                    GioiTinh = chiTietDonHang.MaDonHangNavigation.MaNguoiDungNavigation.GioiTinh ?? ""
                } : null
            };
        }

        // Các phương thức mới
        public async Task<List<YeuCauDichVuDto>> GetAllYeuCauAsync(string? trangThai = null, string? loaiDichVu = null)
        {
            var query = _unitOfWork.GetRepository<YeuCauDichVu>().GetEntitiesWithCondition(x => true);

            // Lọc theo trạng thái nếu có
            if (!string.IsNullOrEmpty(trangThai))
            {
                query = query.Where(x => x.TrangThaiYeuCau == trangThai);
            }

            // Lọc theo loại dịch vụ nếu có
            if (!string.IsNullOrEmpty(loaiDichVu))
            {
                query = query.Where(x => x.LoaiDichVu == loaiDichVu);
            }

            // Include các thông tin liên quan
            query = query
                .Include(x => x.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaSanPhamNavigation)
                .Include(x => x.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaDonHangNavigation)
                        .ThenInclude(dh => dh.MaNguoiDungNavigation);

            var entities = await query.ToListAsync();
            var result = new List<YeuCauDichVuDto>();

            foreach (var entity in entities)
            {
                result.Add(await MapToDtoAsync(entity));
            }

            return result;
        }

        public async Task<List<YeuCauDichVuDto>> GetYeuCauChuaPhanCongAsync()
        {
            var query = _unitOfWork.GetRepository<YeuCauDichVu>()
                .GetEntitiesWithCondition(x => !x.DaPhanCong && x.TrangThaiYeuCau == "Đang chờ xác nhận");

            // Include các thông tin liên quan
            query = query
                .Include(x => x.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaSanPhamNavigation)
                .Include(x => x.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaDonHangNavigation)
                        .ThenInclude(dh => dh.MaNguoiDungNavigation);

            var entities = await query.ToListAsync();
            var result = new List<YeuCauDichVuDto>();

            foreach (var entity in entities)
            {
                result.Add(await MapToDtoAsync(entity));
            }

            return result;
        }

        public async Task<List<YeuCauDichVuDto>> GetYeuCauTheoKyThuatVienAsync(string kyThuatVienId)
        {
            // Lấy các phân công của kỹ thuật viên
            var phanCongQuery = _unitOfWork.GetRepository<PhanCongDichVu>()
                .GetEntitiesWithCondition(pc => pc.MaKyThuatVien == Guid.Parse(kyThuatVienId))
                .Select(pc => pc.MaYeuCau);

            // Lấy các yêu cầu dịch vụ tương ứng
            var yeuCauQuery = _unitOfWork.GetRepository<YeuCauDichVu>()
                .GetEntitiesWithCondition(yc => phanCongQuery.Contains(yc.Id));

            // Include các thông tin liên quan
            yeuCauQuery = yeuCauQuery
                .Include(x => x.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaSanPhamNavigation)
                .Include(x => x.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaDonHangNavigation)
                        .ThenInclude(dh => dh.MaNguoiDungNavigation);

            var entities = await yeuCauQuery.ToListAsync();
            var result = new List<YeuCauDichVuDto>();

            foreach (var entity in entities)
            {
                result.Add(await MapToDtoAsync(entity));
            }

            return result;
        }

        public async Task<int> CountYeuCauTheoTrangThaiAsync(string trangThai)
        {
            return await _unitOfWork.GetRepository<YeuCauDichVu>()
                .GetEntitiesWithCondition(x => x.TrangThaiYeuCau == trangThai)
                .CountAsync();
        }

        public async Task<decimal> TinhTongChiPhiAsync(DateTime? tuNgay = null, DateTime? denNgay = null)
        {
            var query = _unitOfWork.GetRepository<YeuCauDichVu>().GetEntitiesWithCondition(x => true);

            // Lọc theo khoảng thời gian nếu có
            if (tuNgay.HasValue)
            {
                query = query.Where(x => x.NgayXuLy >= tuNgay.Value);
            }

            if (denNgay.HasValue)
            {
                query = query.Where(x => x.NgayXuLy <= denNgay.Value);
            }

            // Chỉ tính chi phí của các yêu cầu đã hoàn thành
            query = query.Where(x => x.TrangThaiYeuCau == "Hoàn thành");

            return await query.SumAsync(x => x.ChiPhiYeuCau);
        }

        // Phương thức xóa vĩnh viễn yêu cầu dịch vụ
        public async Task DeleteYeuCauAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id) || !Guid.TryParse(id, out Guid guidId))
            {
                throw new BaseException.BadRequestException("invalid_id", "Mã yêu cầu dịch vụ không hợp lệ");
            }

            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(guidId);

            if (entity == null)
            {
                throw new BaseException.NotFoundException("not_found", "Yêu cầu dịch vụ không tồn tại");
            }

            _unitOfWork.GetRepository<YeuCauDichVu>().Delete(entity);
            await _unitOfWork.SaveAsync();
        }

        public async Task<YeuCauDichVuDto?> GetDetailedYeuCauByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id) || !Guid.TryParse(id, out Guid guidId))
            {
                throw new BaseException.BadRequestException("invalid_id", "Mã yêu cầu dịch vụ không hợp lệ");
            }

            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>()
                .FindByConditionWithIncludesAsync(
                    y => y.Id == Guid.Parse(id),
                    y => y.MaChiTietDonHangNavigation,
                    y => y.MaChiTietDonHangNavigation.MaDonHangNavigation,
                    y => y.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation,
                    y => y.MaChiTietDonHangNavigation.MaSanPhamNavigation
                );

            if (entity == null) return null;

            return await MapToDtoAsync(entity);
        }
    }
}
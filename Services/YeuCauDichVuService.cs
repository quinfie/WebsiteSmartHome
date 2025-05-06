using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;
using System.Security.Claims;

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
            // Validate token
            var nameIdentifierClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
            if (nameIdentifierClaim == null) throw new BaseException.ValidationException("invalid_token", "Thông tin người dùng không hợp lệ");

            // Validate MaChiTietDonHang
            var chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>().GetByIdAsync(dto.MaChiTietDonHang);
            if (chiTietDonHang == null) throw new BaseException.ValidationException("invalid_chi_tiet_don_hang", "Chi tiết đơn hàng không tồn tại");

            // Validate khachHangId
            var nguoiDung = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(Guid.Parse(khachHangId));
            if (nguoiDung == null) throw new BaseException.ValidationException("invalid_khach_hang", "Khách hàng không tồn tại");

            // Validate các trường khác
            ValidationHelper.ValidateNgayHen(dto.NgayHen.ToDateTime(TimeOnly.MinValue));
            ValidationHelper.ValidateLoaiDichVu(dto.LoaiDichVu);
            ValidationHelper.ValidateMoTa(dto.MoTa);

            // Kiểm tra loại dịch vụ và xử lý phí
            decimal chiPhi = 0;
            if (dto.LoaiDichVu == "Bảo hành")
            {
                // Lấy thông tin sản phẩm
                var sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(chiTietDonHang.MaSanPham);
                if (sanPham == null) throw new BaseException.NotFoundException("not_found", "Sản phẩm không tồn tại");

                // Lấy đơn hàng
                var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(chiTietDonHang.MaDonHang);
                if (donHang == null) throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");

                // Kiểm tra thời gian bảo hành
                ValidationHelper.ValidateThoiGianBaoHanh(donHang.NgayDat, sanPham.ThoiGianBaoHanh);
            }
            else if (dto.LoaiDichVu == "Sửa chữa")
            {
                // Sửa chữa cần báo giá trước
                chiPhi = 0; // Đặt chi phí ban đầu là 0
            }

            var entity = new YeuCauDichVu
            {
                MaChiTietDonHang = dto.MaChiTietDonHang,
                LoaiDichVu = dto.LoaiDichVu,
                MoTa = dto.MoTa,
                NgayHen = dto.NgayHen,
                TrangThaiYeuCau = TrangThaiYeuCauDichVu.ChoXacNhan.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu)),
                DaPhanCong = false,
                ChiPhiYeuCau = chiPhi
            };

            await _unitOfWork.GetRepository<YeuCauDichVu>().InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateChiPhiAsync(string id, decimal chiPhi)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            ValidationHelper.ValidateChiPhi(chiPhi);
            entity.ChiPhiYeuCau = chiPhi;
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateNgayXuLyAsync(string id, DateTime ngayXuLy)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            entity.NgayXuLy = ngayXuLy;
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateTienDoAsync(string id, string tienDo)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            entity.MoTa = tienDo;
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateKetQuaAsync(string id, string ketQua)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            entity.MoTa = ketQua;
            entity.TrangThaiYeuCau = TrangThaiYeuCauDichVu.HoanThanh.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu));
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> UpdateTrangThaiAsync(string id, string trangThai)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            ValidationHelper.ValidateTrangThaiYeuCau(trangThai);
            entity.TrangThaiYeuCau = trangThai;
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> HuyYeuCauAsync(string id)
        {
            var entity = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(id));
            if (entity == null) throw new BaseException.ValidationException("invalid_yeu_cau", "Yêu cầu không tồn tại");

            entity.TrangThaiYeuCau = TrangThaiYeuCauDichVu.DaHuy.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu));
            await _unitOfWork.SaveAsync();

            return MapToDto(entity);
        }

        public async Task<YeuCauDichVuDto> XacNhanYeuCauAsync(string yeuCauId, string quanLiId)
        {
            // Kiểm tra quyền quản lý
            var quanLi = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(Guid.Parse(quanLiId));
            if (quanLi == null || quanLi.MaVaiTroNavigation.TenVaiTro != RoleHelper.QuanLi.ToString().GetDescription(typeof(RoleHelper)))
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
            if (yeuCau.TrangThaiYeuCau != TrangThaiYeuCauDichVu.ChoXacNhan.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu)))
            {
                throw new BaseException.ValidationException("invalid_status", "Yêu cầu không ở trạng thái chờ xác nhận");
            }

            // Kiểm tra ngày hẹn
            if (yeuCau.NgayHen.ToDateTime(TimeOnly.MinValue) < DateTime.Today)
            {
                throw new BaseException.ValidationException("invalid_date", "Ngày hẹn không hợp lệ");
            }

            // Kiểm tra chi phí cho sửa chữa
            if (yeuCau.LoaiDichVu == TypeServiceHelper.SuaChua.ToString().GetDescription(typeof(TypeServiceHelper)) && yeuCau.ChiPhiYeuCau <= 0)
            {
                throw new BaseException.ValidationException("missing_cost", "Chưa có báo giá cho yêu cầu sửa chữa");
            }

            // Cập nhật trạng thái
            yeuCau.TrangThaiYeuCau = TrangThaiYeuCauDichVu.DaXacNhan.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu));
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

        public async Task<IEnumerable<YeuCauDichVuDto>> GetYeuCauByKhachHangAsync(string khachHangId)
        {
            var list = await _unitOfWork.GetRepository<YeuCauDichVu>()
                .GetEntitiesWithCondition(x => x.MaChiTietDonHangNavigation.MaDonHangNavigation.MaNguoiDungNavigation.Id == Guid.Parse(khachHangId))
                .Include(x => x.MaChiTietDonHangNavigation)
                .Select(entity => new YeuCauDichVuDto
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
                }).ToListAsync();
            return list;
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
    }
}
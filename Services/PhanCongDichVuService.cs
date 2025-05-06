using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class PhanCongDichVuService : IPhanCongDichVuService
    {
        private readonly IUnitOfWork _unitOfWork;
        public PhanCongDichVuService(IUnitOfWork unitOfWork) { _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork)); }

        public async Task<PhanCongDichVuDto> PhanCongAsync(CreatePhanCongDichVuDto dto, string quanLiId)
        {
            // Kiểm tra quyền quản lý
            var quanLi = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(Guid.Parse(quanLiId));
            if (quanLi == null || quanLi.MaVaiTroNavigation.TenVaiTro != RoleHelper.QuanLi.ToString())
            {
                throw new BaseException.UnauthorizedException("invalid_role", "Không có quyền phân công");
            }

            // Kiểm tra yêu cầu tồn tại và ở trạng thái chờ xác nhận
            var yeuCau = await _unitOfWork.GetRepository<YeuCauDichVu>().GetByIdAsync(Guid.Parse(dto.MaYeuCau));
            if (yeuCau == null)
            {
                throw new BaseException.NotFoundException("not_found", "Yêu cầu không tồn tại");
            }
            if (yeuCau.TrangThaiYeuCau != TrangThaiYeuCauDichVu.ChoXacNhan.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu)))
            {
                throw new BaseException.ValidationException("invalid_status", "Yêu cầu không ở trạng thái chờ xác nhận");
            }

            // Kiểm tra yêu cầu đã được phân công chưa
            var existingPhanCong = await _unitOfWork.GetRepository<PhanCongDichVu>()
                .GetAllAsync();
            if (existingPhanCong.Any(p => p.MaYeuCau == Guid.Parse(dto.MaYeuCau)))
            {
                throw new BaseException.ValidationException("already_assigned", "Yêu cầu đã được phân công");
            }

            // Kiểm tra kỹ thuật viên tồn tại và có vai trò phù hợp
            var kyThuatVien = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(Guid.Parse(dto.MaKyThuatVien));
            if (kyThuatVien == null || kyThuatVien.MaVaiTroNavigation.TenVaiTro != RoleHelper.NhanVien.ToString())
            {
                throw new BaseException.ValidationException("invalid_technician", "Kỹ thuật viên không hợp lệ");
            }

            var entity = new PhanCongDichVu
            {
                Id = Guid.NewGuid(),
                MaYeuCau = Guid.Parse(dto.MaYeuCau),
                MaKyThuatVien = Guid.Parse(dto.MaKyThuatVien),
                GhiChu = dto.GhiChu,
                NgayPhanCong = DateTime.Now,
                TrangThaiPhanCong = TrangThaiPhanCong.ChoXuLy.ToString().GetDescription(typeof(TrangThaiPhanCong))
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
    }
}
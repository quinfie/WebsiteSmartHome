using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core.Utils;
using Microsoft.Data.SqlClient;

namespace WebsiteSmartHome.Services
{
    public class NguoiDungService : INguoiDungService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NguoiDungService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<IEnumerable<NguoiDungDto>> GetAllNguoiDungAsync()
        {
            IList<NguoiDung> list = await _unitOfWork.GetRepository<NguoiDung>().GetAllAsync();
            return list.Select(x => new NguoiDungDto
            {
                Id = x.Id.ToString(),
                TenNguoiDung = x.TenNguoiDung,
                GioiTinh = x.GioiTinh!,
                NgaySinh = x.NgaySinh,
                Cccd = x.Cccd!,
                Sdt = x.SoDienThoai!,
                DiaChi = x.DiaChi
            });
        }

        public async Task<NguoiDungDto?> GetNguoiDungByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new BaseException.BadRequestException("invalid_data", "Mã người dùng không được để trống");
            }

            Guid.TryParse(id, out Guid guidId);
            NguoiDung? nd = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(guidId);

            if (nd == null)
            {
                throw new BaseException.NotFoundException("not_found", "Người dùng không tồn tại");
            }

            return new NguoiDungDto
            {
                Id = nd.Id.ToString(),
                TenNguoiDung = nd.TenNguoiDung,
                GioiTinh = nd.GioiTinh!,
                NgaySinh = nd.NgaySinh,
                Cccd = nd.Cccd!,
                Sdt = nd.SoDienThoai!,
                DiaChi = nd.DiaChi
            };
        }

        private async Task CheckNguoiDungExistsAsync(NguoiDungCreateDto nguoiDungDto)
        {
            var existingCCCD = await _unitOfWork.GetRepository<NguoiDung>().FindByConditionAsync(t => t.Cccd == nguoiDungDto.Cccd);
            if (existingCCCD != null)
            {
                throw new BaseException.BadRequestException("duplicate", "CCCD đã tồn tại");
            }

            var existingSoDienThoai = await _unitOfWork.GetRepository<NguoiDung>().FindByConditionAsync(t => t.SoDienThoai == nguoiDungDto.Sdt);
            if (existingSoDienThoai != null)
            {
                throw new BaseException.BadRequestException("duplicate", "Số điện thoại đã tồn tại");
            }
        }

        public async Task<NguoiDungDto> AddNguoiDungAsync(NguoiDungCreateDto dto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (dto == null)
            {
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu người dùng không hợp lệ");
            }

            // Validate dữ liệu
            ValidationHelper.ValidateGioiTinh(dto.GioiTinh);
            ValidationHelper.ValidateDiaChi(dto.DiaChi);
            ValidationHelper.ValidateNgaySinh(dto.NgaySinh);
            ValidationHelper.ValidateSDT(dto.Sdt);
            ValidationHelper.ValidateCCCD(dto.Cccd);

            // Kiểm tra trùng CCCD, SĐT
            await CheckNguoiDungExistsAsync(dto);

            // Kiểm tra vai trò tồn tại
            if (!Guid.TryParse(dto.MaVaiTro, out Guid maVaiTro))
            {
                throw new BaseException.BadRequestException("invalid_role_id", "Mã vai trò không hợp lệ");
            }

            var vaiTro = await _unitOfWork.GetRepository<VaiTro>().GetByIdAsync(maVaiTro);
            if (vaiTro == null)
            {
                throw new BaseException.NotFoundException("role_not_found", "Vai trò không tồn tại");
            }

            NguoiDung nguoiDung = new NguoiDung
            {
                TenNguoiDung = dto.TenNguoiDung,
                GioiTinh = dto.GioiTinh,
                NgaySinh = dto.NgaySinh,
                Cccd = dto.Cccd,
                SoDienThoai = dto.Sdt,
                DiaChi = dto.DiaChi,
                MaVaiTro = maVaiTro
            };

            await _unitOfWork.GetRepository<NguoiDung>().InsertAsync(nguoiDung);
            await _unitOfWork.SaveAsync();

            return new NguoiDungDto
            {
                Id = nguoiDung.Id.ToString(),
                TenNguoiDung = nguoiDung.TenNguoiDung,
                GioiTinh = nguoiDung.GioiTinh!,
                NgaySinh = nguoiDung.NgaySinh,
                Cccd = nguoiDung.Cccd!,
                Sdt = nguoiDung.SoDienThoai!,
                DiaChi = nguoiDung.DiaChi
            };
        }

        public async Task UpdateNguoiDungAsync(string id, NguoiDungUpdateDto dto)
        {
            if (!Guid.TryParse(id, out Guid guidId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID người dùng không hợp lệ");
            }

            var repository = _unitOfWork.GetRepository<NguoiDung>();
            var existing = await repository.GetByIdAsync(guidId);

            if (existing == null)
            {
                throw new BaseException.NotFoundException("not_found", "Người dùng không tồn tại");
            }

            // Validate dữ liệu
            ValidationHelper.ValidateGioiTinh(dto.GioiTinh!);
            ValidationHelper.ValidateDiaChi(dto.DiaChi!);
            ValidationHelper.ValidateNgaySinh(dto.NgaySinh);

            // Validate CCCD và SĐT nếu có thay đổi
            if (dto.Cccd != existing.Cccd)
            {
                ValidationHelper.ValidateCCCD(dto.Cccd!);
                // Kiểm tra trùng CCCD
                var existingCCCD = await repository.FindByConditionAsync(x => x.Cccd == dto.Cccd && x.Id != guidId);
                if (existingCCCD != null)
                {
                    throw new BaseException.BadRequestException("duplicate", "CCCD đã tồn tại");
                }
            }

            if (dto.Sdt != existing.SoDienThoai)
            {
                ValidationHelper.ValidateSDT(dto.Sdt!);
                // Kiểm tra trùng SĐT
                var existingSDT = await repository.FindByConditionAsync(x => x.SoDienThoai == dto.Sdt && x.Id != guidId);
                if (existingSDT != null)
                {
                    throw new BaseException.BadRequestException("duplicate", "Số điện thoại đã tồn tại");
                }
            }

            // Cập nhật
            existing.TenNguoiDung = dto.TenNguoiDung!;
            existing.GioiTinh = dto.GioiTinh!;
            existing.NgaySinh = dto.NgaySinh!;
            existing.DiaChi = dto.DiaChi!;
            existing.Cccd = dto.Cccd!;
            existing.SoDienThoai = dto.Sdt!;

            try
            {
                repository.Update(existing);
                await _unitOfWork.SaveAsync();
            }
            catch (SqlException)
            {
                throw new BaseException.BadRequestException("server_error", "Lỗi hệ thống khi cập nhật người dùng");
            }
        }

        public async Task DeleteNguoiDungAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid guidId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID người dùng không hợp lệ");
            }

            var repository = _unitOfWork.GetRepository<NguoiDung>();
            var existing = await repository.GetByIdAsync(guidId);

            if (existing == null)
            {
                throw new BaseException.NotFoundException("not_found", "Người dùng không tồn tại");
            }

            try
            {
                repository.Delete(existing);
                await _unitOfWork.SaveAsync();
            }
            catch (SqlException)
            {
                throw new BaseException.BadRequestException("server_error", "Lỗi hệ thống khi xoá người dùng");
            }
        }

        public async Task<IEnumerable<NguoiDungDto>> SearchNguoiDungAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return Enumerable.Empty<NguoiDungDto>();
            }

            var query = _unitOfWork.GetRepository<NguoiDung>().Entities;

            var filtered = await query
                .Where(x =>
                    x.TenNguoiDung.Contains(keyword) ||
                    (x.SoDienThoai != null && x.SoDienThoai.Contains(keyword)) ||
                    (x.Cccd != null && x.Cccd.Contains(keyword)))
                .ToListAsync();

            return filtered.Select(x => new NguoiDungDto
            {
                Id = x.Id.ToString(),
                TenNguoiDung = x.TenNguoiDung,
                GioiTinh = x.GioiTinh!,
                NgaySinh = x.NgaySinh,
                Cccd = x.Cccd!,
                Sdt = x.SoDienThoai!,
                DiaChi = x.DiaChi
            });
        }

    }
}

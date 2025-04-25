using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class NhaCungCapService : INhaCungCapService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NhaCungCapService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<List<NhaCungCapDto>> GetAllNhaCungCapAsync()
        {
            var nccs = await _unitOfWork.GetRepository<NhaCungCap>().GetAllAsync();
            return nccs.Select(ncc => new NhaCungCapDto
            {
                Id = ncc.Id.ToString(),
                TenNhaCungCap = ncc.TenNhaCungCap,
                SDT = ncc.SoDienThoai!,
                Email = ncc.Email!,
                DiaChi = ncc.DiaChi!
            }).ToList();
        }

        public async Task<NhaCungCapDto> GetNhaCungCapByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new BaseException.BadRequestException("invalid_data", "Mã nhà cung cấp không được để trống");

            Guid.TryParse(id, out Guid guidId);
            var ncc = await _unitOfWork.GetRepository<NhaCungCap>().GetByIdAsync(guidId);

            if (ncc == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy nhà cung cấp.");

            return new NhaCungCapDto
            {
                Id = ncc.Id.ToString(),
                TenNhaCungCap = ncc.TenNhaCungCap,
                SDT = ncc.SoDienThoai!,
                Email = ncc.Email!,
                DiaChi = ncc.DiaChi!
            };
        }

        public async Task<NhaCungCapCreateDto> CreateNhaCungCapAsync(NhaCungCapCreateDto dto)
        {
            if (dto == null)
                throw new BaseException.ValidationException("invalid_data", "Dữ liệu không hợp lệ.");

            var existed = await _unitOfWork.GetRepository<NhaCungCap>().FindByConditionAsync(x => x.TenNhaCungCap == dto.TenNhaCungCap);
            if (existed != null)
                throw new BaseException.ValidationException("duplicate", "Tên nhà cung cấp đã tồn tại.");

            var ncc = new NhaCungCap
            {
                TenNhaCungCap = dto.TenNhaCungCap,
                SoDienThoai = dto.SDT,
                Email = dto.Email,
                DiaChi = dto.DiaChi
            };

            await _unitOfWork.GetRepository<NhaCungCap>().InsertAsync(ncc);
            await _unitOfWork.SaveAsync();
            return dto;
        }

        public async Task<NhaCungCapCreateDto> UpdateNhaCungCapAsync(string id, NhaCungCapCreateDto dto)
        {
            if (!Guid.TryParse(id, out Guid guidId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID nhà cung cấp không hợp lệ");
            }

            // 🔎 Kiểm tra trùng email, số điện thoại, tên
            var repo = _unitOfWork.GetRepository<NhaCungCap>();

            NhaCungCap? ncc = await repo.GetByIdAsync(guidId);
            if (ncc == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy nhà cung cấp.");

            ValidationHelper.ValidateEmail(dto.Email!);
            ValidationHelper.ValidateDiaChi(dto.DiaChi!);
            ValidationHelper.ValidateSDT(dto.SDT!);

            bool emailExists = await repo.AnyAsync(x => x.Email == dto.Email && x.Id != guidId);
            if (emailExists)
            {
                throw new BaseException.BadRequestException("email_exists", "Email đã được sử dụng bởi nhà cung cấp khác.");
            }

            bool sdtExists = await repo.AnyAsync(x => x.SoDienThoai == dto.SDT && x.Id != guidId);
            if (sdtExists)
            {
                throw new BaseException.BadRequestException("phone_exists", "Số điện thoại đã được sử dụng bởi nhà cung cấp khác.");
            }

            bool nameExists = await repo.AnyAsync(x => x.TenNhaCungCap == dto.TenNhaCungCap && x.Id != guidId);
            if (nameExists)
            {
                throw new BaseException.BadRequestException("name_exists", "Tên nhà cung cấp đã tồn tại.");
            }

            ncc.TenNhaCungCap = dto.TenNhaCungCap;
            ncc.SoDienThoai = dto.SDT;
            ncc.Email = dto.Email;
            ncc.DiaChi = dto.DiaChi;

            _unitOfWork.GetRepository<NhaCungCap>().Update(ncc);
            await _unitOfWork.SaveAsync();

            return dto;
        }

        public async Task DeleteNhaCungCapAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new BaseException.BadRequestException("invalid_data", "Mã nhà cung cấp không được để trống");

            Guid.TryParse(id, out Guid guidId);
            var ncc = await _unitOfWork.GetRepository<NhaCungCap>().GetByIdAsync(guidId);
            if (ncc == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy nhà cung cấp.");

            await _unitOfWork.GetRepository<NhaCungCap>().DeleteAsync(guidId);
            await _unitOfWork.SaveAsync();
        }

        public async Task<List<NhaCungCapDto>> SearchNhaCungCapAsync(string keyword)
        {
            keyword = keyword?.Trim().ToLower() ?? "";

            var query = _unitOfWork.GetRepository<NhaCungCap>()
                .GetEntitiesWithCondition(x =>
                    x.TenNhaCungCap.ToLower().Contains(keyword) ||
                    x.Email!.ToLower().Contains(keyword) ||
                    x.SoDienThoai!.ToLower().Contains(keyword) ||
                    x.DiaChi!.ToLower().Contains(keyword)
                );

            var results = await query.ToListAsync();

            return results.Select(ncc => new NhaCungCapDto
            {
                Id = ncc.Id.ToString(),
                TenNhaCungCap = ncc.TenNhaCungCap,
                SDT = ncc.SoDienThoai!,
                Email = ncc.Email!,
                DiaChi = ncc.DiaChi!
            }).ToList();
        }
    }
}

using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
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

        public async Task<NhaCungCapDto> UpdateNhaCungCapAsync(NhaCungCapDto dto)
        {
            if (dto == null)
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ.");

            Guid.TryParse(dto.Id, out Guid guidId);
            var ncc = await _unitOfWork.GetRepository<NhaCungCap>().GetByIdAsync(guidId);
            if (ncc == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy nhà cung cấp.");

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
    }
}

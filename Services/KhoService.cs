using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class KhoService : IKhoService
    {
        private readonly IUnitOfWork _unitOfWork;

        public KhoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<List<KhoDto>> GetAllKhoAsync()
        {
            var khos = await _unitOfWork.GetRepository<Kho>().GetAllAsync();
            return khos.Select(k => new KhoDto
            {
                Id = k.Id.ToString(),
                TenKho = k.TenKho,
                DiaChi = k.DiaChi
            }).ToList();
        }

        public async Task<KhoDto> GetKhoByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new BaseException.BadRequestException("invalid_data", "Mã kho không được để trống");
            }

            Guid.TryParse(id, out Guid guidId);
            var kho = await _unitOfWork.GetRepository<Kho>().GetByIdAsync(guidId);
            if (kho == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy kho.");

            return new KhoDto
            {
                Id = kho.Id.ToString(),
                TenKho = kho.TenKho,
                DiaChi = kho.DiaChi
            };
        }

        public async Task<KhoCreateDto> CreateKhoAsync(KhoCreateDto dto)
        {
            if (dto == null)
                throw new BaseException.ValidationException("invalid_data", "Dữ liệu không hợp lệ.");

            // Có thể kiểm tra trùng tên nếu cần
            Kho? existed = await _unitOfWork.GetRepository<Kho>().FindByConditionAsync(k => k.TenKho == dto.TenKho);
            if (existed == null)
                throw new BaseException.ValidationException("duplicate", "Tên kho đã tồn tại.");

            Kho kho = new Kho
            {
                TenKho = dto.TenKho,
                DiaChi = dto.DiaChi!
            };

            await _unitOfWork.GetRepository<Kho>().InsertAsync(kho);
            await _unitOfWork.SaveAsync();
            return dto;
        }

        public async Task<KhoDto> UpdateKhoAsync(KhoDto dto)
        {
            if (dto == null )
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ.");

            var kho = await _unitOfWork.GetRepository<Kho>().GetByIdAsync(dto.Id);
            if (kho == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy kho cần cập nhật.");

            kho.TenKho = dto.TenKho;
            kho.DiaChi = dto.DiaChi;

            _unitOfWork.GetRepository<Kho>().Update(kho);
            await _unitOfWork.SaveAsync();

            return dto;
        }

        public async Task DeleteKhoAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new BaseException.BadRequestException("invalid_data", "Mã kho không được để trống");
            }

            Guid.TryParse(id, out Guid guidId);
            Kho? kho = await _unitOfWork.GetRepository<Kho>().GetByIdAsync(guidId);
            if (kho == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy kho cần xóa.");

            await _unitOfWork.GetRepository<Kho>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
        }
    }
}

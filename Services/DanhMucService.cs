using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Services
{
    public class DanhMucService : IDanhMucService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DanhMucService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<IEnumerable<DanhMucDto>> GetAllDanhMucAsync()
        {
            var list = await _unitOfWork.GetRepository<DanhMuc>().GetAllAsync();
            return list.Select(x => new DanhMucDto
            {
                //Id = x.Id.ToString(),
                TenDanhMuc = x.TenDanhMuc,
                MoTa = x.MoTa!
            });
        }

        public async Task<DanhMucDto> GetDanhMucByIdAsync(string id)
        {
            if (!Guid.TryParse(id, out var guidId))
                throw new BaseException.BadRequestException("invalid_data", "Mã danh mục không hợp lệ");

            var dm = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(guidId);
            if (dm == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy danh mục");

            return new DanhMucDto
            {
                Id = dm.Id.ToString(),
                TenDanhMuc = dm.TenDanhMuc,
                MoTa = dm.MoTa!
            };
        }

        public async Task<DanhMucCreateDto> AddDanhMucAsync(DanhMucCreateDto dto)
        {
            var exist = await _unitOfWork.GetRepository<DanhMuc>().FindByConditionAsync(d => d.TenDanhMuc == dto.TenDanhMuc);
            if (exist != null)
                throw new BaseException.BadRequestException("duplicate", "Danh mục đã tồn tại");

            var entity = new DanhMuc
            {
                TenDanhMuc = dto.TenDanhMuc,
                MoTa = dto.MoTa
            };

            await _unitOfWork.GetRepository<DanhMuc>().InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return dto;
        }

        public async Task<bool> UpdateDanhMucAsync(DanhMucDto dto)
        {
            if (!Guid.TryParse(dto.Id, out var guidId))
                throw new BaseException.BadRequestException("invalid_data", "Mã danh mục không hợp lệ");

            var entity = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(guidId);
            if (entity == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy danh mục");

            entity.TenDanhMuc = dto.TenDanhMuc;
            entity.MoTa = dto.MoTa;

            _unitOfWork.GetRepository<DanhMuc>().Update(entity);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteDanhMucAsync(string id)
        {
            if (!Guid.TryParse(id, out var guidId))
                throw new BaseException.BadRequestException("invalid_data", "Mã danh mục không hợp lệ");

            var entity = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(guidId);
            if (entity == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy danh mục");

            _unitOfWork.GetRepository<DanhMuc>().Delete(entity);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<DanhMucDto>> SearchDanhMucAsync(string keyword)
        {
            var query = _unitOfWork.GetRepository<DanhMuc>().Entities.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(d => d.TenDanhMuc.Contains(keyword) || (d.MoTa != null && d.MoTa.Contains(keyword)));
            }

            var result = await query.ToListAsync();
            return result.Select(d => new DanhMucDto
            {
                Id = d.Id.ToString(),
                TenDanhMuc = d.TenDanhMuc,
                MoTa = d.MoTa!
            });
        }
    }
}

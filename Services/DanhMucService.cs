using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Services
{

    public class DanhMucService : IDanhMucService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DanhMucService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IUnitOfWork GetUnitOfWork()
        {
            return _unitOfWork;
        }


        public async Task<List<DanhMucDto>> GetAllDanhMucAsync()
        {
            var danhMucs = await _unitOfWork.GetRepository<DanhMuc>().GetAllAsync();
            if (danhMucs == null || !danhMucs.Any()) return new List<DanhMucDto>();

            return danhMucs.Select(d => new DanhMucDto
            {
                Id = d.Id,
                TenDanhMuc = d.TenDanhMuc,
                MoTa = d.MoTa
            }).ToList();
        }

        public async Task<DanhMuc?> GetDanhMucByIdAsync(Guid id)
        {
            return await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(id);
        }

        public async Task<bool> CreateDanhMucAsync(DanhMucDto dto)
        {
            if (dto == null) return false;

            var danhMuc = new DanhMuc
            {
                Id = Guid.NewGuid(),
                TenDanhMuc = dto.TenDanhMuc,
                MoTa = dto.MoTa
            };

            await _unitOfWork.GetRepository<DanhMuc>().InsertAsync(danhMuc);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateDanhMucAsync(DanhMucDto dto)
        {
            if (dto == null) return false;
            var danhMuc = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(dto.Id);
            if (danhMuc == null) return false;

            danhMuc.TenDanhMuc = dto.TenDanhMuc;
            danhMuc.MoTa = dto.MoTa;

            _unitOfWork.GetRepository<DanhMuc>().Update(danhMuc);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteDanhMucAsync(Guid id)
        {
            var danhMuc = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(id);
            if (danhMuc == null) return false;

            await _unitOfWork.GetRepository<DanhMuc>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}

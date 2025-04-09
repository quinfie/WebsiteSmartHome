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
            _unitOfWork = unitOfWork;
        }

        public IUnitOfWork GetUnitOfWork()
        {
            return _unitOfWork;
        }


        public async Task<List<KhoDto>> GetAllKhoAsync()
        {
            var khos = await _unitOfWork.GetRepository<Kho>().GetAllAsync();
            if (khos == null || !khos.Any()) return new List<KhoDto>();

            return khos.Select(d => new KhoDto
            {
                Id = d.Id,
                TenKho = d.TenKho,
                DiaChi = d.DiaChi
            }).ToList();
        }

        public async Task<Kho?> GetKhoByIdAsync(Guid id)
        {
            return await _unitOfWork.GetRepository<Kho>().GetByIdAsync(id);
        }

        public async Task<bool> CreateKhoAsync(KhoDto dto)
        {
            if (dto == null) return false;

            var kho = new Kho
            {
                Id = Guid.NewGuid(),
                TenKho = dto.TenKho,
                DiaChi = dto.DiaChi
            };

            await _unitOfWork.GetRepository<Kho>().InsertAsync(kho);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateKhoAsync(KhoDto dto)
        {
            if (dto == null) return false;
            var kho = await _unitOfWork.GetRepository<Kho>().GetByIdAsync(dto.Id);
            if (kho == null) return false;

            kho.TenKho = dto.TenKho;
            kho.DiaChi = dto.DiaChi;

            _unitOfWork.GetRepository<Kho>().Update(kho);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteKhoAsync(Guid id)
        {
            var kho = await _unitOfWork.GetRepository<Kho>().GetByIdAsync(id);
            if (kho == null) return false;

            await _unitOfWork.GetRepository<Kho>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }

        Task<DanhMuc?> IKhoService.GetKhoByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> CreateKhoAsync(DanhMucDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateKhoAsync(DanhMucDto dto)
        {
            throw new NotImplementedException();
        }
    }
}

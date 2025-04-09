using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
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
            _unitOfWork = unitOfWork;
        }

        public IUnitOfWork GetUnitOfWork()
        {
            return _unitOfWork;
        }


        public async Task<List<NhaCungCapDto>> GetAllNhaCungCapAsync()
        {
            var nhaCungCaps = await _unitOfWork.GetRepository<NhaCungCap>().GetAllAsync();
            if (nhaCungCaps == null || !nhaCungCaps.Any()) return new List<NhaCungCapDto>();

            return nhaCungCaps.Select(d => new NhaCungCapDto
            {
                Id = d.Id,
                TenNhaCungCap = d.TenNhaCungCap,
                SDT = d.SDT,
                Email = d.Email,
                DiaChi = d.DiaChi
            }).ToList();
        }

        public async Task<NhaCungCap?> GetNhaCungCapByIdAsync(Guid id)
        {
            return await _unitOfWork.GetRepository<NhaCungCap>().GetByIdAsync(id);
        }

        public async Task<bool> CreateNhaCungCapAsync(NhaCungCapDto dto)
        {
            if (dto == null) return false;

            var nhaCungCap = new NhaCungCap
            {
                Id = Guid.NewGuid(),
                TenNhaCungCap = dto.TenNhaCungCap,
                SDT = dto.SDT,
                Email = dto.Email,
                DiaChi = dto.DiaChi
            };

            await _unitOfWork.GetRepository<NhaCungCap>().InsertAsync(nhaCungCap);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateNhaCungCapAsync(NhaCungCapDto dto)
        {
            if (dto == null) return false;
            var nhaCungCap = await _unitOfWork.GetRepository<NhaCungCap>().GetByIdAsync(dto.Id);
            if (nhaCungCap == null) return false;

            nhaCungCap.TenNhaCungCap = dto.TenNhaCungCap;
            nhaCungCap.SDT = dto.SDT;
            nhaCungCap.Email = dto.Email;
            nhaCungCap.DiaChi = dto.DiaChi;

            _unitOfWork.GetRepository<NhaCungCap>().Update(nhaCungCap);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteNhaCungCapAsync(Guid id)
        {
            var nhaCungCap = await _unitOfWork.GetRepository<NhaCungCap>().GetByIdAsync(id);
            if (nhaCungCap == null) return false;

            await _unitOfWork.GetRepository<NhaCungCap>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public Task<bool> CreateNhaCungCapAsync(DanhMucDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateNhaCungCapAsync(DanhMucDto dto)
        {
            throw new NotImplementedException();
        }
    }
}

using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class DanhMucService : IDanhMucService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DanhMucService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<DanhMucDto>> GetAllDanhMucAsync()
        {
            var danhMucs = await _unitOfWork.GetRepository<DanhMuc>().GetAllAsync();
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

        //public async Task<bool> CreateDanhMucAsync(DanhMuc danhMuc)
        //{
        //    if (danhMuc == null) return false;
        //    await _unitOfWork.GetRepository<DanhMuc>().InsertAsync(danhMuc);
        //    return await _unitOfWork.SaveAsync();
        //}

        //public async Task<bool> UpdateDanhMucAsync(Guid id, DanhMuc danhMuc)
        //{
        //    if (id != danhMuc.Id) return false;

        //    var existingDanhMuc = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(id);
        //    if (existingDanhMuc == null) return false;

        //    existingDanhMuc.TenDanhMuc = danhMuc.TenDanhMuc;
        //    _unitOfWork.GetRepository<DanhMuc>().Update(existingDanhMuc);
        //    return await _unitOfWork.SaveAsync();
        //}

        //public async Task<bool> DeleteDanhMucAsync(Guid id)
        //{
        //    var danhMuc = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(id);
        //    if (danhMuc == null) return false;

        //    _unitOfWork.GetRepository<DanhMuc>().Delete(danhMuc);
        //    return await _unitOfWork.SaveAsync();
        //}
    }
}

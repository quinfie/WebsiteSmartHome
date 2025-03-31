using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Services
{
    public interface IDanhMucService
    {
        Task<List<DanhMucDto>> GetAllDanhMucAsync();
        Task<DanhMuc?> GetDanhMucByIdAsync(Guid id);
        //Task<bool> CreateDanhMucAsync(DanhMuc danhMuc);
        //Task<bool> UpdateDanhMucAsync(Guid id, DanhMuc danhMuc);
        //Task<bool> DeleteDanhMucAsync(Guid id);
    }
}

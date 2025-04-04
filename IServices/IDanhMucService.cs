using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Services
{
    public interface IDanhMucService
    {
        Task<List<DanhMucDto>> GetAllDanhMucAsync();
        Task<DanhMuc?> GetDanhMucByIdAsync(Guid id);
        Task<bool> CreateDanhMucAsync(DanhMucDto dto);
        Task<bool> UpdateDanhMucAsync(DanhMucDto dto);
        Task<bool> DeleteDanhMucAsync(Guid id);
    }
}

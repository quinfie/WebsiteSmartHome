using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.Services
{
    public interface IDanhMucService
    {
        Task<IEnumerable<DanhMucDto>> GetAllDanhMucAsync();
        Task<DanhMucDto> GetDanhMucByIdAsync(string id);
        Task<DanhMucCreateDto> AddDanhMucAsync(DanhMucCreateDto dto);
        Task<bool> UpdateDanhMucAsync(DanhMucDto dto);
        Task<bool> DeleteDanhMucAsync(string id);
        Task<IEnumerable<DanhMucDto>> SearchDanhMucAsync(string keyword);
    }
}

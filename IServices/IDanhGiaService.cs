using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IDanhGiaService
    {
        Task<List<DanhGiaDto>> GetAllDanhGiaAsync();
        Task<DanhGiaDto?> GetDanhGiaByIdAsync(Guid id);
        Task<bool> CreateDanhGiaAsync(DanhGiaDto danhGiaDto);
        Task<bool> UpdateDanhGiaAsync(Guid id, DanhGiaDto danhGiaDto);
        Task<bool> DeleteDanhGiaAsync(Guid id);
    }
}

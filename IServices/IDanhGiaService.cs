using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IDanhGiaService
    {
        Task<List<DanhGiaDto>> GetAllDanhGiaAsync();
        Task<List<DanhGiaDto>> SearchDanhGiaByContentAsync(string content);

        Task<DanhGiaDto?> GetDanhGiaByIdAsync(Guid id);
        Task<bool> CreateDanhGiaAsync(DanhGiaDto danhGiaDto);
        Task<bool> UpdateDanhGiaAsync(Guid id, DanhGiaDto danhGiaDto);
        Task<bool> DeleteDanhGiaAsync(Guid id);
    }
}

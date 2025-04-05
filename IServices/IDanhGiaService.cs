using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IDanhGiaService
    {
        Task<List<DanhGiaDto>> GetAllDanhGiaAsync();
        Task<List<DanhGiaDto>> SearchDanhGiaByContentAsync(string content);
        Task<DanhGiaDto?> GetDanhGiaByIdAsync(string id); // đổi từ Guid sang string
        Task<bool> CreateDanhGiaAsync(DanhGiaDto danhGiaDto);
        Task<bool> UpdateDanhGiaAsync(string id, DanhGiaDto danhGiaDto); // đổi Guid -> string
        Task<bool> DeleteDanhGiaAsync(string id);
    }
}


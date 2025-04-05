using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IDanhGiaService
    {
        Task<List<DanhGiaDto>> GetAllDanhGiaAsync();
        Task<List<DanhGiaDto>> SearchDanhGiaByContentAsync(string content);
<<<<<<< HEAD
        Task<DanhGiaDto?> GetDanhGiaByIdAsync(string id); // đổi từ Guid sang string
        Task<bool> CreateDanhGiaAsync(DanhGiaDto danhGiaDto);
        Task<bool> UpdateDanhGiaAsync(string id, DanhGiaDto danhGiaDto); // đổi Guid -> string
        Task<bool> DeleteDanhGiaAsync(string id);
=======

        Task<DanhGiaDto?> GetDanhGiaByIdAsync(Guid id);
        Task<bool> CreateDanhGiaAsync(DanhGiaDto danhGiaDto);
        Task<bool> UpdateDanhGiaAsync(Guid id, DanhGiaDto danhGiaDto);
        Task<bool> DeleteDanhGiaAsync(Guid id);
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
    }
}


using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.IServices
{
    public interface IKhoService
    {
        Task<List<KhoDto>> GetAllKhoAsync();
        Task<KhoDto> GetKhoByIdAsync(string id);
        Task<KhoCreateDto> CreateKhoAsync(KhoCreateDto dto);
        Task<KhoDto> UpdateKhoAsync(KhoDto dto);
        Task<string> DeleteKhoAsync(string id);
    }
}

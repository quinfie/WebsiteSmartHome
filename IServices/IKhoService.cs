using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.IServices
{
    public interface IKhoService
    {
        Task<List<KhoDto>> GetAllKhoAsync();
        Task<DanhMuc?> GetKhoByIdAsync(Guid id);
        Task<bool> CreateKhoAsync(DanhMucDto dto);
        Task<bool> UpdateKhoAsync(DanhMucDto dto);
        Task<bool> DeleteKhoAsync(Guid id);
        Task<bool> UpdateKhoAsync(KhoDto dto);
        Task<bool> CreateKhoAsync(KhoDto dto);
    }
}

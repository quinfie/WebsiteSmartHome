using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.IServices
{
    public interface INhaCungCapService
    {
        Task<List<NhaCungCapDto>> GetAllNhaCungCapAsync();
        Task<NhaCungCap?> GetNhaCungCapByIdAsync(Guid id);
        Task<bool> CreateNhaCungCapAsync(DanhMucDto dto);
        Task<bool> UpdateNhaCungCapAsync(DanhMucDto dto);
        Task<bool> DeleteNhaCungCapAsync(Guid id);
        Task<bool> CreateNhaCungCapAsync(NhaCungCapDto dto);
        Task<bool> UpdateNhaCungCapAsync(NhaCungCapDto dto);
    }
}

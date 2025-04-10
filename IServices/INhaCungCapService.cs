using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.IServices
{
    public interface INhaCungCapService
    {
        Task<List<NhaCungCapDto>> GetAllNhaCungCapAsync();
        Task<NhaCungCapDto> GetNhaCungCapByIdAsync(string id);
        Task<NhaCungCapCreateDto> CreateNhaCungCapAsync(NhaCungCapCreateDto dto);
        Task<NhaCungCapDto> UpdateNhaCungCapAsync(NhaCungCapDto dto);
        Task DeleteNhaCungCapAsync(string id);
    }

}

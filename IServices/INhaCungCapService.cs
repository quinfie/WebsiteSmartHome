using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.IServices
{
    public interface INhaCungCapService
    {
        Task<List<NhaCungCapDto>> GetAllNhaCungCapAsync();
        Task<NhaCungCapDto> GetNhaCungCapByIdAsync(string id);
        Task<NhaCungCapCreateDto> CreateNhaCungCapAsync(NhaCungCapCreateDto dto);
        Task<NhaCungCapCreateDto> UpdateNhaCungCapAsync(string id, NhaCungCapCreateDto dto);
        Task DeleteNhaCungCapAsync(string id);
        Task<List<NhaCungCapDto>> SearchNhaCungCapAsync(string keyword);
    }

}

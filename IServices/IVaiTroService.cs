using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Services
{
    public interface IVaiTroService
    {
        Task<IEnumerable<VaiTroDto>> GetVaiTroAsync();
        Task<VaiTroDto?> GetVaiTroByIdAsync(string id);
        Task AddVaiTroAsync(string tenVaiTro);
        Task<bool> UpdateVaiTroAsync(string id, string tenVaiTro);
        Task<IEnumerable<VaiTro>> SearchVaiTro(string? keyword);
        Task<bool> DeleteVaiTroAsync(string id);
    }
}

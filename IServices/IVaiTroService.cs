using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.Services
{
    public interface IVaiTroService
    {
        Task<Guid?> GetRoleIdByNameAsync(string rolename);
        Task<IEnumerable<VaiTroDto>> GetVaiTroAsync();
        Task<VaiTroDto?> GetVaiTroByIdAsync(string id);
        Task<VaiTroDto> AddVaiTroAsync(string tenVaiTro);
        Task<bool> UpdateVaiTroAsync(string id, string tenVaiTro);
        Task<IEnumerable<VaiTro>> SearchVaiTro(string? keyword);
        Task<bool> DeleteVaiTroAsync(string id);
    }
}

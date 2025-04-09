using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.IServices
{
    public interface ISanPhamService
    {
        Task<List<SanPhamDto>> GetAllSanPhamAsync();
        Task<SanPham?> GetSanPhamByIdAsync(Guid id);
        Task<bool> CreateSanPhamAsync(SanPhamDto dto);
        Task<bool> UpdateSanPhamAsync(SanPhamDto dto);
        Task<bool> DeleteSanPhamAsync(Guid id);
    }

}

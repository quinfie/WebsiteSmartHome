using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Services
{
    public interface IDonHangService
    {
        Task<List<DonHangDto>> GetAllDonHangAsync();
        Task<DonHangDto?> GetDonHangByIdAsync(Guid id);
        Task<List<DonHangDto>> SearchDonHangAsync(string trangThai);
        Task<bool> CreateDonHangAsync(DonHangDto donHangDto);
        Task<bool> UpdateDonHangAsync(Guid id, DonHangDto donHangDto);
        Task<bool> DeleteDonHangAsync(Guid id);
    }
}

using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Services
{
    public interface IDonHangService
    {
        Task<List<DonHangDto>> GetAllDonHangAsync();
        Task<DonHangDto?> GetDonHangByIdAsync(string id);
        Task<List<DonHangDto>> SearchDonHangAsync(string trangThai);
        Task<bool> CreateDonHangAsync(DonHangDto donHangDto);
        Task<bool> UpdateDonHangAsync(string id, DonHangDto donHangDto);
        Task<bool> DeleteDonHangAsync(string id);
    }

}

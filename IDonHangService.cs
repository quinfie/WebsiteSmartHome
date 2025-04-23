using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Services
{
    public interface IDonHangService
    {
        Task<List<DonHangDto>> GetAllDonHangAsync();
        Task<DonHangDto?> GetDonHangByIdAsync(string id);
        Task<List<DonHangDto>> SearchDonHangAsync(string trangThai);
        Task<bool> CreateDonHangAsync(CreateDonHangDto createDto);
        Task<bool> UpdateDonHangAsync(string id, UpdateDonHangDto updateDto);
        Task<bool> DeleteDonHangAsync(string id);
    }

}

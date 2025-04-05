using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.Services
{
    public interface IDonHangService
    {
        Task<List<DonHangDto>> GetAllDonHangAsync();
<<<<<<< HEAD
        Task<DonHangDto?> GetDonHangByIdAsync(string id);
        Task<List<DonHangDto>> SearchDonHangAsync(string trangThai);
        Task<bool> CreateDonHangAsync(DonHangDto donHangDto);
        Task<bool> UpdateDonHangAsync(string id, DonHangDto donHangDto);
        Task<bool> DeleteDonHangAsync(string id);
    }

=======
        Task<DonHangDto?> GetDonHangByIdAsync(Guid id);
        Task<List<DonHangDto>> SearchDonHangAsync(string trangThai);
        Task<bool> CreateDonHangAsync(DonHangDto donHangDto);
        Task<bool> UpdateDonHangAsync(Guid id, DonHangDto donHangDto);
        Task<bool> DeleteDonHangAsync(Guid id);

    }
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
}

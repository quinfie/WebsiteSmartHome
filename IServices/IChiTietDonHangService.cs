using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.Services
{
    public interface IChiTietDonHangService
    {
        Task<List<ChiTietDonHangDto>> GetAllChiTietDonHangAsync();
        Task<List<ChiTietDonHangDto>> SearchChiTietDonHangByNameAsync(string name);

        Task<ChiTietDonHangDto?> GetChiTietDonHangByIdAsync(Guid id);
        Task<bool> CreateChiTietDonHangAsync(ChiTietDonHangDto chiTietDonHangDto);
        Task<bool> UpdateChiTietDonHangAsync(Guid id, ChiTietDonHangDto chiTietDonHangDto);
        Task<bool> DeleteChiTietDonHangAsync(Guid id);
    }
}

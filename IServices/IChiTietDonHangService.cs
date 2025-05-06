using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.IServices
{
    public interface IChiTietDonHangService
    {
        Task<List<ChiTietDonHangDto>> GetAllChiTietDonHangAsync();
        Task<List<ChiTietDonHangDto>> SearchChiTietDonHangByNameAsync(string name);
        Task<List<ChiTietDonHangDto>> GetChiTietDonHangByDonHangIdAsync(string donHangId);
        Task<ChiTietDonHangDto> UpdateChiTietDonHangAsync(string id, UpdateChiTietDonHangDto dto);
        Task<bool> DeleteChiTietDonHangAsync(string id);
        Task<List<ChiTietDonHang>> ThemChiTietDonHangAsync(Guid donHangId, List<RequestCreateChiTietDonHangDto> chiTietDonHangs);
    }
}

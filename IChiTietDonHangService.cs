using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.Services
{
    public interface IChiTietDonHangService
    {
        Task<List<ChiTietDonHangDto>> GetAllChiTietDonHangAsync();
        Task<List<ChiTietDonHangDto>> SearchChiTietDonHangByNameAsync(string name);

        Task<bool> CreateChiTietDonHangAsync(CreateChiTietDonHangDto dto);
        Task<ChiTietDonHangDto?> GetChiTietDonHangByIdAsync(Guid maDonHang, Guid maSanPham);
        Task<bool> UpdateChiTietDonHangAsync(Guid maDonHang, Guid maSanPham, UpdateChiTietDonHangDto dto);
        Task<bool> DeleteChiTietDonHangAsync(Guid maDonHang, Guid maSanPham);
    }

}

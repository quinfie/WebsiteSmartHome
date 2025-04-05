using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.Services
{
    public interface IChiTietDonHangService
    {
        Task<List<ChiTietDonHangDto>> GetAllChiTietDonHangAsync();
        Task<List<ChiTietDonHangDto>> SearchChiTietDonHangByNameAsync(string name);

<<<<<<< HEAD
       
        Task<bool> CreateChiTietDonHangAsync(ChiTietDonHangDto chiTietDonHangDto);
        Task<ChiTietDonHangDto?> GetChiTietDonHangByIdAsync(Guid maDonHang, Guid maSanPham);
        Task<bool> UpdateChiTietDonHangAsync(Guid maDonHang, Guid maSanPham, ChiTietDonHangDto dto);
        Task<bool> DeleteChiTietDonHangAsync(Guid maDonHang, Guid maSanPham);

=======
        Task<ChiTietDonHangDto?> GetChiTietDonHangByIdAsync(Guid id);
        Task<bool> CreateChiTietDonHangAsync(ChiTietDonHangDto chiTietDonHangDto);
        Task<bool> UpdateChiTietDonHangAsync(Guid id, ChiTietDonHangDto chiTietDonHangDto);
        Task<bool> DeleteChiTietDonHangAsync(Guid id);
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
    }
}

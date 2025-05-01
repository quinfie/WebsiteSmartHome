using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.Services
{
    public interface IDonHangService
    {
        // Lấy danh sách đơn hàng (không bao gồm chi tiết)
        Task<List<DonHangDto>> GetDanhSachDonHangAsync();

        // Lấy chi tiết đơn hàng theo ID
        Task<ViewResponseCreateDonHangDto> GetChiTietDonHangAsync(string id);

        // Thêm đơn hàng mới
        Task<ResponseCreateDonHangDto> ThemDonHangAsync(RequestCreateDonHangDto dto);

        // Cập nhật đơn hàng
        Task<ResponseCreateDonHangDto> UpdateDonHangAsync(string id, RequestCreateDonHangDto dto);

        // Xóa đơn hàng
        Task<bool> DeleteDonHangAsync(string id);
    }
} 
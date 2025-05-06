using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IDonHangService
    {
        // Lấy danh sách đơn hàng (không bao gồm chi tiết)
        Task<List<DonHangDto>> GetDanhSachDonHangAsync();

        // Lấy chi tiết đơn hàng theo ID
        Task<ViewResponseCreateDonHangDto> GetChiTietDonHangAsync(string id);

        // Thêm đơn hàng mới
        Task<ResponseCreateDonHangDto> ThemDonHangAsync(RequestCreateDonHangDto dto, string userId);

        // Cập nhật đơn hàng
        Task<ResponseCreateDonHangDto> UpdateDonHangAsync(string id, RequestUpdateDonHangDto dto, string userId);

        // Xóa đơn hàng
        Task<bool> DeleteDonHangAsync(string id, string userId);

        /// <summary>
        /// Lấy danh sách đơn hàng và chi tiết của người dùng hiện tại
        /// </summary>
        Task<List<ViewResponseCreateDonHangDto>> GetDonHangByCurrentUserAsync(string userId);
    }
}
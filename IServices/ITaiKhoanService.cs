using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.IServices
{
    public interface ITaiKhoanService
    {
        Task<IEnumerable<TaiKhoanDto>> GetTaiKhoanAsync();
        Task<TaiKhoanDto?> GetTaiKhoanByIdAsync(string id);
        Task AddTaiKhoanAsync(TaiKhoanCreateDto taiKhoanDto, string maNguoiDung);
        Task<IEnumerable<TaiKhoan>> SearchTaiKhoan(string? keyword, string? trangThai);
        Task UpdateTaiKhoanAsync(string taiKhoanId, TaiKhoanUpdateDto taiKhoanDto);
        Task DeleteTaiKhoanAsync(string taiKhoanId);
    }
}

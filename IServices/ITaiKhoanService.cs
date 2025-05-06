using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.IServices
{
    public interface ITaiKhoanService
    {
        Task<IEnumerable<TaiKhoanDto>> GetTaiKhoanAsync();
        Task<TaiKhoanDto?> GetTaiKhoanByIdAsync(string id);
        Task<TaiKhoanDto> AddTaiKhoanAsync(TaiKhoanCreateDto taiKhoanDto);
        Task<IEnumerable<TaiKhoanDto>> SearchTaiKhoan(string? keyword, string? trangThai);
        Task UpdateTaiKhoanAsync(string taiKhoanId, UpdateTaiKhoanDto taiKhoanDto);
        Task DeleteTaiKhoanAsync(string taiKhoanId);
    }
}

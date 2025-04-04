using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.IServices
{
    public interface ITaiKhoanService
    {

        Task<IEnumerable<TaiKhoan>> SearchTaiKhoan(string? keyword, string? trangThai);
        Task<IEnumerable<TaiKhoanDto>> GetTaiKhoanAsync();
        Task<TaiKhoanDto?> GetTaiKhoanByIdAsync(string id);
        Task AddTaiKhoanAsync(TaiKhoanDto taiKhoanDto);

    }
}

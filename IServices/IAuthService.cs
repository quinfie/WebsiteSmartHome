using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.IServices
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<TaiKhoanDto> GetProfileAsync(string userId);
        Task<bool> UpdateTaiKhoanAsync(string userId, UpdateTaiKhoanDto taiKhoan);
        Task<bool> UpdateNguoiDungAsync(string userId, UpdateNguoiDungDto nguoiDung);
        Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto changePassword);
        Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPassword);
        Task<bool> VerifyEmailAsync(string token);
        Task<bool> ResendVerificationEmailAsync(string email);
    }
}
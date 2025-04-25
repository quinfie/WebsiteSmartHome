using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.IServices.Authentication
{
    public interface IAuthenticationService
    {
        Task<TaiKhoan?> ValidateUserCredentialsAsync(string username, string password);

        string GenerateJwtToken(TaiKhoan user);
    }
}

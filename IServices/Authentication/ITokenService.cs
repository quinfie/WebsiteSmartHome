using WebsiteSmartHome.Data;
using System.Security.Claims;

namespace WebsiteSmartHome.Services.Authentication
{
    public interface ITokenService
    {
        string GenerateJwtToken(TaiKhoan user);
        ClaimsPrincipal DecodeJwtToken(string token);
        Guid GetUserIdFromTokenHeader(String? token);
    }
}

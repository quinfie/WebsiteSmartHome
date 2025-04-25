using WebsiteSmartHome.Data;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.IServices.Authentication;
using WebsiteSmartHome.Repositories;

namespace WebsiteSmartHome.Services.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IGenericRepository<TaiKhoan> _userRepository;
        private readonly ITokenService _tokenService;

        public AuthenticationService(IGenericRepository<TaiKhoan> userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        public async Task<TaiKhoan?> ValidateUserCredentialsAsync(string username, string password)
        {
            TaiKhoan? user = await _userRepository.FindByConditionWithIncludesAsync(
                u => u.TenTaiKhoan == username,
                u => u.NguoiDung! // Include the 'Role' navigation property
            );

            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.MatKhau))
            {
                return user;
            }

            return null;
        }

        public string GenerateJwtToken(TaiKhoan user)
        {
            return _tokenService.GenerateJwtToken(user);
        }
    }
}

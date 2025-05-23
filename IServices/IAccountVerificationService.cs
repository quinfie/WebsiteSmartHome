using System.Threading.Tasks;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.IServices
{
    public interface IAccountVerificationService
    {
        Task<AccountVerificationDto> CreateVerificationAsync(CreateVerificationDto dto);
        Task<bool> VerifyAccountAsync(VerifyAccountDto dto);
        Task<bool> IsVerifiedAsync(Guid taiKhoanId);
        Task<AccountVerificationDto> GetVerificationByTokenAsync(string token);
        Task<AccountVerificationDto> GetVerificationByTaiKhoanIdAsync(Guid taiKhoanId);
    }
}
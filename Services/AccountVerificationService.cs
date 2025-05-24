using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Models;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.Core;
using System.Security.Cryptography;

namespace WebsiteSmartHome.Services
{
    public class AccountVerificationService : IAccountVerificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AccountVerificationService(
            IUnitOfWork unitOfWork,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<AccountVerificationDto> CreateVerificationAsync(CreateVerificationDto dto)
        {
            // Kiểm tra tài khoản tồn tại
            var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(dto.TaiKhoanId);
            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("account_not_found", "Không tìm thấy tài khoản");
            }

            // Tạo token ngẫu nhiên
            var token = GenerateVerificationToken();

            // Tạo bản ghi xác thực mới
            var verification = new AccountVerification
            {
                Id = Guid.NewGuid(),
                TaiKhoanId = dto.TaiKhoanId,
                VerificationToken = token,
                TokenExpiry = DateTime.UtcNow.AddHours(1), // Token hết hạn sau 1 giờ
                IsVerified = false,
                CreatedAt = DateTime.UtcNow
            };

            // Lưu vào cache hoặc database tùy theo yêu cầu
            // Ở đây tôi sẽ sử dụng một Dictionary để lưu tạm thời
            // Trong thực tế, bạn có thể sử dụng Redis hoặc một database khác
            var verificationDto = new AccountVerificationDto
            {
                Id = verification.Id,
                TaiKhoanId = verification.TaiKhoanId,
                VerificationToken = verification.VerificationToken,
                TokenExpiry = verification.TokenExpiry,
                IsVerified = verification.IsVerified,
                CreatedAt = verification.CreatedAt,
                VerifiedAt = verification.VerifiedAt
            };

            // Gửi email xác thực
            await _emailService.SendVerificationEmailAsync(dto.Email, token);

            return verificationDto;
        }

        public async Task<bool> VerifyAccountAsync(VerifyAccountDto dto)
        {
            // Lấy thông tin xác thực từ cache hoặc database
            var verification = await GetVerificationByTokenAsync(dto.Token);
            if (verification == null)
            {
                throw new BaseException.NotFoundException("invalid_token", "Token xác thực không hợp lệ");
            }

            if (verification.IsVerified)
            {
                throw new BaseException.BadRequestException("already_verified", "Tài khoản đã được xác thực");
            }

            if (verification.TokenExpiry < DateTime.UtcNow)
            {
                throw new BaseException.BadRequestException("token_expired", "Token xác thực đã hết hạn");
            }

            // Cập nhật trạng thái tài khoản
            var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(verification.TaiKhoanId);
            if (taiKhoan != null)
            {
                taiKhoan.TrangThai = "Hoạt động";
                await _unitOfWork.GetRepository<TaiKhoan>().UpdateAsync(taiKhoan);
                await _unitOfWork.SaveAsync();
            }

            return true;
        }

        public async Task<bool> IsVerifiedAsync(Guid taiKhoanId)
        {
            var verification = await GetVerificationByTaiKhoanIdAsync(taiKhoanId);
            return verification?.IsVerified ?? false;
        }

        public async Task<AccountVerificationDto> GetVerificationByTokenAsync(string token)
        {
            // Trong thực tế, bạn sẽ lấy từ cache hoặc database
            // Ở đây tôi sẽ trả về null để demo
            return null;
        }

        public async Task<AccountVerificationDto> GetVerificationByTaiKhoanIdAsync(Guid taiKhoanId)
        {
            // Trong thực tế, bạn sẽ lấy từ cache hoặc database
            // Ở đây tôi sẽ trả về null để demo
            return null;
        }

        private string GenerateVerificationToken()
        {
            byte[] randomBytes = new byte[32];
            RandomNumberGenerator.Fill(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
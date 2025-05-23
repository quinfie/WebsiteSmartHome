using System;

namespace WebsiteSmartHome.Core.DTOs
{
    public class AccountVerificationDto
    {
        public Guid Id { get; set; }
        public Guid TaiKhoanId { get; set; }
        public string VerificationToken { get; set; } = null!;
        public DateTime TokenExpiry { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? VerifiedAt { get; set; }
    }

    public class CreateVerificationDto
    {
        public Guid TaiKhoanId { get; set; }
        public string Email { get; set; } = null!;
    }

    public class VerifyAccountDto
    {
        public string Token { get; set; } = null!;
    }
}
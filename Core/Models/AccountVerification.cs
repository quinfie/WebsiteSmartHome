namespace WebsiteSmartHome.Core.Models
{
    public class AccountVerification
    {
        public Guid Id { get; set; }
        public Guid TaiKhoanId { get; set; }
        public string VerificationToken { get; set; } = null!;
        public DateTime TokenExpiry { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? VerifiedAt { get; set; }
    }
}
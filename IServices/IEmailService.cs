using System.Threading.Tasks;

namespace WebsiteSmartHome.IServices
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string email, string verificationToken);
        Task SendPasswordResetEmailAsync(string email, string resetToken);
        Task SendOrderConfirmationEmailAsync(string email, string orderId, decimal totalAmount);
    }
}
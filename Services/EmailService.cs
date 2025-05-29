using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Web;
using WebsiteSmartHome.IServices;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Net;
using System.Text;

namespace WebsiteSmartHome.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _frontendUrl;
        private readonly string _sendGridApiKey;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _frontendUrl = _configuration["AppSettings:WebLink"]?.TrimEnd('/') ?? "http://localhost:5133";
            _sendGridApiKey = _configuration["SendGrid:ApiKey"] ?? throw new ArgumentNullException("SendGrid:ApiKey is not configured");
            _fromEmail = _configuration["SendGrid:FromEmail"] ?? throw new ArgumentNullException("SendGrid:FromEmail is not configured");
            _fromName = _configuration["SendGrid:FromName"] ?? "WebsiteSmartHome";
        }

        public async Task SendVerificationEmailAsync(string email, string? verificationToken = null)
        {
            var token = verificationToken ?? GenerateVerificationToken(email);
            var verificationLink = $"{_frontendUrl}/verify-email?token={WebUtility.UrlEncode(token)}";

            var subject = "Xác thực tài khoản - Smart Home";
            var body = $@"
                <h2>Xác thực tài khoản của bạn</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại Smart Home.</p>
                <p>Vui lòng click vào liên kết dưới đây để xác thực tài khoản:</p>
                <p><a href='{verificationLink}'>Xác thực tài khoản</a></p>
                <p>Nếu bạn không yêu cầu xác thực tài khoản, vui lòng bỏ qua email này.</p>";

            await SendEmailAsync(email, subject, body);
        }

        private string GenerateVerificationToken(string email)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, "verification")
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task SendPasswordResetEmailAsync(string email, string newPassword)
        {
            var subject = "Mật khẩu mới - Smart Home";
            var body = $@"
<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;'>
    <div style='max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto;'>
        <h1 style='color: #2196F3;'>Mật khẩu mới của bạn</h1>
        <p style='font-size: 16px; color: #555;'>Chúng tôi đã tạo một mật khẩu mới cho tài khoản của bạn.</p>
        <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>
            <p style='margin: 5px 0;'><strong>Mật khẩu mới:</strong> {newPassword}</p>
        </div>
        <p style='font-size: 16px; color: #555;'>Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.</p>
        <hr style='border: none; height: 1px; background-color: #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #999;'>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
        <p style='font-size: 14px; color: #999;'>© 2024 Smart Home. All rights reserved.</p>
    </div>
</div>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendOrderConfirmationEmailAsync(string email, string orderId, decimal totalAmount)
        {
            string orderUrl = $"{_frontendUrl}/orders/{orderId}";

            string subject = "Order Confirmation - Smart Home";
            string body = $@"
<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;'>
    <div style='max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto;'>
        <h1 style='color: #2196F3;'>Order Confirmation</h1>
        <p style='font-size: 16px; color: #555;'>Thank you for your order! Your order has been received and is being processed.</p>
        <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>
            <p style='margin: 5px 0;'><strong>Order ID:</strong> {orderId}</p>
            <p style='margin: 5px 0;'><strong>Total Amount:</strong> {totalAmount:C}</p>
        </div>
        <a href='{orderUrl}' 
           style='display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #2196F3; 
                  text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px;'>
           View Order Details
        </a>
        <hr style='border: none; height: 1px; background-color: #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #999;'>© 2024 Smart Home. All rights reserved.</p>
    </div>
</div>";

            await SendEmailAsync(email, subject, body);
        }

        private async Task SendEmailAsync(string email, string subject, string body)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var from = new EmailAddress(_fromEmail, _fromName);
            var to = new EmailAddress(email);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, null, body);
            msg.HtmlContent = body;

            try
            {
                var response = await client.SendEmailAsync(msg);

                if (!response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Body.ReadAsStringAsync();
                    throw new Exception($"Failed to send email: {response.StatusCode} - {responseBody}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw;
            }
        }
    }
}
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Web;
using WebsiteSmartHome.IServices;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace WebsiteSmartHome.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task SendVerificationEmailAsync(string email, string verificationToken = null)
        {
            // Tạo token JWT chứa email
            var securityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, email) };
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddHours(24), signingCredentials: credentials);
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            string? webLink = _configuration["AppSettings:WebLink"]?.TrimEnd('/');
            if (string.IsNullOrWhiteSpace(webLink))
            {
                throw new InvalidOperationException("WebLink is not configured.");
            }

            string verificationUrl = $"{webLink}/api/auth/verify-email?token={jwtToken}";

            string subject = "Verify Your Email - Smart Home";
            string body = $@"
<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;'>
    <div style='max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto;'>
        <h1 style='color: #2196F3;'>Welcome to Smart Home!</h1>
        <p style='font-size: 16px; color: #555;'>Thank you for signing up! To start using our services, please verify your email by clicking the button below:</p>
        <a href='{verificationUrl}' 
           style='display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #2196F3; 
                  text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px;'>
           Verify Your Email
        </a>
        <p style='font-size: 14px; color: #777; margin-top: 20px;'>If the button does not work, copy and paste the following link into your browser:</p>
        <p style='word-break: break-all;'><a href='{verificationUrl}' style='color: #2196F3;'>{verificationUrl}</a></p>
        <hr style='border: none; height: 1px; background-color: #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #999;'>If you did not sign up for Smart Home, please ignore this email.</p>
        <p style='font-size: 14px; color: #999;'>© 2024 Smart Home. All rights reserved.</p>
    </div>
</div>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            string? webLink = _configuration["AppSettings:WebLink"]?.TrimEnd('/');
            if (string.IsNullOrWhiteSpace(webLink))
            {
                throw new InvalidOperationException("WebLink is not configured.");
            }

            string resetUrl = $"{webLink}/api/auth/reset-password?token={resetToken}";

            string subject = "Password Reset Request - Smart Home";
            string body = $@"
<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;'>
    <div style='max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto;'>
        <h1 style='color: #2196F3;'>Password Reset Request</h1>
        <p style='font-size: 16px; color: #555;'>You requested a password reset. Please click the button below to reset your password:</p>
        <a href='{resetUrl}' 
           style='display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #2196F3; 
                  text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px;'>
           Reset Password
        </a>
        <p style='font-size: 14px; color: #777; margin-top: 20px;'>If the button does not work, copy and paste the following link into your browser:</p>
        <p style='word-break: break-all;'><a href='{resetUrl}' style='color: #2196F3;'>{resetUrl}</a></p>
        <hr style='border: none; height: 1px; background-color: #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #999;'>If you did not request a password reset, please ignore this email.</p>
        <p style='font-size: 14px; color: #999;'>© 2024 Smart Home. All rights reserved.</p>
    </div>
</div>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendOrderConfirmationEmailAsync(string email, string orderId, decimal totalAmount)
        {
            string? webLink = _configuration["AppSettings:WebLink"]?.TrimEnd('/');
            if (string.IsNullOrWhiteSpace(webLink))
            {
                throw new InvalidOperationException("WebLink is not configured.");
            }

            string orderUrl = $"{webLink}/orders/{orderId}";

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
            var apiKey = _configuration["SendGrid:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new InvalidOperationException("SendGrid API key is not configured.");
            }

            var client = new SendGridClient(apiKey);

            var fromEmail = _configuration["SendGrid:FromEmail"]?.Trim();
            var fromName = _configuration["SendGrid:FromName"]?.Trim();

            if (string.IsNullOrWhiteSpace(fromEmail))
            {
                throw new InvalidOperationException("SendGrid FromEmail is not configured or is empty.");
            }
            if (!fromEmail.Equals("nlbthanh@gmail.com", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException($"SendGrid FromEmail ('{fromEmail}') does not match the verified sender email 'nlbthanh@gmail.com'.");
            }

            var from = new EmailAddress(fromEmail, fromName);
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
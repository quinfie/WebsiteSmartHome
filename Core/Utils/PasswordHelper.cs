using System.Security.Cryptography;
using System.Text;

namespace WebsiteSmartHome.Core.Utils
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentNullException(nameof(password), "Mật khẩu không được để trống");
            }

            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentNullException(nameof(password), "Mật khẩu không được để trống");
            }

            if (string.IsNullOrEmpty(hashedPassword))
            {
                throw new ArgumentNullException(nameof(hashedPassword), "Mật khẩu đã hash không được để trống");
            }

            var hashedInput = HashPassword(password);
            return hashedInput == hashedPassword;
        }
    }
} 
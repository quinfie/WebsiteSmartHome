using System.Text.RegularExpressions;

namespace WebsiteSmartHome.Core.Utils
{
    public class ValidationAccount
    {
        public static bool IsValidEmail(string email)
        {
            var regex = new Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
            return regex.IsMatch(email);
        }

        public static bool IsValidPassword(string password)
        {
            return password.Length >= 8;
        }

        public static bool IsValidTrangThai(string trangThai)
        {
            return Enum.IsDefined(typeof(AccountStatus), trangThai);
        }
    }
}

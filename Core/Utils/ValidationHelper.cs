using System.Text.RegularExpressions;
using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.Core.Utils
{
    public static class ValidationHelper
    {
        // Kiểm tra email hợp lệ
        public static void ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
            {
                throw new BaseException.ValidationException("invalid_email", "Email không hợp lệ");
            }
        }

        // Kiểm tra mật khẩu hợp lệ
        public static void ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || !IsValidPassword(password))
            {
                throw new BaseException.ValidationException("invalid_password", "Mật khẩu phải có ít nhất 8 ký tự");
            }
        }

        // Kiểm tra trạng thái tài khoản hợp lệ
        public static void ValidateTrangThai<TEnum>(string trangThai) where TEnum : Enum
        {
            var match = GetDesriptionHelper.GetEnumNameByDescription<AccountStatus>(trangThai);
            if (match == null)
            {
                throw new BaseException.ValidationException("invalid_status", $"Trạng thái '{trangThai}' không hợp lệ");
            }
        }

        // Kiểm tra vai trò hợp lệ
        public static void ValidateRole(string role)
        {
            var enumName = GetDesriptionHelper.GetEnumNameByDescription<RoleHelper>(role);
            if (enumName == null)
            {
                throw new BaseException.ValidationException("invalid_role", $"Vai trò '{role}' không hợp lệ");
            }
        }

        // Kiểm tra địa chỉ
        public static void ValidateDiaChi(string diaChi)
        {
            if (string.IsNullOrWhiteSpace(diaChi))
            {
                throw new BaseException.ValidationException("invalid_address", "Địa chỉ không được để trống");
            }
        }

        // Kiểm tra giới tính
        public static void ValidateGioiTinh(string? gioiTinh)
        {
            if (!string.IsNullOrWhiteSpace(gioiTinh))
            {
                var lower = gioiTinh.Trim().ToLower();
                if (lower != "nam" && lower != "nữ")
                {
                    throw new BaseException.BadRequestException("invalid_gender", "Giới tính chỉ được phép là 'Nam' hoặc 'Nữ'");
                }
            }
        }

        // Kiểm tra CCCD
        public static void ValidateCCCD(string? cccd)
        {
            if (!string.IsNullOrWhiteSpace(cccd))
            {
                if (cccd.Length != 10 || !cccd.All(char.IsDigit))
                {
                    throw new BaseException.ValidationException("invalid_cccd", "CCCD phải gồm đúng 10 chữ số");
                }
            }
        }

        // Kiểm tra số điện thoại hợp lệ
        public static void ValidateSDT(string? sdt)
        {
            if (!string.IsNullOrWhiteSpace(sdt))
            {
                if (sdt.Length != 10 || !sdt.StartsWith("0") || !sdt.All(char.IsDigit))
                {
                    throw new BaseException.BadRequestException("invalid_phone", "Số điện thoại phải bắt đầu bằng '0' và gồm đúng 10 chữ số");
                }
            }
        }

        // Kiểm tra ngày sinh hợp lệ
        public static void ValidateNgaySinh(DateTime? ngaySinh)
        {
            if (ngaySinh.HasValue && ngaySinh.Value > DateTime.Today)
            {
                throw new BaseException.ValidationException("invalid_dob", "Ngày sinh không được lớn hơn ngày hiện tại");
            }
        }

        // Các hàm kiểm tra riêng lẻ cho các loại khác
        private static bool IsValidEmail(string email)
        {
            var regex = new Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
            return regex.IsMatch(email);
        }

        private static bool IsValidPassword(string password)
        {
            return password.Length >= 8;
        }


    }
}

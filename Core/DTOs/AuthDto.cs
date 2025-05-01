using System.ComponentModel.DataAnnotations;
using WebsiteSmartHome.Core.Utils;

namespace WebsiteSmartHome.Core.DTOs
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "Email hoặc tên tài khoản không được để trống")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên tài khoản không được để trống")]
        [MinLength(3, ErrorMessage = "Tên tài khoản phải có ít nhất 3 ký tự")]
        public string TenTaiKhoan { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string MatKhau { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên người dùng không được để trống")]
        public string TenNguoiDung { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giới tính không được để trống")]
        public string GioiTinh { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ngày sinh không được để trống")]
        public DateTime NgaySinh { get; set; }

        [Required(ErrorMessage = "CCCD không được để trống")]
        [StringLength(12, MinimumLength = 12, ErrorMessage = "CCCD phải có 12 số")]
        public string Cccd { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Sdt { get; set; } = string.Empty;

        [Required(ErrorMessage = "Địa chỉ không được để trống")]
        public string DiaChi { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vai trò không được để trống")]
        public string VaiTro { get; set; } = string.Empty;

        [Required(ErrorMessage = "Trạng thái không được để trống")]
        public string TrangThai { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string TenNguoiDung { get; set; } = string.Empty;
        public string TenTaiKhoan { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string VaiTro { get; set; } = string.Empty;
    }
} 
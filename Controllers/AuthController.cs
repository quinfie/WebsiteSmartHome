using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using System.Security.Claims;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<AuthResponseDto>>> Login([FromBody] LoginRequestDto request)
        {
            if (request == null)
            {
                return BadRequest(new { error = "Request không hợp lệ" });
            }

            if (string.IsNullOrEmpty(request.Username))
            {
                return BadRequest(new { error = "Tên đăng nhập không được để trống" });
            }

            if (string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { error = "Mật khẩu không được để trống" });
            }

            var result = await _authService.LoginAsync(request);
            return BaseResponse<AuthResponseDto>.OkResponse(result, "Đăng nhập thành công");
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<AuthResponseDto>>> Register([FromBody] RegisterRequestDto request)
        {
            var result = await _authService.RegisterAsync(request);
            return BaseResponse<AuthResponseDto>.OkResponse(result, "Đăng ký thành công");
        }

        // GET: api/Auth/Profile
        [HttpGet("Profile")]
        [Authorize(Policy = "RequireAllRole")]
        public async Task<BaseResponse<TaiKhoanDto>> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var taiKhoan = await _authService.GetProfileAsync(userId!);
            return BaseResponse<TaiKhoanDto>.OkResponse(taiKhoan, "Lấy thông tin tài khoản thành công");
        }

        // PUT: api/Auth/TaiKhoan
        [HttpPut("TaiKhoan")]
        [Authorize(Policy = "RequireAllRole")]
        public async Task<BaseResponse<UpdateTaiKhoanDto>> UpdateTaiKhoan([FromBody] UpdateTaiKhoanDto taiKhoan)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _authService.UpdateTaiKhoanAsync(userId!, taiKhoan);
            return BaseResponse<UpdateTaiKhoanDto>.OkResponse(taiKhoan, "Cập nhật tài khoản thành công");
        }

        // PUT: api/Auth/NguoiDung
        [HttpPut("NguoiDung")]
        [Authorize(Policy = "RequireAllRole")]
        public async Task<BaseResponse<UpdateNguoiDungDto>> UpdateNguoiDung([FromBody] UpdateNguoiDungDto nguoiDung)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _authService.UpdateNguoiDungAsync(userId!, nguoiDung);
            return BaseResponse<UpdateNguoiDungDto>.OkResponse(nguoiDung, "Cập nhật thông tin người dùng thành công");
        }

        [HttpPut("ChangePassword")]
        [Authorize(Policy = "RequireAllRole")]
        public async Task<BaseResponse<bool>> ChangePassword([FromBody] ChangePasswordDto changePassword)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _authService.ChangePasswordAsync(userId!, changePassword);
            return BaseResponse<bool>.OkResponse(true, "Đổi mật khẩu thành công");
        }

        [HttpPost("ForgotPassword")]
        [AllowAnonymous]
        public async Task<BaseResponse<bool>> ForgotPassword([FromBody] ForgotPasswordDto forgotPassword)
        {
            await _authService.ForgotPasswordAsync(forgotPassword);
            return BaseResponse<bool>.OkResponse(true, "Mật khẩu mới đã được gửi đến email của bạn");
        }

        [HttpGet("verify-email")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            var result = await _authService.VerifyEmailAsync(token);
            if (result)
            {
                return Content("Xác thực email thành công! Bạn có thể đăng nhập.");
            }
            else
            {
                return Content("Xác thực email thất bại hoặc token không hợp lệ.");
            }
        }
    }
}
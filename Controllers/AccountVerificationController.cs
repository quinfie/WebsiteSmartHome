using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountVerificationController : ControllerBase
    {
        private readonly IAccountVerificationService _verificationService;

        public AccountVerificationController(IAccountVerificationService verificationService)
        {
            _verificationService = verificationService;
        }

        [HttpPost("create")]
        public async Task<ActionResult<BaseResponse<AccountVerificationDto>>> CreateVerification([FromBody] CreateVerificationDto dto)
        {
            var result = await _verificationService.CreateVerificationAsync(dto);
            return BaseResponse<AccountVerificationDto>.OkResponse(result, "Đã gửi email xác thực");
        }

        [HttpPost("verify")]
        public async Task<ActionResult<BaseResponse<bool>>> VerifyAccount([FromBody] VerifyAccountDto dto)
        {
            var result = await _verificationService.VerifyAccountAsync(dto);
            return BaseResponse<bool>.OkResponse(result, "Xác thực tài khoản thành công");
        }

        [HttpGet("status/{taiKhoanId}")]
        public async Task<ActionResult<BaseResponse<bool>>> GetVerificationStatus(Guid taiKhoanId)
        {
            var result = await _verificationService.IsVerifiedAsync(taiKhoanId);
            return BaseResponse<bool>.OkResponse(result, "Lấy trạng thái xác thực thành công");
        }
    }
}
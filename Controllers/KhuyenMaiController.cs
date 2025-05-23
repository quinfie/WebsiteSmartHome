using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Quản lý các thao tác với khuyến mãi.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class KhuyenMaiController : ControllerBase
    {
        private readonly IKhuyenMaiService _khuyenMaiService;

        public KhuyenMaiController(IKhuyenMaiService khuyenMaiService)
        {
            _khuyenMaiService = khuyenMaiService ?? throw new ArgumentNullException(nameof(khuyenMaiService));
        }

        /// <summary>
        /// Lấy danh sách khuyến mãi hợp lệ cho giỏ hàng.
        /// </summary>
        [HttpGet("valid")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<List<KhuyenMaiDto>>>> GetValidPromotions([FromQuery] decimal cartTotal)
        {
            var result = await _khuyenMaiService.GetValidPromotions(cartTotal);
            return BaseResponse<List<KhuyenMaiDto>>.OkResponse(result, "Lấy danh sách khuyến mãi thành công");
        }

        /// <summary>
        /// Lấy thông tin khuyến mãi theo ID.
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<KhuyenMaiDto>>> GetById(string id)
        {
            if (!Guid.TryParse(id, out var guidId))
            {
                return BaseResponse<KhuyenMaiDto>.BadRequestResponse("invalid_id", "ID khuyến mãi không hợp lệ");
            }

            var result = await _khuyenMaiService.GetById(guidId);
            return BaseResponse<KhuyenMaiDto>.OkResponse(result, "Lấy thông tin khuyến mãi thành công");
        }

        /// <summary>
        /// Thêm khuyến mãi mới.
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<KhuyenMaiDto>>> Create(KhuyenMaiCreateDto request)
        {
            var result = await _khuyenMaiService.Create(request);
            return BaseResponse<KhuyenMaiDto>.OkResponse(result, "Tạo khuyến mãi thành công");
        }

        /// <summary>
        /// Cập nhật khuyến mãi.
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<KhuyenMaiDto>>> Update(string id, KhuyenMaiUpdateDto request)
        {
            if (!Guid.TryParse(id, out var guidId))
            {
                return BaseResponse<KhuyenMaiDto>.BadRequestResponse("invalid_id", "ID khuyến mãi không hợp lệ");
            }

            var result = await _khuyenMaiService.Update(guidId, request);
            return BaseResponse<KhuyenMaiDto>.OkResponse(result, "Cập nhật khuyến mãi thành công");
        }

        /// <summary>
        /// Xóa khuyến mãi.
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _khuyenMaiService.Delete(Guid.Parse(id));
            return BaseResponse<bool>.OkResponse(result, "Xóa khuyến mãi thành công");
        }

        /// <summary>
        /// Áp dụng khuyến mãi vào giỏ hàng.
        /// </summary>
        [HttpPost("apply")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<KhuyenMaiApplyDto>>> ApplyPromotion([FromBody] ApplyPromotionRequest request)
        {
            var result = await _khuyenMaiService.ApplyPromotion(request.CartTotal, Guid.Parse(request.PromotionId));
            return BaseResponse<KhuyenMaiApplyDto>.OkResponse(result, "Áp dụng khuyến mãi thành công");
        }

        /// <summary>
        /// Lấy tất cả khuyến mãi.
        /// </summary>
        [HttpGet("all")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<List<KhuyenMaiDto>>>> GetAll()
        {
            var result = await _khuyenMaiService.GetAll();
            return BaseResponse<List<KhuyenMaiDto>>.OkResponse(result, "Lấy danh sách khuyến mãi thành công");
        }
    }

    public class ApplyPromotionRequest
    {
        public string PromotionId { get; set; } = null!;
        public decimal CartTotal { get; set; }
    }
}
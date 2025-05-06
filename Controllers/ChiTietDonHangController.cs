using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChiTietDonHangController : ControllerBase
    {
        private readonly IChiTietDonHangService _chiTietDonHangService;

        public ChiTietDonHangController(IChiTietDonHangService chiTietDonHangService)
        {
            _chiTietDonHangService = chiTietDonHangService ?? throw new ArgumentNullException(nameof(chiTietDonHangService));
        }

        // Lấy toàn bộ danh sách chi tiết đơn hàng
        [HttpGet]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<List<ChiTietDonHangDto>>>> GetAll()
        {
            var result = await _chiTietDonHangService.GetAllChiTietDonHangAsync();
            return BaseResponse<List<ChiTietDonHangDto>>.OkResponse(result, "Lấy danh sách chi tiết đơn hàng thành công");
        }

        // Tìm kiếm chi tiết đơn hàng theo tên sản phẩm
        [HttpGet("search")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<List<ChiTietDonHangDto>>>> Search([FromQuery] string name)
        {
            var result = await _chiTietDonHangService.SearchChiTietDonHangByNameAsync(name);
            return BaseResponse<List<ChiTietDonHangDto>>.OkResponse(result, "Tìm kiếm chi tiết đơn hàng thành công");
        }

        // Lấy chi tiết đơn hàng theo ID đơn hàng
        [HttpGet("don-hang/{donHangId}")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<ActionResult<BaseResponse<List<ChiTietDonHangDto>>>> GetByDonHangId(string donHangId)
        {
            var result = await _chiTietDonHangService.GetChiTietDonHangByDonHangIdAsync(donHangId);
            return BaseResponse<List<ChiTietDonHangDto>>.OkResponse(result, "Lấy chi tiết đơn hàng theo mã đơn hàng thành công");
        }

        // Cập nhật chi tiết đơn hàng
        [HttpPut("{id}")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<ChiTietDonHangDto>>> Update(string id, [FromBody] UpdateChiTietDonHangDto dto)
        {
            var result = await _chiTietDonHangService.UpdateChiTietDonHangAsync(id, dto);
            return BaseResponse<ChiTietDonHangDto>.OkResponse(result, "Cập nhật chi tiết đơn hàng thành công");
        }

        // Xóa chi tiết đơn hàng
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _chiTietDonHangService.DeleteChiTietDonHangAsync(id);
            return BaseResponse<bool>.OkResponse(result, "Xóa chi tiết đơn hàng thành công");
        }
    }
}

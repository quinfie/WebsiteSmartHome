using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Services;
using WebsiteSmartHome.IServices;
using System.Security.Claims;

namespace WebsiteSmartHome.Controllers
{
    // Định tuyến mặc định cho controller này: api/don_hang
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DonHangController : ControllerBase
    {
        // Service xử lý logic cho đơn hàng
        private readonly IDonHangService _donHangService;

        // Inject service qua constructor
        public DonHangController(IDonHangService donHangService)
        {
            _donHangService = donHangService ?? throw new ArgumentNullException(nameof(donHangService));
        }

        // GET: api/DonHang
        [HttpGet]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<List<DonHangDto>>>> GetAll()
        {
            var result = await _donHangService.GetDanhSachDonHangAsync();
            return BaseResponse<List<DonHangDto>>.OkResponse(result, "Lấy danh sách đơn hàng thành công");
        }

        // GET: api/DonHang/{id}
        [HttpGet("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<ViewResponseCreateDonHangDto>>> GetById(string id)
        {
            var result = await _donHangService.GetChiTietDonHangAsync(id);
            return BaseResponse<ViewResponseCreateDonHangDto>.OkResponse(result, "Lấy chi tiết đơn hàng thành công");
        }

        // POST: api/DonHang
        [HttpPost]
        [Authorize(Policy = "RequireAllRole")]
        public async Task<ActionResult<BaseResponse<ResponseCreateDonHangDto>>> ThemDonHang(RequestCreateDonHangDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _donHangService.ThemDonHangAsync(dto, userId);
            return BaseResponse<ResponseCreateDonHangDto>.OkResponse(result, "Thêm đơn hàng thành công");
        }

        // PUT: api/DonHang/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<ResponseCreateDonHangDto>>> UpdateDonHang(string id, RequestUpdateDonHangDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _donHangService.UpdateDonHangAsync(id, dto, userId);
            return BaseResponse<ResponseCreateDonHangDto>.OkResponse(result, "Cập nhật đơn hàng thành công");
        }

        // DELETE: api/DonHang/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<bool>>> DeleteDonHang(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _donHangService.DeleteDonHangAsync(id, userId);
            return BaseResponse<bool>.OkResponse(result, "Xóa đơn hàng thành công");
        }

        /// <summary>
        /// Lấy danh sách đơn hàng và chi tiết của người dùng hiện tại
        /// </summary>
        [HttpGet("current-user")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<ActionResult<BaseResponse<List<ViewResponseCreateDonHangDto>>>> GetDonHangByCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _donHangService.GetDonHangByCurrentUserAsync(userId);
            return BaseResponse<List<ViewResponseCreateDonHangDto>>.OkResponse(result, "Lấy danh sách đơn hàng thành công");
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaiKhoanController : ControllerBase
    {
        private readonly ITaiKhoanService _taiKhoanService;

        public TaiKhoanController(ITaiKhoanService taiKhoanService)
        {
            _taiKhoanService = taiKhoanService ?? throw new ArgumentNullException(nameof(taiKhoanService));
        }

        [HttpGet]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<IEnumerable<TaiKhoanDto>>>> GetAll()
        {
            var result = await _taiKhoanService.GetTaiKhoanAsync();
            return BaseResponse<IEnumerable<TaiKhoanDto>>.OkResponse(result, "Lấy danh sách tài khoản thành công");
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<ActionResult<BaseResponse<TaiKhoanDto>>> GetById(string id)
        {
            var result = await _taiKhoanService.GetTaiKhoanByIdAsync(id);
            return BaseResponse<TaiKhoanDto>.OkResponse(result, "Lấy thông tin tài khoản thành công");
        }

        [HttpPost]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<TaiKhoanDto>>> Create(TaiKhoanCreateDto request)
        {
            var result = await _taiKhoanService.AddTaiKhoanAsync(request);
            return BaseResponse<TaiKhoanDto>.OkResponse(result, "Tạo tài khoản thành công");
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<string>>> Update(string id, TaiKhoanUpdateDto request)
        {
            await _taiKhoanService.UpdateTaiKhoanAsync(id, request);
            return BaseResponse<string>.OkResponse("Cập nhật tài khoản thành công");
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<string>>> Delete(string id)
        {
            await _taiKhoanService.DeleteTaiKhoanAsync(id);
            return BaseResponse<string>.OkResponse("Xóa tài khoản thành công");
        }

        [HttpGet("search")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<IEnumerable<TaiKhoanDto>>>> Search([FromQuery] string? keyword, [FromQuery] string? trangThai)
        {
            var result = await _taiKhoanService.SearchTaiKhoan(keyword, trangThai);
            return BaseResponse<IEnumerable<TaiKhoanDto>>.OkResponse(result, "Tìm kiếm tài khoản thành công");
        }
    }
}
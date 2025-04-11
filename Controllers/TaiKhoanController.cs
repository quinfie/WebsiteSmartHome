using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/tai_khoan")]
    public class TaiKhoanController : ControllerBase
    {
        private readonly ITaiKhoanService _taiKhoanService;

        public TaiKhoanController(ITaiKhoanService taiKhoanService)
        {
            _taiKhoanService = taiKhoanService ?? throw new ArgumentNullException(nameof(taiKhoanService));
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetTaiKhoans()
        {
            IEnumerable<TaiKhoanDto> result = await _taiKhoanService.GetTaiKhoanAsync();
            return Ok(BaseResponse<IEnumerable<object>>.OkResponse(result, "Lấy danh sách tài khoản thành công"));

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaiKhoanById(string id)
        {
            TaiKhoanDto? result = await _taiKhoanService.GetTaiKhoanByIdAsync(id);
            return Ok(BaseResponse<TaiKhoanDto>.OkResponse(result, "Lấy thông tin tài khoản thành công"));
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddTaiKhoan([FromBody] TaiKhoanCreateDto taiKhoanDto)
        {

            await _taiKhoanService.AddTaiKhoanAsync(taiKhoanDto);
            return Ok(BaseResponse<string>.OkResponse("Tài khoản đã được thêm thành công"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaiKhoan(string id, [FromBody] TaiKhoanUpdateDto taiKhoanDto)
        {

            await _taiKhoanService.UpdateTaiKhoanAsync(id, taiKhoanDto);
            return Ok(BaseResponse<string>.OkResponse("Tài khoản đã được cập nhật thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaiKhoan(string id)
        {
            await _taiKhoanService.DeleteTaiKhoanAsync(id);
            return Ok(BaseResponse<string>.OkResponse("Tài khoản đã xóa thành công"));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchTaiKhoan([FromQuery] string keyword, [FromQuery] string trangThai)
        {
            var result = await _taiKhoanService.SearchTaiKhoan(keyword, trangThai);
            return Ok(BaseResponse<IEnumerable<TaiKhoan>>.OkResponse(result, "Tìm kiếm tài khoản thành công"));
        }

    }
}
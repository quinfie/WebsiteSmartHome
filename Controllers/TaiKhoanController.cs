using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Services;

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

        [HttpGet]
        public async Task<IActionResult> GetTaiKhoans()
        {
            IEnumerable<TaiKhoanDto> result = await _taiKhoanService.GetTaiKhoanAsync();
            return Ok(BaseResponse<IEnumerable<TaiKhoanDto>>.OkResponse(result, "Lấy danh sách tài khoản thành công"));

        }

        // GET: api/TaiKhoan/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaiKhoanById(string id)
        {
            TaiKhoanDto? result = await _taiKhoanService.GetTaiKhoanByIdAsync(id);
            return Ok(BaseResponse<TaiKhoanDto>.OkResponse(result, "Lấy vai trò thành công"));
        }

        // POST: api/TaiKhoan
        [HttpPost("add")]
        public async Task<IActionResult> AddTaiKhoan([FromBody] TaiKhoanDto taiKhoanDto)
        {

            await _taiKhoanService.AddTaiKhoanAsync(taiKhoanDto);
            return Ok(BaseResponse<string>.OkResponse("Vai trò đã được thêm thành công"));
        }

        //// PUT: api/TaiKhoan/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateTaiKhoan(Guid id, [FromBody] TaiKhoanDto taiKhoanDto)
        //{
        //    try
        //    {
        //        var result = await _taiKhoanService.UpdateTaiKhoanAsync(id, taiKhoanDto);
        //        if (!result)
        //        {
        //            return NotFound(new { message = "Tài khoản không tồn tại" });
        //        }
        //        return Ok(new { message = "Cập nhật tài khoản thành công" });
        //    }
        //    catch (BaseException.BadRequestException ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        //// DELETE: api/TaiKhoan/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteTaiKhoan(Guid id)
        //{
        //    try
        //    {
        //        var result = await _taiKhoanService.DeleteTaiKhoanAsync(id);
        //        if (!result)
        //        {
        //            return NotFound(new { message = "Tài khoản không tồn tại" });
        //        }
        //        return Ok(new { message = "Tài khoản đã bị xóa" });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        // SEARCH: api/TaiKhoan/search?keyword=value

        [HttpGet("search")]
        public async Task<IActionResult> SearchTaiKhoan([FromQuery] string keyword, [FromQuery] string trangThai)
        {
            var result = await _taiKhoanService.SearchTaiKhoan(keyword, trangThai);
            return Ok(BaseResponse<IEnumerable<TaiKhoan>>.OkResponse(result, "Tìm kiếm tài khoản thành công"));
        }

    }
}
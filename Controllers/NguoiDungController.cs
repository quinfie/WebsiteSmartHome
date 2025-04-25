using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/nguoi_dung")]
    public class NguoiDungController : ControllerBase
    {
        private readonly INguoiDungService _nguoiDungService;

        public NguoiDungController(INguoiDungService nguoiDungService)
        {
            _nguoiDungService = nguoiDungService ?? throw new ArgumentNullException(nameof(nguoiDungService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNguoiDung()
        {
            var result = await _nguoiDungService.GetAllNguoiDungAsync();
            return Ok(BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Lấy danh sách người dùng thành công"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNguoiDungById(string id)
        {
            var result = await _nguoiDungService.GetNguoiDungByIdAsync(id);
            return Ok(BaseResponse<NguoiDungDto>.OkResponse(result, "Lấy thông tin người dùng thành công"));
        }

        [HttpPost]
        public async Task<IActionResult> AddNguoiDung([FromBody] NguoiDungCreateDto nguoiDung)
        {
            var result = await _nguoiDungService.AddNguoiDungAsync(nguoiDung);
            return Ok(BaseResponse<NguoiDungCreateDto>.OkResponse(result, "Thêm người dùng thành công"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNguoiDung(string id, [FromBody] NguoiDungUpdateDto dto)
        {

            await _nguoiDungService.UpdateNguoiDungAsync(id, dto);
            return Ok(BaseResponse<string>.OkResponse("Tài khoản đã được cập nhật thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaiKhoan(string id)
        {
            await _nguoiDungService.DeleteNguoiDungAsync(id);
            return Ok(BaseResponse<string>.OkResponse("Người dùng đã xóa thành công"));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchNguoiDung([FromQuery] string keyword)
        {
            var result = await _nguoiDungService.SearchNguoiDungAsync(keyword);
            return Ok(BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Tìm kiếm người dùng thành công"));
        }
    }
}

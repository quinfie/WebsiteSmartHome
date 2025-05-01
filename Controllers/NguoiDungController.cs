using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NguoiDungController : ControllerBase
    {
        private readonly INguoiDungService _nguoiDungService;

        public NguoiDungController(INguoiDungService nguoiDungService)
        {
            _nguoiDungService = nguoiDungService ?? throw new ArgumentNullException(nameof(nguoiDungService));
        }

        [HttpGet]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<IEnumerable<NguoiDungDto>>>> GetAll()
        {
            var result = await _nguoiDungService.GetAllNguoiDungAsync();
            return BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Lấy danh sách người dùng thành công");
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<ActionResult<BaseResponse<NguoiDungDto>>> GetById(string id)
        {
            var result = await _nguoiDungService.GetNguoiDungByIdAsync(id);
            return BaseResponse<NguoiDungDto>.OkResponse(result, "Lấy thông tin người dùng thành công");
        }

        [HttpPost]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<NguoiDungDto>>> Create(NguoiDungCreateDto request)
        {
            var result = await _nguoiDungService.AddNguoiDungAsync(request);
            return BaseResponse<NguoiDungDto>.OkResponse(result, "Tạo người dùng thành công");
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<string>>> Update(string id, NguoiDungUpdateDto request)
        {
            await _nguoiDungService.UpdateNguoiDungAsync(id, request);
            return BaseResponse<string>.OkResponse("Cập nhật người dùng thành công");
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<string>>> Delete(string id)
        {
            await _nguoiDungService.DeleteNguoiDungAsync(id);
            return BaseResponse<string>.OkResponse("Xóa người dùng thành công");    
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchNguoiDung([FromQuery] string keyword)
        {
            var result = await _nguoiDungService.SearchNguoiDungAsync(keyword);
            return Ok(BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Tìm kiếm người dùng thành công"));
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
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
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<IEnumerable<NguoiDungDto>>>> GetAll()
        {
            var result = await _nguoiDungService.GetAllNguoiDungAsync();
            return BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Lấy danh sách người dùng thành công");
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireAllRole")]
        public async Task<ActionResult<BaseResponse<NguoiDungDto>>> GetById(string id)
        {
            var result = await _nguoiDungService.GetNguoiDungByIdAsync(id);
            return BaseResponse<NguoiDungDto>.OkResponse(result, "Lấy thông tin người dùng thành công");
        }

        [HttpPost]
        [Authorize(Policy = "RequireAllRole")]
        public async Task<ActionResult<BaseResponse<NguoiDungDto>>> Create(NguoiDungCreateDto request)
        {
            var result = await _nguoiDungService.AddNguoiDungAsync(request);
            return BaseResponse<NguoiDungDto>.OkResponse(result, "Tạo người dùng thành công");
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "RequireAllRole")]
        public async Task<ActionResult<BaseResponse<string>>> Update(string id, NguoiDungUpdateDto request)
        {
            await _nguoiDungService.UpdateNguoiDungAsync(id, request);
            return BaseResponse<string>.OkResponse("Cập nhật người dùng thành công");
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<string>>> Delete(string id)
        {
            await _nguoiDungService.DeleteNguoiDungAsync(id);
            return BaseResponse<string>.OkResponse("Xóa người dùng thành công");
        }

        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<IEnumerable<NguoiDungDto>>>> Search([FromQuery] string? keyword)
        {
            var result = await _nguoiDungService.SearchNguoiDungAsync(keyword ?? string.Empty);
            return BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Tìm kiếm người dùng thành công");
        }

        [HttpGet("ky-thuat-vien")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<IEnumerable<NguoiDungDto>>>> GetKyThuatVien()
        {
            var result = await _nguoiDungService.GetKyThuatVienAsync();
            return Ok(BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Lấy danh sách kỹ thuật viên thành công"));
        }

        [HttpGet("by-role/{roleName}")]
        public async Task<ActionResult<BaseResponse<IEnumerable<NguoiDungDto>>>> GetUsersByRole(string roleName, [FromQuery] bool isVip = false)
        {
            var result = await _nguoiDungService.GetUsersByRoleAsync(roleName, isVip);
            return BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Lấy danh sách người dùng theo vai trò thành công");
        }
    }
}

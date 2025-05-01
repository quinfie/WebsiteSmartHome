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
    public class NhaCungCapController : ControllerBase
    {
        private readonly INhaCungCapService _nhaCungCapService;

        public NhaCungCapController(INhaCungCapService nhaCungCapService)
        {
            _nhaCungCapService = nhaCungCapService ?? throw new ArgumentNullException(nameof(nhaCungCapService));
        }

        [HttpGet]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<List<NhaCungCapDto>>>> GetAll()
        {
            var result = await _nhaCungCapService.GetAllNhaCungCapAsync();
            return BaseResponse<List<NhaCungCapDto>>.OkResponse(result, "Lấy danh sách nhà cung cấp thành công");
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<NhaCungCapDto>>> GetById(string id)
        {
            var result = await _nhaCungCapService.GetNhaCungCapByIdAsync(id);
            return BaseResponse<NhaCungCapDto>.OkResponse(result, "Lấy thông tin nhà cung cấp thành công");
        }

        [HttpPost]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<NhaCungCapCreateDto>>> Create(NhaCungCapCreateDto request)
        {
            var result = await _nhaCungCapService.CreateNhaCungCapAsync(request);
            return BaseResponse<NhaCungCapCreateDto>.OkResponse(result, "Tạo nhà cung cấp thành công");
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<NhaCungCapCreateDto>>> Update(string id, NhaCungCapCreateDto request)
        {
            var result = await _nhaCungCapService.UpdateNhaCungCapAsync(id, request);
            return BaseResponse<NhaCungCapCreateDto>.OkResponse(result, "Cập nhật nhà cung cấp thành công");
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<string>>> Delete(string id)
        {
            await _nhaCungCapService.DeleteNhaCungCapAsync(id);
            return BaseResponse<string>.OkResponse("Xóa nhà cung cấp thành công");
        }

        [HttpGet("search")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<List<NhaCungCapDto>>>> Search([FromQuery] string keyword)
        {
            var result = await _nhaCungCapService.SearchNhaCungCapAsync(keyword);
            return BaseResponse<List<NhaCungCapDto>>.OkResponse(result, "Tìm kiếm nhà cung cấp thành công");
        }
    }
}

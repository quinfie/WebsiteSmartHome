using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VaiTroController : ControllerBase
    {
        private readonly IVaiTroService _vaiTroService;

        public VaiTroController(IVaiTroService vaiTroService)
        {
            _vaiTroService = vaiTroService ?? throw new ArgumentNullException(nameof(vaiTroService));
        }

        [HttpGet]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<IEnumerable<VaiTroDto>>>> GetAll()
        {
            var result = await _vaiTroService.GetVaiTroAsync();
            return BaseResponse<IEnumerable<VaiTroDto>>.OkResponse(result, "Lấy danh sách vai trò thành công");
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<VaiTroDto>>> GetById(string id)
        {
            var result = await _vaiTroService.GetVaiTroByIdAsync(id);
            return BaseResponse<VaiTroDto>.OkResponse(result, "Lấy thông tin vai trò thành công");
        }

        [HttpPost]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<VaiTroDto>>> Create([FromBody] string tenVaiTro)
        {
            var result = await _vaiTroService.AddVaiTroAsync(tenVaiTro);
            return BaseResponse<VaiTroDto>.OkResponse(result, "Tạo vai trò thành công");
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Update(string id, [FromBody] string tenVaiTro)
        {
            var result = await _vaiTroService.UpdateVaiTroAsync(id, tenVaiTro);
            return BaseResponse<bool>.OkResponse(result, "Cập nhật vai trò thành công");
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _vaiTroService.DeleteVaiTroAsync(id);
            return BaseResponse<bool>.OkResponse(result, "Xóa vai trò thành công");
        }

        [HttpGet("search")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<IEnumerable<VaiTro>>>> Search([FromQuery] string? keyword)
        {
            var result = await _vaiTroService.SearchVaiTro(keyword);
            return BaseResponse<IEnumerable<VaiTro>>.OkResponse(result, "Tìm kiếm vai trò thành công");
        }
    }
}


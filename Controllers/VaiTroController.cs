using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/vai_tro")]
    public class VaiTroController : ControllerBase
    {
        private readonly IVaiTroService _vaiTroService;

        public VaiTroController(IVaiTroService vaiTroService)
        {
            _vaiTroService = vaiTroService ?? throw new ArgumentNullException(nameof(vaiTroService));
        }

        [HttpGet]
        public async Task<IActionResult> GetVaiTro()
        {
            IEnumerable<VaiTroDto> result = await _vaiTroService.GetVaiTroAsync();
            return Ok(BaseResponse<IEnumerable<VaiTroDto>>.OkResponse(result, "Lấy danh sách vai trò thành công"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVaiTroById(string id)
        {
            var result = await _vaiTroService.GetVaiTroByIdAsync(id);
            return Ok(BaseResponse<VaiTroDto>.OkResponse(result, "Lấy vai trò thành công"));
        }

        [HttpPost]
        public async Task<IActionResult> AddVaiTro([FromBody] string tenVaiTro)
        {
            await _vaiTroService.AddVaiTroAsync(tenVaiTro);
            return Ok(BaseResponse<string>.OkResponse("Vai trò đã được thêm thành công"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVaiTro(string id, [FromBody] string tenVaiTro)
        {
            await _vaiTroService.UpdateVaiTroAsync(id, tenVaiTro);
            return Ok(BaseResponse<string>.OkResponse("Cập nhật vai trò thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVaiTro(string id)
        {
            await _vaiTroService.DeleteVaiTroAsync(id);
            return Ok(BaseResponse<string>.OkResponse("Xóa vai trò thành công"));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchVaiTro([FromQuery] string keyword)
        {
            var result = await _vaiTroService.SearchVaiTro(keyword);
            return Ok(BaseResponse<IEnumerable<VaiTro>>.OkResponse(result, "Tìm kiếm vai trò thành công"));
        }
    }

}


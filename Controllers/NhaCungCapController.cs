using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/nha_cung_cap")]
    public class NhaCungCapController : ControllerBase
    {
        private readonly INhaCungCapService _nhaCungCapService;

        public NhaCungCapController(INhaCungCapService nhaCungCapService)
        {
            _nhaCungCapService = nhaCungCapService ?? throw new ArgumentNullException(nameof(_nhaCungCapService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _nhaCungCapService.GetAllNhaCungCapAsync();
            return Ok(BaseResponse<IEnumerable<NhaCungCapDto>>.OkResponse(result, "Lấy thông tin các nhà cung cấp thành công"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var result = await _nhaCungCapService.GetNhaCungCapByIdAsync(id);
            return Ok(BaseResponse<NhaCungCapDto>.OkResponse(result, "Lấy thông tin nhà cung cấp thành công"));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NhaCungCapCreateDto dto)
        {
            var result = await _nhaCungCapService.CreateNhaCungCapAsync(dto);
            return Ok(BaseResponse<NhaCungCapCreateDto>.OkResponse(result, "Thêm nhà cung cấp thành công"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] NhaCungCapCreateDto dto)
        {
            var result = await _nhaCungCapService.UpdateNhaCungCapAsync(id, dto);
            return Ok(BaseResponse<NhaCungCapCreateDto>.OkResponse(result, "Cập nhật thông tin nhà cung cấp thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _nhaCungCapService.DeleteNhaCungCapAsync(id);
            return Ok(BaseResponse<string>.OkResponse("Xóa nhà cung cấp thành công"));
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var result = await _nhaCungCapService.SearchNhaCungCapAsync(keyword);
            return Ok(BaseResponse<BaseResponse<NhaCungCapDto>>.OkResponse("Tìm kiếm nhà cung cấp thành công"));
        }
    }
}

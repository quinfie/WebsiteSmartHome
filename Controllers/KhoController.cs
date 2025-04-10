using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/kho")]
    public class KhoController : ControllerBase
    {
        private readonly IKhoService _khoService;

        public KhoController(IKhoService khoService)
        {
            _khoService = khoService ?? throw new ArgumentNullException(nameof(khoService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllKho()
        {
            var result = await _khoService.GetAllKhoAsync();
            return Ok(BaseResponse<IEnumerable<KhoDto>>.OkResponse(result, "Lấy danh sách kho thành công"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetKhoById(string id)
        {
            var result = await _khoService.GetKhoByIdAsync(id);
            return Ok(BaseResponse<KhoDto>.OkResponse(result, "Lấy thông tin kho thành công"));
        }

        [HttpPost]
        public async Task<IActionResult> CreateKho([FromBody] KhoCreateDto dto)
        {
            var result = await _khoService.CreateKhoAsync(dto);
            return Ok(BaseResponse<KhoCreateDto>.OkResponse(result, "Tạo kho thành công"));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateKho([FromBody] KhoDto dto)
        {
            var result = await _khoService.UpdateKhoAsync(dto);
            return Ok(BaseResponse<KhoDto>.OkResponse(result, "Cập nhật kho thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKho(string id)
        {
            await _khoService.DeleteKhoAsync(id);
            return Ok(BaseResponse<string>.OkResponse(id, "Xóa kho thành công"));
        }
    }
}

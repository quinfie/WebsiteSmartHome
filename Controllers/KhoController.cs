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
    public class KhoController : ControllerBase
    {
        private readonly IKhoService _khoService;

        public KhoController(IKhoService khoService)
        {
            _khoService = khoService ?? throw new ArgumentNullException(nameof(khoService));
        }

        [HttpGet]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<List<KhoDto>>>> GetAll()
        {
            var result = await _khoService.GetAllKhoAsync();
            return BaseResponse<List<KhoDto>>.OkResponse(result, "Lấy danh sách kho thành công");
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<KhoDto>>> GetById(string id)
        {
            var result = await _khoService.GetKhoByIdAsync(id);
            return BaseResponse<KhoDto>.OkResponse(result, "Lấy thông tin kho thành công");
        }

        [HttpPost]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<KhoCreateDto>>> Create(KhoCreateDto request)
        {
            var result = await _khoService.CreateKhoAsync(request);
            return BaseResponse<KhoCreateDto>.OkResponse(result, "Tạo kho thành công");
        }

        // [HttpPut("{id}")]
        // [Authorize(Policy = "RequireAdminRole")]
        // public async Task<ActionResult<BaseResponse<KhoCreateDto>>> Update(string id, KhoCreateDto request)
        // {
        //     var result = await _khoService.UpdateKhoAsync(id, request);
        //     return BaseResponse<KhoCreateDto>.OkResponse(result, "Cập nhật kho thành công");
        // }

        // [HttpDelete("{id}")]
        // [Authorize(Policy = "RequireAdminRole")]
        // public async Task<ActionResult<BaseResponse<string>>> Delete(string id)
        // {
        //     await _khoService.DeleteKhoAsync(id);
        //     return BaseResponse<string>.OkResponse("Xóa kho thành công");
        // }

        // [HttpGet("search")]
        // [Authorize(Policy = "RequireStaffRole")]
        // public async Task<ActionResult<BaseResponse<List<KhoDto>>>> Search([FromQuery] string keyword)
        // {
        //     var result = await _khoService.SearchKhoAsync(keyword);
        //     return BaseResponse<List<KhoDto>>.OkResponse(result, "Tìm kiếm kho thành công");
        // }
    }
}

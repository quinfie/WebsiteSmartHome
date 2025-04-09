using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/nguoi_dung")]
    public class NguoiDungController : Controller
    {
        private readonly INguoiDungService _nguoiDungService;

        public NguoiDungController(INguoiDungService nguoiDungService)
        {
            _nguoiDungService = nguoiDungService?? throw new ArgumentNullException(nameof(nguoiDungService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNguoiDung()
        {
            IEnumerable<NguoiDungDto> result = await _nguoiDungService.GetAllNguoiDungAsync();
            return Ok(BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Lấy danh sách người dùng thành công"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNguoiDungById(string id)
        {
            NguoiDungDto? result = await _nguoiDungService.GetNguoiDungByIdAsync(id);
            return Ok(BaseResponse<NguoiDungDto>.OkResponse(result, "Lấy thông tin người dùng thành công"));
        }

        [HttpPost]
        public async Task<IActionResult> AddNguoiDung(NguoiDungCreateDto nguoiDung)
        {
            NguoiDungCreateDto? result = await _nguoiDungService.AddNguoiDungAsync(nguoiDung);
            return Ok(BaseResponse<NguoiDungCreateDto>.OkResponse(result, "Lấy thông tin người dùng thành công"));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchTaiKhoan([FromQuery] string keyword)
        {
            var result = await _nguoiDungService.SearchNguoiDungAsync(keyword);
            return Ok(BaseResponse<IEnumerable<NguoiDungDto>>.OkResponse(result, "Tìm kiếm thông tin người dùng thành công"));
        }
    }
}

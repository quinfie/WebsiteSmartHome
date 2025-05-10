using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/lich_bao_tri")]
    [ApiController]
    [Authorize]
    public class LichBaoTriController : ControllerBase
    {
        private readonly ILichBaoTriService _lichBaoTriService;

        public LichBaoTriController(ILichBaoTriService lichBaoTriService)
        {
            _lichBaoTriService = lichBaoTriService ?? throw new ArgumentNullException(nameof(lichBaoTriService));
        }

        // Lấy tất cả lịch bảo trì
        [HttpGet]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<List<LichBaoTriDto>>>> GetAll()
        {
            var lichBaoTris = await _lichBaoTriService.GetAllLichBaoTriAsync();
            return BaseResponse<List<LichBaoTriDto>>.OkResponse(lichBaoTris, "Lấy danh sách lịch bảo trì thành công");
        }

        // Tạo lịch bảo trì mới
        [HttpPost]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Create([FromBody] CreateLichBaoTriDto dto)
        {
            var result = await _lichBaoTriService.CreateLichBaoTriAsync(dto);
            return BaseResponse<bool>.OkResponse(true, "Tạo lịch bảo trì thành công");
        }


        // Cập nhật lịch bảo trì theo ID
        [HttpPut("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Update(string id, [FromBody] LichBaoTriDto lichBaoTriDto)
        {

            var result = await _lichBaoTriService.UpdateLichBaoTriAsync(Guid.Parse(id), lichBaoTriDto);
            return BaseResponse<bool>.OkResponse(true, "Cập nhật lịch bảo trì thành công");
        }

        // Xóa lịch bảo trì theo ID
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _lichBaoTriService.DeleteLichBaoTriAsync(Guid.Parse(id));
            return BaseResponse<bool>.OkResponse(true, "Xóa lịch bảo trì thành công");
        }

        // Lấy lịch bảo trì theo ID
        [HttpGet("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<LichBaoTriDto>>> GetById(string id)
        {
            var lichBaoTri = await _lichBaoTriService.GetLichBaoTriByIdAsync(Guid.Parse(id));
            return BaseResponse<LichBaoTriDto>.OkResponse(lichBaoTri, "Lấy lịch bảo trì thành công");
        }

        // Tìm kiếm lịch bảo trì theo mã đơn hàng
        [HttpGet("search")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<List<LichBaoTriDto>>>> SearchByOrder([FromQuery] string maDonHang)
        {
            var lichBaoTris = await _lichBaoTriService.SearchLichBaoTriByOrderAsync(Guid.Parse(maDonHang));
            return BaseResponse<List<LichBaoTriDto>>.OkResponse(lichBaoTris, "Tìm kiếm lịch bảo trì thành công");
        }
    }
}

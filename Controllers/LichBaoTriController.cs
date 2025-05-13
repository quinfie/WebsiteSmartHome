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
            var lichBaoTri = await _lichBaoTriService.GetLichBaoTriByIdAsync(id);
            return BaseResponse<LichBaoTriDto>.OkResponse(lichBaoTri, "Lấy lịch bảo trì thành công");
        }

        [HttpGet("by-chitiet")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<List<LichBaoTriDto>>>> GetByChiTietId([FromQuery] int chiTietId)
        {
            var lichBaoTris = await _lichBaoTriService.GetLichBaoTriByChiTietIdAsync(chiTietId);
            return BaseResponse<List<LichBaoTriDto>>.OkResponse(lichBaoTris, "Lấy lịch bảo trì theo chi tiết đơn hàng thành công");
        }

        // Lấy lịch bảo trì theo mã đơn hàng
        [HttpGet("donhang/{donHangId}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<List<LichBaoTriDto>>>> GetByDonHangId(string donHangId)
        {
            var lichBaoTris = await _lichBaoTriService.GetLichBaoTriByDonHangIdAsync(donHangId);
            return BaseResponse<List<LichBaoTriDto>>.OkResponse(lichBaoTris, "Lấy lịch bảo trì theo đơn hàng thành công");
        }

        // Lấy lịch bảo trì theo mã chi tiết đơn hàng
        [HttpGet("chitietdonhang/{chiTietDonHangId}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<List<LichBaoTriDto>>>> GetByChiTietDonHangId(int chiTietDonHangId)
        {
            var lichBaoTris = await _lichBaoTriService.GetLichBaoTriByChiTietIdAsync(chiTietDonHangId);
            return BaseResponse<List<LichBaoTriDto>>.OkResponse(lichBaoTris, "Lấy lịch bảo trì theo chi tiết đơn hàng thành công");
        }

        // Cập nhật trạng thái lịch bảo trì
        [HttpPut("{id}/trang-thai")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<bool>>> UpdateTrangThai(string id, [FromBody] UpdateTrangThaiDto dto)
        {
            var result = await _lichBaoTriService.UpdateTrangThaiLichBaoTriAsync(Guid.Parse(id), dto.TrangThai);
            return BaseResponse<bool>.OkResponse(result, "Cập nhật trạng thái lịch bảo trì thành công");
        }
    }
}

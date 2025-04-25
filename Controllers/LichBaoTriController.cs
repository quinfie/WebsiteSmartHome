using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/lich_bao_tri")]
    [ApiController]
    public class LichBaoTriController : ControllerBase
    {
        private readonly ILichBaoTriService _lichBaoTriService;

        public LichBaoTriController(ILichBaoTriService lichBaoTriService)
        {
            _lichBaoTriService = lichBaoTriService;
        }

        // Lấy tất cả lịch bảo trì
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<LichBaoTriDto>>>> GetAll()
        {
            var lichBaoTris = await _lichBaoTriService.GetAllLichBaoTriAsync();
            return BaseResponse<List<LichBaoTriDto>>.OkResponse(lichBaoTris, "Lấy danh sách lịch bảo trì thành công");
        }

        // Tạo lịch bảo trì mới
        [HttpPost]
        public async Task<ActionResult<BaseResponse<string>>> Create([FromBody] CreateLichBaoTriDto dto)
        {
            if (dto == null)
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ");

            var result = await _lichBaoTriService.CreateLichBaoTriAsync(dto);
            if (result)
                return BaseResponse<string>.Created("ok", "Tạo lịch bảo trì thành công");

            throw new BaseException.BadRequestException("create_failed", "Không thể tạo lịch bảo trì");
        }


        // Cập nhật lịch bảo trì theo ID
        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> Update(string id, [FromBody] LichBaoTriDto lichBaoTriDto)
        {
            if (string.IsNullOrWhiteSpace(id) || id != lichBaoTriDto.Id)
                throw new BaseException.BadRequestException("id_mismatch", "ID không khớp hoặc không hợp lệ");

            var result = await _lichBaoTriService.UpdateLichBaoTriAsync(Guid.Parse(id), lichBaoTriDto);
            if (result)
                return BaseResponse<bool>.OkResponse(true, "Cập nhật lịch bảo trì thành công");

            throw new BaseException.BadRequestException("not_found", "Lịch bảo trì không tồn tại");
        }

        // Xóa lịch bảo trì theo ID
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new BaseException.BadRequestException("invalid_id", "ID không được để trống");

            var result = await _lichBaoTriService.DeleteLichBaoTriAsync(Guid.Parse(id));
            if (result)
                return BaseResponse<bool>.OkResponse(true, "Xóa lịch bảo trì thành công");

            throw new BaseException.BadRequestException("not_found", "Lịch bảo trì không tồn tại");
        }

        // Lấy lịch bảo trì theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<LichBaoTriDto>>> GetById(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new BaseException.BadRequestException("invalid_id", "ID không được để trống");

            var lichBaoTri = await _lichBaoTriService.GetLichBaoTriByIdAsync(Guid.Parse(id));
            if (lichBaoTri == null)
                throw new BaseException.BadRequestException("not_found", "Lịch bảo trì không tồn tại");

            return BaseResponse<LichBaoTriDto>.OkResponse(lichBaoTri, "Lấy lịch bảo trì thành công");
        }

        // Tìm kiếm lịch bảo trì theo mã đơn hàng
        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<List<LichBaoTriDto>>>> SearchByOrder([FromQuery] string maDonHang)
        {
            if (string.IsNullOrWhiteSpace(maDonHang))
                throw new BaseException.BadRequestException("invalid_order_id", "Mã đơn hàng không được để trống");

            var lichBaoTris = await _lichBaoTriService.SearchLichBaoTriByOrderAsync(Guid.Parse(maDonHang));
            return BaseResponse<List<LichBaoTriDto>>.OkResponse(lichBaoTris, "Tìm kiếm lịch bảo trì thành công");
        }
    }
}

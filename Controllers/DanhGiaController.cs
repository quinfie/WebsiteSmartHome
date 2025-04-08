using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/danh_gia")]
    [ApiController]
    public class DanhGiaController : ControllerBase
    {
        private readonly IDanhGiaService _danhGiaService;

        public DanhGiaController(IDanhGiaService danhGiaService)
        {
            _danhGiaService = danhGiaService;
        }

        // Lấy tất cả đánh giá
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<DanhGiaDto>>>> GetAll()
        {
            var danhGias = await _danhGiaService.GetAllDanhGiaAsync();
            return BaseResponse<List<DanhGiaDto>>.OkResponse(danhGias, "Lấy danh sách đánh giá thành công");
        }

        // Tạo đánh giá mới
        [HttpPost]
        public async Task<ActionResult<BaseResponse<DanhGiaDto>>> Create([FromBody] DanhGiaDto danhGiaDto)
        {
            if (danhGiaDto == null)
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ");

            var result = await _danhGiaService.CreateDanhGiaAsync(danhGiaDto);
            if (result)
                return BaseResponse<DanhGiaDto>.Created(danhGiaDto, "Tạo đánh giá thành công");

            throw new BaseException.BadRequestException("create_failed", "Không thể tạo đánh giá");
        }

        // Cập nhật đánh giá theo ID
        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> Update(string id, [FromBody] DanhGiaDto danhGiaDto)
        {
            if (id != danhGiaDto.Id)
                throw new BaseException.BadRequestException("id_mismatch", "ID không khớp");

            var result = await _danhGiaService.UpdateDanhGiaAsync(id, danhGiaDto);
            if (result)
                return BaseResponse<bool>.OkResponse(true, "Cập nhật đánh giá thành công");

            throw new BaseException.BadRequestException("not_found", "Đánh giá không tồn tại");
        }

        // Xóa đánh giá theo ID
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _danhGiaService.DeleteDanhGiaAsync(id);
            if (result)
                return BaseResponse<bool>.OkResponse(true, "Xóa đánh giá thành công");

            throw new BaseException.BadRequestException("not_found", "Đánh giá không tồn tại");
        }

        // Lấy đánh giá theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DanhGiaDto>>> GetById(string id)
        {
            var danhGia = await _danhGiaService.GetDanhGiaByIdAsync(id);
            if (danhGia == null)
                throw new BaseException.BadRequestException("not_found", "Đánh giá không tồn tại");

            return BaseResponse<DanhGiaDto>.OkResponse(danhGia, "Lấy đánh giá thành công");
        }

        // Tìm kiếm đánh giá theo nội dung
        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<List<DanhGiaDto>>>> SearchByContent([FromQuery] string noiDung)
        {
            var danhGias = await _danhGiaService.SearchDanhGiaByContentAsync(noiDung);
            return BaseResponse<List<DanhGiaDto>>.OkResponse(danhGias, "Tìm kiếm đánh giá thành công");
        }
    }
}

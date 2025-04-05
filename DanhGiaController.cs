using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhGiaController : ControllerBase
    {
        private readonly IDanhGiaService _danhGiaService;

        public DanhGiaController(IDanhGiaService danhGiaService)
        {
            _danhGiaService = danhGiaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<DanhGiaDto>>> GetAll()
        {
            var danhGias = await _danhGiaService.GetAllDanhGiaAsync();
            return Ok(danhGias);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] DanhGiaDto danhGiaDto)
        {
            if (danhGiaDto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _danhGiaService.CreateDanhGiaAsync(danhGiaDto);
            if (result)
                return CreatedAtAction(nameof(GetById), new { id = danhGiaDto.Id }, danhGiaDto);

            return StatusCode(500, new { message = "Không thể tạo đánh giá" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(string id, [FromBody] DanhGiaDto danhGiaDto)
        {
            if (id != danhGiaDto.Id)
                return BadRequest(new { message = "ID không khớp" });

            var result = await _danhGiaService.UpdateDanhGiaAsync(id, danhGiaDto);
            if (result)
                return NoContent();

            return NotFound(new { message = "Danh gia không tồn tại" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var result = await _danhGiaService.DeleteDanhGiaAsync(id);
            if (result)
                return NoContent();

            return NotFound(new { message = "Danh gia không tồn tại" });
        }

        // Tìm đánh giá theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DanhGiaDto>>> GetById(string id)
        {
            var danhGia = await _danhGiaService.GetDanhGiaByIdAsync(id);
            if (danhGia == null)
                return NotFound(new { message = "Đánh giá không tồn tại" });

            return BaseResponse<DanhGiaDto>.OkResponse(danhGia);
        }

        // Tìm kiếm đánh giá theo nội dung
        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<List<DanhGiaDto>>>> SearchByContent([FromQuery] string noiDung)
        {
            var danhGias = await _danhGiaService.SearchDanhGiaByContentAsync(noiDung);
            return BaseResponse<List<DanhGiaDto>>.OkResponse(danhGias);
        }
    }
}

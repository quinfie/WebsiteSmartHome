using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
<<<<<<< HEAD
<<<<<<< HEAD
=======
using WebsiteSmartHome.Services;
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
using WebsiteSmartHome.Services;
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

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

<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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
<<<<<<< HEAD
<<<<<<< HEAD
        public async Task<ActionResult> Update(string id, [FromBody] DanhGiaDto danhGiaDto)
=======
        public async Task<ActionResult> Update(Guid id, [FromBody] DanhGiaDto danhGiaDto)
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
        public async Task<ActionResult> Update(Guid id, [FromBody] DanhGiaDto danhGiaDto)
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        {
            if (id != danhGiaDto.Id)
                return BadRequest(new { message = "ID không khớp" });

            var result = await _danhGiaService.UpdateDanhGiaAsync(id, danhGiaDto);
            if (result)
                return NoContent();

            return NotFound(new { message = "Danh gia không tồn tại" });
        }

        [HttpDelete("{id}")]
<<<<<<< HEAD
<<<<<<< HEAD
        public async Task<ActionResult> Delete(string id)
=======
        public async Task<ActionResult> Delete(Guid id)
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
        public async Task<ActionResult> Delete(Guid id)
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        {
            var result = await _danhGiaService.DeleteDanhGiaAsync(id);
            if (result)
                return NoContent();

            return NotFound(new { message = "Danh gia không tồn tại" });
        }
<<<<<<< HEAD
<<<<<<< HEAD

        // Tìm đánh giá theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DanhGiaDto>>> GetById(string id)
=======
        // Tìm đánh giá theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DanhGiaDto>>> GetById(Guid id)
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
        // Tìm đánh giá theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DanhGiaDto>>> GetById(Guid id)
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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

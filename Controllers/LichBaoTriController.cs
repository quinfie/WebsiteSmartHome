using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LichBaoTriController : ControllerBase
    {
        private readonly ILichBaoTriService _lichBaoTriService;

        public LichBaoTriController(ILichBaoTriService lichBaoTriService)
        {
            _lichBaoTriService = lichBaoTriService;
        }

        [HttpGet]
        public async Task<ActionResult<List<LichBaoTriDto>>> GetAll()
        {
            var lichBaoTris = await _lichBaoTriService.GetAllLichBaoTriAsync();
            return Ok(lichBaoTris);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LichBaoTriDto>> GetById(Guid id)
        {
            var lichBaoTri = await _lichBaoTriService.GetLichBaoTriByIdAsync(id);
            if (lichBaoTri == null)
                return NotFound(new { message = "Lịch bảo trì không tồn tại" });

            return Ok(lichBaoTri);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] LichBaoTriDto lichBaoTriDto)
        {
            if (lichBaoTriDto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _lichBaoTriService.CreateLichBaoTriAsync(lichBaoTriDto);
            if (result)
                return CreatedAtAction(nameof(GetById), new { id = lichBaoTriDto.Id }, lichBaoTriDto);

            return StatusCode(500, new { message = "Không thể tạo lịch bảo trì" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] LichBaoTriDto lichBaoTriDto)
        {
            if (id != lichBaoTriDto.Id)
                return BadRequest(new { message = "ID không khớp" });

            var result = await _lichBaoTriService.UpdateLichBaoTriAsync(id, lichBaoTriDto);
            if (result)
                return NoContent();

            return NotFound(new { message = "Lịch bảo trì không tồn tại" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _lichBaoTriService.DeleteLichBaoTriAsync(id);
            if (result)
                return NoContent();

            return NotFound(new { message = "Lịch bảo trì không tồn tại" });
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Services;
using Microsoft.EntityFrameworkCore;

<<<<<<< HEAD
=======

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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

<<<<<<< HEAD
=======

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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
<<<<<<< HEAD
            if (id != Guid.Parse(lichBaoTriDto.Id))
=======
            if (id != lichBaoTriDto.Id)
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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
<<<<<<< HEAD

=======
        // Tìm kiếm lịch bảo trì theo mã đơn hàng
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<List<LichBaoTriDto>>>> SearchByOrder([FromQuery] Guid maDonHang)
        {
            var lichBaoTris = await _lichBaoTriService.SearchLichBaoTriByOrderAsync(maDonHang);
            return BaseResponse<List<LichBaoTriDto>>.OkResponse(lichBaoTris);
        }
<<<<<<< HEAD

=======
        // Tìm lịch bảo trì theo ID
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<LichBaoTriDto>>> GetById(Guid id)
        {
            var lichBaoTri = await _lichBaoTriService.GetLichBaoTriByIdAsync(id);
            if (lichBaoTri == null)
                return NotFound(new { message = "Lịch bảo trì không tồn tại" });

            return BaseResponse<LichBaoTriDto>.OkResponse(lichBaoTri);
        }
    }
}
<<<<<<< HEAD
=======

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

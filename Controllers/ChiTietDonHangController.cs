using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietDonHangController : ControllerBase
    {
        private readonly IChiTietDonHangService _chiTietDonHangService;

        public ChiTietDonHangController(IChiTietDonHangService chiTietDonHangService)
        {
            _chiTietDonHangService = chiTietDonHangService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ChiTietDonHangDto>>> GetAll()
        {
            var chiTietDonHangs = await _chiTietDonHangService.GetAllChiTietDonHangAsync();
            return Ok(chiTietDonHangs);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] ChiTietDonHangDto chiTietDonHangDto)
        {
            if (chiTietDonHangDto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _chiTietDonHangService.CreateChiTietDonHangAsync(chiTietDonHangDto);
            if (result)
                return CreatedAtAction(nameof(GetById), new { id = chiTietDonHangDto.MaDonHang }, chiTietDonHangDto);

            return StatusCode(500, new { message = "Không thể tạo chi tiết đơn hàng" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] ChiTietDonHangDto chiTietDonHangDto)
        {
            if (id != chiTietDonHangDto.MaDonHang)
                return BadRequest(new { message = "ID không khớp" });

            var result = await _chiTietDonHangService.UpdateChiTietDonHangAsync(id, chiTietDonHangDto);
            if (result)
                return NoContent();

            return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _chiTietDonHangService.DeleteChiTietDonHangAsync(id);
            if (result)
                return NoContent();

            return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });
        }
        // Tìm chi tiết đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<ChiTietDonHangDto>>> GetById(Guid id)
        {
            var chiTiet = await _chiTietDonHangService.GetChiTietDonHangByIdAsync(id);
            if (chiTiet == null)
                return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });

            return BaseResponse<ChiTietDonHangDto>.OkResponse(chiTiet);
        }

        // Tìm kiếm chi tiết đơn hàng theo tên sản phẩm
        [HttpGet("search")]
        public async Task<ActionResult<List<ChiTietDonHangDto>>> SearchByName(string name)
        {
            var result = await _chiTietDonHangService.SearchChiTietDonHangByNameAsync(name);
            return Ok(result);
        }

    }
}

using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangController : ControllerBase
    {
        private readonly IDonHangService _donHangService;

        public DonHangController(IDonHangService donHangService)
        {
            _donHangService = donHangService;
        }

        // Lấy tất cả đơn hàng
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<DonHangDto>>>> GetAll()
        {
            List<DonHangDto> donHangs = await _donHangService.GetAllDonHangAsync();
            return BaseResponse<List<DonHangDto>>.OkResponse(donHangs);
        }

        // Lấy đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DonHangDto>>> GetById(Guid id)
        {
            var donHang = await _donHangService.GetDonHangByIdAsync(id);
            if (donHang == null)
                return NotFound(new { message = "Đơn hàng không tồn tại" });

            return BaseResponse<DonHangDto>.OkResponse(donHang);
        }

        // Thêm đơn hàng mới
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] DonHangDto donHangDto)
        {
            if (donHangDto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _donHangService.CreateDonHangAsync(donHangDto);
            if (result)
                return CreatedAtAction(nameof(GetById), new { id = donHangDto.Id }, donHangDto);

            return StatusCode(500, new { message = "Không thể tạo đơn hàng" });
        }

        // Cập nhật đơn hàng
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] DonHangDto donHangDto)
        {
            if (id != donHangDto.Id)
                return BadRequest(new { message = "ID không khớp" });

            var result = await _donHangService.UpdateDonHangAsync(id, donHangDto);
            if (result)
                return NoContent();

            return NotFound(new { message = "Đơn hàng không tồn tại" });
        }

        // Xóa đơn hàng
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _donHangService.DeleteDonHangAsync(id);
            if (result)
                return NoContent();

            return NotFound(new { message = "Đơn hàng không tồn tại" });
        }
    }
}

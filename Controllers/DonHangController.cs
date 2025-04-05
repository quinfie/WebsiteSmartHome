using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var donHangs = await _donHangService.GetAllDonHangAsync();
            return BaseResponse<List<DonHangDto>>.OkResponse(donHangs);
        }

        // Lấy đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DonHangDto>>> GetById(string id)
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
        public async Task<ActionResult> Update(string id, [FromBody] DonHangDto donHangDto)
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
        public async Task<ActionResult> Delete(string id)
        {
            var result = await _donHangService.DeleteDonHangAsync(id);
            if (result)
                return NoContent();

            return NotFound(new { message = "Đơn hàng không tồn tại" });
        }

        // Tìm kiếm đơn hàng theo trạng thái
        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<List<DonHangDto>>>> Search([FromQuery] string trangThai)
        {
            if (string.IsNullOrEmpty(trangThai))
                return BadRequest(new { message = "Vui lòng nhập từ khóa tìm kiếm" });

            var donHangs = await _donHangService.SearchDonHangAsync(trangThai);
            if (donHangs == null || !donHangs.Any())
                return NotFound(new { message = "Không tìm thấy đơn hàng phù hợp" });

            return BaseResponse<List<DonHangDto>>.OkResponse(donHangs);
        }
    }
}

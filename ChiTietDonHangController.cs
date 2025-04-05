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
        private readonly ILogger<ChiTietDonHangController> _logger;

        public ChiTietDonHangController(IChiTietDonHangService chiTietDonHangService, ILogger<ChiTietDonHangController> logger)
        {
            _chiTietDonHangService = chiTietDonHangService;
            _logger = logger;
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
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _chiTietDonHangService.CreateChiTietDonHangAsync(chiTietDonHangDto);
            if (result)
                return CreatedAtAction(nameof(GetById), new { id = chiTietDonHangDto.MaDonHang }, chiTietDonHangDto);

            return StatusCode(500, new { message = "Không thể tạo chi tiết đơn hàng" });
        }
        [HttpPut("{maDonHang}/{maSanPham}")]
        public async Task<ActionResult> Update(string maDonHang, string maSanPham, [FromBody] ChiTietDonHangDto dto)
        {
            // Chuyển từ string sang Guid
            if (!Guid.TryParse(maDonHang, out Guid maDonHangGuid) || !Guid.TryParse(maSanPham, out Guid maSanPhamGuid))
            {
                return BadRequest(new { message = "ID không hợp lệ" });
            }

            // Chuyển dto.MaDonHang và dto.MaSanPham sang Guid nếu chúng là string
            if (!Guid.TryParse(dto.MaDonHang.ToString(), out Guid dtoMaDonHangGuid) || !Guid.TryParse(dto.MaSanPham.ToString(), out Guid dtoMaSanPhamGuid))
            {
                return BadRequest(new { message = "Thông tin chi tiết đơn hàng không hợp lệ" });
            }

            // So sánh GUID với GUID
            if (maDonHangGuid != dtoMaDonHangGuid || maSanPhamGuid != dtoMaSanPhamGuid)
            {
                return BadRequest(new { message = "ID không khớp" });
            }

            var result = await _chiTietDonHangService.UpdateChiTietDonHangAsync(maDonHangGuid, maSanPhamGuid, dto);
            if (result)
                return NoContent();

            return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });
        }



        [HttpDelete("{maDonHang}/{maSanPham}")]
        public async Task<ActionResult> Delete(Guid maDonHang, Guid maSanPham)
        {
            var result = await _chiTietDonHangService.DeleteChiTietDonHangAsync(maDonHang, maSanPham);
            if (result)
                return NoContent();

            return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });
        }

        [HttpGet("{maDonHang}/{maSanPham}")]
        public async Task<ActionResult<BaseResponse<ChiTietDonHangDto>>> GetById(Guid maDonHang, Guid maSanPham)
        {
            var chiTiet = await _chiTietDonHangService.GetChiTietDonHangByIdAsync(maDonHang, maSanPham);
            if (chiTiet == null)
                return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });

            return BaseResponse<ChiTietDonHangDto>.OkResponse(chiTiet);
        }

        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<List<ChiTietDonHangDto>>>> SearchByName(string name)
        {
            var result = await _chiTietDonHangService.SearchChiTietDonHangByNameAsync(name);
            return BaseResponse<List<ChiTietDonHangDto>>.OkResponse(result);
        }
    }

}

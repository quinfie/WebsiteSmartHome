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
<<<<<<< HEAD
<<<<<<< HEAD
        private readonly ILogger<ChiTietDonHangController> _logger;

        public ChiTietDonHangController(IChiTietDonHangService chiTietDonHangService, ILogger<ChiTietDonHangController> logger)
        {
            _chiTietDonHangService = chiTietDonHangService;
            _logger = logger;
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

        public ChiTietDonHangController(IChiTietDonHangService chiTietDonHangService)
        {
            _chiTietDonHangService = chiTietDonHangService;
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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
<<<<<<< HEAD
<<<<<<< HEAD
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
=======
            if (chiTietDonHangDto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
            if (chiTietDonHangDto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

            var result = await _chiTietDonHangService.CreateChiTietDonHangAsync(chiTietDonHangDto);
            if (result)
                return CreatedAtAction(nameof(GetById), new { id = chiTietDonHangDto.MaDonHang }, chiTietDonHangDto);

            return StatusCode(500, new { message = "Không thể tạo chi tiết đơn hàng" });
        }
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] ChiTietDonHangDto chiTietDonHangDto)
        {
            if (id != chiTietDonHangDto.MaDonHang)
                return BadRequest(new { message = "ID không khớp" });

            var result = await _chiTietDonHangService.UpdateChiTietDonHangAsync(id, chiTietDonHangDto);
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            if (result)
                return NoContent();

            return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });
        }

<<<<<<< HEAD
<<<<<<< HEAD


        [HttpDelete("{maDonHang}/{maSanPham}")]
        public async Task<ActionResult> Delete(Guid maDonHang, Guid maSanPham)
        {
            var result = await _chiTietDonHangService.DeleteChiTietDonHangAsync(maDonHang, maSanPham);
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _chiTietDonHangService.DeleteChiTietDonHangAsync(id);
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            if (result)
                return NoContent();

            return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });
        }
<<<<<<< HEAD
<<<<<<< HEAD

        [HttpGet("{maDonHang}/{maSanPham}")]
        public async Task<ActionResult<BaseResponse<ChiTietDonHangDto>>> GetById(Guid maDonHang, Guid maSanPham)
        {
            var chiTiet = await _chiTietDonHangService.GetChiTietDonHangByIdAsync(maDonHang, maSanPham);
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        // Tìm chi tiết đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<ChiTietDonHangDto>>> GetById(Guid id)
        {
            var chiTiet = await _chiTietDonHangService.GetChiTietDonHangByIdAsync(id);
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            if (chiTiet == null)
                return NotFound(new { message = "Chi tiết đơn hàng không tồn tại" });

            return BaseResponse<ChiTietDonHangDto>.OkResponse(chiTiet);
        }

<<<<<<< HEAD
<<<<<<< HEAD
        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<List<ChiTietDonHangDto>>>> SearchByName(string name)
        {
            var result = await _chiTietDonHangService.SearchChiTietDonHangByNameAsync(name);
            return BaseResponse<List<ChiTietDonHangDto>>.OkResponse(result);
        }
    }

=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        // Tìm kiếm chi tiết đơn hàng theo tên sản phẩm
        [HttpGet("search")]
        public async Task<ActionResult<List<ChiTietDonHangDto>>> SearchByName(string name)
        {
            var result = await _chiTietDonHangService.SearchChiTietDonHangByNameAsync(name);
            return Ok(result);
        }

    }
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
}

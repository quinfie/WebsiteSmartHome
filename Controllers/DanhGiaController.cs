using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DanhGiaController : ControllerBase
    {
        private readonly IDanhGiaService _danhGiaService;

        public DanhGiaController(IDanhGiaService danhGiaService)
        {
            _danhGiaService = danhGiaService;
        }

        // Lấy tất cả đánh giá
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<List<DanhGiaDto>>>> GetAll()
        {
            var danhGias = await _danhGiaService.GetAllDanhGiaAsync();
            return BaseResponse<List<DanhGiaDto>>.OkResponse(danhGias, "Lấy danh sách đánh giá thành công");
        }

        // Tạo đánh giá mới
        [HttpPost]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Create([FromBody] CreateDanhGiaDto createDto)
        {
            if (createDto == null)
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ");

            var result = await _danhGiaService.CreateDanhGiaAsync(createDto);
            if (result)
                return BaseResponse<bool>.Created(true, "Tạo đánh giá thành công");

            throw new BaseException.BadRequestException("create_failed", "Không thể tạo đánh giá");
        }


        // Cập nhật đánh giá theo madonhang masanpham
        [HttpPut("{maDonHang}/{maSanPham}")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Update(string maDonHang, string maSanPham, [FromBody] UpdateDanhGiaDto dto)
        {
            var result = await _danhGiaService.UpdateDanhGiaAsync(maDonHang, maSanPham, dto);

            if (result)
                return BaseResponse<bool>.OkResponse(true, "Cập nhật đánh giá thành công");

            throw new BaseException.BadRequestException("not_found", "Đánh giá không tồn tại");
        }


        // Xóa đánh giá theo ID
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _danhGiaService.DeleteDanhGiaAsync(id);
            if (result)
                return BaseResponse<bool>.OkResponse(true, "Xóa đánh giá thành công");

            throw new BaseException.BadRequestException("not_found", "Đánh giá không tồn tại");
        }

        // Lấy đánh giá theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDanhGiaDetail(string id)
        {
            var result = await _danhGiaService.GetDanhGiaDetailByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(new { data = result });
        }

        // Lấy danh sách đánh giá theo Mã đơn hàng
        [HttpGet("by-order-id/{maDonHang}")]
        [AllowAnonymous] // Or [Authorize(Policy = "RequireCustomerRole")] depending on access requirement
        public async Task<ActionResult<BaseResponse<List<DanhGiaDto>>>> GetByMaDonHang(string maDonHang)
        {
            var danhGias = await _danhGiaService.GetDanhGiaByMaDonHangAsync(maDonHang);
            return BaseResponse<List<DanhGiaDto>>.OkResponse(danhGias, "Lấy danh sách đánh giá theo đơn hàng thành công");
        }

        // Lấy danh sách đánh giá theo Mã sản phẩm
        [HttpGet("by-product-id/{maSanPham}")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<PagedResponse<DanhGiaDto>>>> GetByMaSanPham([FromRoute] string maSanPham, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var pagedReviews = await _danhGiaService.GetDanhGiaByMaSanPhamAsync(maSanPham, pageNumber, pageSize);
            return BaseResponse<PagedResponse<DanhGiaDto>>.OkResponse(pagedReviews, "Lấy danh sách đánh giá theo sản phẩm thành công");
        }

        // Tìm kiếm đánh giá theo nội dung
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<List<DanhGiaDto>>>> SearchByContent([FromQuery] string noiDung)
        {
            var danhGias = await _danhGiaService.SearchDanhGiaByContentAsync(noiDung);
            return BaseResponse<List<DanhGiaDto>>.OkResponse(danhGias, "Tìm kiếm đánh giá thành công");
        }
    }
}

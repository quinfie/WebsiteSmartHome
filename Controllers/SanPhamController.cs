using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/san_pham")]
    public class SanPhamController : Controller
    {
        private readonly ISanPhamService _sanPhamService;

        public SanPhamController(ISanPhamService sanPhamService)
        {
            _sanPhamService = sanPhamService ?? throw new ArgumentNullException(nameof(sanPhamService));
        }

        [HttpGet]
        public async Task<IActionResult> GetPagedSanPham([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _sanPhamService.GetAllAsync(page, pageSize);
            return Ok(BaseResponse<PagedResult<SanPhamDto>>.OkResponse(result, "Lấy danh sách sản phẩm thành công"));
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetSanPhamById(string id)
        {
            var result = await _sanPhamService.GetSanPhamByIdAsync(id);
            return Ok(BaseResponse<SanPhamResponseDto>.OkResponse(result, "Lấy thông tin sản phẩm thành công"));
        }

        [HttpPost]
        public async Task<IActionResult> CreateSanPham(
            [FromBody] SanPhamCreateDto sanPhamDto,
            [FromQuery] string maDanhMuc,
            [FromQuery] string maNhaCungCap,
            [FromQuery] string maKho)
        {
            var result = await _sanPhamService.CreateSanPhamAsync(sanPhamDto, maDanhMuc, maNhaCungCap, maKho);
            return Ok(BaseResponse<SanPhamResponseDto>.OkResponse(result, "Tạo sản phẩm thành công"));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSanPham([FromBody] SanPhamUpdateDto sanPhamDto)
        {
            var result = await _sanPhamService.UpdateSanPhamAsync(sanPhamDto);
            return Ok(BaseResponse<SanPhamResponseDto>.OkResponse(result, "Cập nhật sản phẩm thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSanPham(string id)
        {
            var result = await _sanPhamService.DeleteSanPhamAsync(id);
            return Ok(BaseResponse<SanPhamResponseDto>.OkResponse(result, "Xóa sản phẩm thành công"));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchSanPham(
            [FromQuery] string? keyword,
            [FromQuery] string? maDanhMuc,
            [FromQuery] string? maNhaCungCap,
            [FromQuery] string? maKho,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? sortBy,
            [FromQuery] bool ascending = true,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _sanPhamService.SearchSanPhamAsync(keyword, maDanhMuc, maNhaCungCap, maKho, minPrice, maxPrice, sortBy, ascending, page, pageSize);
            return Ok(BaseResponse<PagedResult<SanPhamResponseDto>>.OkResponse(result, "Tìm kiếm sản phẩm thành công"));
        }
    }
}

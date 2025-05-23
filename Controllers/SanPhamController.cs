using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SanPhamController : ControllerBase
    {
        private readonly ISanPhamService _sanPhamService;

        public SanPhamController(ISanPhamService sanPhamService)
        {
            _sanPhamService = sanPhamService ?? throw new ArgumentNullException(nameof(sanPhamService));
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<PagedResult<SanPhamDto>>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _sanPhamService.GetAllAsync(page, pageSize);
            return BaseResponse<PagedResult<SanPhamDto>>.OkResponse(result, "Lấy danh sách sản phẩm thành công");
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<SanPhamResponseDto>>> GetById(string id)
        {
            var result = await _sanPhamService.GetSanPhamByIdAsync(id);
            return BaseResponse<SanPhamResponseDto>.OkResponse(result, "Lấy thông tin sản phẩm thành công");
        }

        [HttpPost]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<SanPhamResponseDto>>> Create(
            [FromBody] SanPhamCreateDto request,
            [FromQuery] string maDanhMuc,
            [FromQuery] string maNhaCungCap,
            [FromQuery] string maKho)
        {
            var result = await _sanPhamService.CreateSanPhamAsync(request, maDanhMuc, maNhaCungCap, maKho);
            return BaseResponse<SanPhamResponseDto>.OkResponse(result, "Tạo sản phẩm thành công");
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<SanPhamResponseDto>>> Update(string id, SanPhamUpdateDto request)
        {
            var result = await _sanPhamService.UpdateSanPhamAsync(id, request);
            return BaseResponse<SanPhamResponseDto>.OkResponse(result, "Cập nhật sản phẩm thành công");
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _sanPhamService.DeleteSanPhamAsync(id);
            return BaseResponse<bool>.OkResponse(result, "Xóa sản phẩm thành công");
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<PagedResult<SanPhamResponseDto>>>> Search(
            [FromQuery] string? keyword,
            [FromQuery] string? maDanhMuc,
            [FromQuery] string? maNhaCungCap,
            [FromQuery] string? maKho,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? sortBy = "TenSanPham",
            [FromQuery] bool ascending = true,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _sanPhamService.SearchSanPhamAsync(keyword, maDanhMuc, maNhaCungCap, maKho, minPrice, maxPrice, sortBy, ascending, page, pageSize);
            return BaseResponse<PagedResult<SanPhamResponseDto>>.OkResponse(result, "Tìm kiếm sản phẩm thành công");
        }

        [HttpPost("upload")]
        [AllowAnonymous] // Tạm thời cho phép upload không cần xác thực trong quá trình phát triển
        public async Task<ActionResult<BaseResponse<string>>> UploadImage(IFormFile file)
        {
            var imagePath = await _sanPhamService.UploadImageAsync(file);
            return BaseResponse<string>.OkResponse(imagePath, "Upload ảnh thành công");
        }

        [HttpGet("suggested")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<List<SanPhamResponseDto>>>> GetSuggested([FromQuery] int limit = 4)
        {
            var result = await _sanPhamService.GetSuggestedProductsAsync(limit);
            return BaseResponse<List<SanPhamResponseDto>>.OkResponse(result, "Lấy sản phẩm gợi ý thành công");
        }

        [HttpGet("suggested-by-order/{orderId}")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<List<SanPhamResponseDto>>>> GetSuggestedProductsByOrder(string orderId, [FromQuery] int limit = 4)
        {
            var result = await _sanPhamService.GetSuggestedProductsByOrderAsync(orderId, limit);
            return BaseResponse<List<SanPhamResponseDto>>.OkResponse(result, "Lấy danh sách sản phẩm gợi ý thành công");
        }
    }
}

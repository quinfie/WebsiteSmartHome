using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Quản lý các thao tác với danh mục.
    /// </summary>
    [ApiController]
    [Route("api/danh_muc")]
    public class DanhMucController : ControllerBase
    {
        private readonly IDanhMucService _danhMucService;

        public DanhMucController(IDanhMucService danhMucService)
        {
            _danhMucService = danhMucService;
        }

        /// <summary>
        /// Lấy danh sách tất cả danh mục.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var danhMucs = await _danhMucService.GetAllDanhMucAsync();
            return Ok(BaseResponse<IEnumerable<DanhMucDto>>.OkResponse(danhMucs, "Lấy danh sách danh mục thành công"));
        }

        /// <summary>
        /// Lấy danh mục theo ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var danhMuc = await _danhMucService.GetDanhMucByIdAsync(id);
            return Ok(BaseResponse<DanhMucDto>.OkResponse(danhMuc, "Lấy danh mục thành công"));
        }

        /// <summary>
        /// Thêm danh mục mới.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] DanhMucCreateDto dto)
        {
            var created = await _danhMucService.AddDanhMucAsync(dto);
            return Ok(BaseResponse<DanhMucCreateDto>.OkResponse(created, "Thêm danh mục thành công"));
        }

        /// <summary>
        /// Cập nhật danh mục.
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] DanhMucDto dto)
        {
            await _danhMucService.UpdateDanhMucAsync(dto);
            return Ok(BaseResponse<string>.OkResponse("Cập nhật danh mục thành công"));
        }

        /// <summary>
        /// Xóa danh mục theo ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _danhMucService.DeleteDanhMucAsync(id);
            return Ok(BaseResponse<string>.OkResponse("Xóa danh mục thành công"));
        }

        /// <summary>
        /// Tìm kiếm danh mục theo từ khóa.
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var result = await _danhMucService.SearchDanhMucAsync(keyword);
            return Ok(BaseResponse<IEnumerable<DanhMucDto>>.OkResponse(result, "Tìm kiếm danh mục thành công"));
        }
    }
}

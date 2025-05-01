using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Quản lý các thao tác với danh mục.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DanhMucController : ControllerBase
    {
        private readonly IDanhMucService _danhMucService;

        public DanhMucController(IDanhMucService danhMucService)
        {
            _danhMucService = danhMucService ?? throw new ArgumentNullException(nameof(danhMucService));
        }

        /// <summary>
        /// Lấy danh sách tất cả danh mục.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<IEnumerable<DanhMucDto>>>> GetAll()
        {
            var result = await _danhMucService.GetAllDanhMucAsync();
            return BaseResponse<IEnumerable<DanhMucDto>>.OkResponse(result, "Lấy danh sách danh mục thành công");
        }

        /// <summary>
        /// Lấy danh mục theo ID.
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<DanhMucDto>>> GetById(string id)
        {
            var result = await _danhMucService.GetDanhMucByIdAsync(id);
            return BaseResponse<DanhMucDto>.OkResponse(result, "Lấy thông tin danh mục thành công");
        }

        /// <summary>
        /// Thêm danh mục mới.
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<DanhMucCreateDto>>> Create(DanhMucCreateDto request)
        {
            var result = await _danhMucService.AddDanhMucAsync(request);
            return BaseResponse<DanhMucCreateDto>.OkResponse(result, "Tạo danh mục thành công");
        }

        /// <summary>
        /// Cập nhật danh mục.
        /// </summary>
        [HttpPut]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Update(DanhMucDto request)
        {
            var result = await _danhMucService.UpdateDanhMucAsync(request);
            return BaseResponse<bool>.OkResponse(result, "Cập nhật danh mục thành công");
        }

        /// <summary>
        /// Xóa danh mục theo ID.
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _danhMucService.DeleteDanhMucAsync(id);
            return BaseResponse<bool>.OkResponse(result, "Xóa danh mục thành công");
        }

        /// <summary>
        /// Tìm kiếm danh mục theo từ khóa.
        /// </summary>
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<IEnumerable<DanhMucDto>>>> Search([FromQuery] string keyword)
        {
            var result = await _danhMucService.SearchDanhMucAsync(keyword);
            return BaseResponse<IEnumerable<DanhMucDto>>.OkResponse(result, "Tìm kiếm danh mục thành công");
        }
    }
}

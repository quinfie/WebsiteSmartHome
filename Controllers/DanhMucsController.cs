using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Store;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Services;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Quản lý các thao tác với danh mục.
    /// </summary>
    [Route("api/danhmuc")]
    [ApiController]
    public class DanhMucController : ControllerBase
    {
        private readonly IDanhMucService _danhMucService;
        private readonly IUnitOfWork _unitOfWork;

        public DanhMucController(IDanhMucService danhMucService, IUnitOfWork unitOfWork)
        {
            _danhMucService = danhMucService;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Lấy danh sách tất cả danh mục.
        /// </summary>
        /// <returns>Danh sách các danh mục.</returns>
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<DanhMucDto>>>> GetAll()
        {
            var danhMucs = await _danhMucService.GetAllDanhMucAsync();
            return BaseResponse<List<DanhMucDto>>.OkResponse(danhMucs);
        }

        /// <summary>
        /// Lấy thông tin chi tiết của danh mục theo ID.
        /// </summary>
        /// <param name="id">ID của danh mục cần lấy thông tin.</param>
        /// <returns>Thông tin danh mục nếu tìm thấy, null nếu không tìm thấy.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<DanhMucDto>> GetDanhMucByIdAsync(Guid id)
        {
            var danhMuc = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(id);

            if (danhMuc == null)
                return NotFound(new { message = "Danh mục không tồn tại" });

            return new DanhMucDto
            {
                Id = danhMuc.Id,
                TenDanhMuc = danhMuc.TenDanhMuc,
                MoTa = danhMuc.MoTa
            };
        }


        // <summary>
        /// Tạo danh mục.
        /// </summary>
        /// <returns>Kết quả tạo danh mục thành công hay thất bại.</returns>
        [HttpPost]
        public async Task<ActionResult<BaseResponse<bool>>> CreateDanhMuc([FromBody] DanhMucDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _danhMucService.CreateDanhMucAsync(dto);

            if (!result)
                return NotFound(new { message = "Không thể tạo danh mục" });

            return Ok(new BaseResponse<bool>(StatusCodeHelper.OK, "200", true, "Tạo danh mục thành công"));
        }

        /// <summary>
        /// Cập nhật danh mục.
        /// </summary>
        /// <returns>Kết quả cập nhật danh mục thành công hay thất bại.</returns>
        [HttpPut]
        public async Task<ActionResult<BaseResponse<bool>>> UpdateDanhMuc([FromBody] DanhMucDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _danhMucService.UpdateDanhMucAsync(dto);
            if (!result)
                return NotFound(new { message = "Danh mục không tồn tại" });

            return BaseResponse<bool>.OkResponse(true);
        }


        /// <summary>
        /// Xóa danh mục theo ID.
        /// </summary>
        /// <param name="id">ID của danh mục cần xóa.</param>
        /// <returns>Kết quả xóa danh mục thành công hay thất bại.</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> DeleteDanhMuc(Guid id)
        {
            var result = await _danhMucService.DeleteDanhMucAsync(id);
            if (!result)
                return NotFound(new { message = "Danh mục không tồn tại" });

            return BaseResponse<bool>.OkResponse(true, "Xóa danh mục thành công");
        }
    }
}

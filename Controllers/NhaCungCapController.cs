using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Store;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Quản lý các thao tác với nhà cung cấp.
    /// </summary>
    [Route("api/nhaCungCap")]
    [ApiController]
    public class NhaCungCapController : ControllerBase
    {
        private readonly INhaCungCapService _nhaCungCapService;
        private readonly IUnitOfWork _unitOfWork;

        public NhaCungCapController(INhaCungCapService NhaCungCapService, IUnitOfWork unitOfWork)
        {
            _nhaCungCapService = NhaCungCapService;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Lấy danh sách tất cả nhà cung cấp.
        /// </summary>
        /// <returns>Danh sách các nhà cung cấp.</returns>
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<NhaCungCapDto>>>> GetAll()
        {
            var nhaCungCaps = await _nhaCungCapService.GetAllNhaCungCapAsync();
            return BaseResponse<List<NhaCungCapDto>>.OkResponse(nhaCungCaps);
        }

        /// <summary>
        /// Lấy thông tin chi tiết của nhà cung cấp theo ID.
        /// </summary>
        /// <param name="id">ID của nhà cung cấp cần lấy thông tin.</param>
        /// <returns>Thông tin nhà cung cấp nếu tìm thấy, null nếu không tìm thấy.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<NhaCungCapDto>> GetNhaCungCapByIdAsync(Guid id)
        {
            var nhaCungCap = await _unitOfWork.GetRepository<NhaCungCap>().GetByIdAsync(id);

            if (nhaCungCap == null)
                return NotFound(new { message = "Nhà Cung Cấp không tồn tại" });

            return new NhaCungCapDto
            {
                Id = nhaCungCap.Id,
                TenNhaCungCap = nhaCungCap.TenNhaCungCap,
                SDT = nhaCungCap.SDT,
                Email = nhaCungCap.Email,
                DiaChi = nhaCungCap.DiaChi
            };
        }


        // <summary>
        /// Tạo nhà cung cấp.
        /// </summary>
        /// <returns>Kết quả tạo nhà cung cấp thành công hay thất bại.</returns>
        [HttpPost]
        public async Task<ActionResult<BaseResponse<bool>>> CreateNhaCungCap([FromBody] NhaCungCapDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _nhaCungCapService.CreateNhaCungCapAsync(dto);

            if (!result)
                return NotFound(new { message = "Không thể tạo nhà cung cấp" });

            return Ok(new BaseResponse<bool>(StatusCodeHelper.OK, "200", true, "Tạo nhà cung cấp thành công"));
        }

        /// <summary>
        /// Cập nhật nhà cung cấp.
        /// </summary>
        /// <returns>Kết quả cập nhật nhà cung cấp thành công hay thất bại.</returns>
        [HttpPut]
        public async Task<ActionResult<BaseResponse<bool>>> UpdateNhaCungCap([FromBody] NhaCungCapDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _nhaCungCapService.UpdateNhaCungCapAsync(dto);
            if (!result)
                return NotFound(new { message = "Nhà cung cấp không tồn tại" });

            return BaseResponse<bool>.OkResponse(true);
        }


        /// <summary>
        /// Xóa nhà cung cấp theo ID.
        /// </summary>
        /// <param name="id">ID của nhà cung cấp cần xóa.</param>
        /// <returns>Kết quả xóa nhà cung cấp thành công hay thất bại.</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> DeleteNhaCungCap(Guid id)
        {
            var result = await _nhaCungCapService.DeleteNhaCungCapAsync(id);
            if (!result)
                return NotFound(new { message = "Nhà cung cấp không tồn tại" });

            return BaseResponse<bool>.OkResponse(true, "Xóa nhà cung cấp thành công");
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Store;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.Services;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Quản lý các thao tác với kho.
    /// </summary>
    [Route("api/kho")]
    [ApiController]
    public class KhoController : ControllerBase
    {
        private readonly IKhoService _khoService;
        private readonly IUnitOfWork _unitOfWork;

        public KhoController(IKhoService khoService, IUnitOfWork unitOfWork)
        {
            _khoService = khoService;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Lấy danh sách tất cả kho.
        /// </summary>
        /// <returns>Danh sách các kho.</returns>
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<KhoDto>>>> GetAll()
        {
            var khos = await _khoService.GetAllKhoAsync();
            return BaseResponse<List<KhoDto>>.OkResponse(khos);
        }

        /// <summary>
        /// Lấy thông tin chi tiết của kho theo ID.
        /// </summary>
        /// <param name="id">ID của kho cần lấy thông tin.</param>
        /// <returns>Thông tin kho nếu tìm thấy, null nếu không tìm thấy.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<KhoDto>> GetKhoByIdAsync(Guid id)
        {
            var kho = await _unitOfWork.GetRepository<Kho>().GetByIdAsync(id);

            if (kho == null)
                return NotFound(new { message = "Kho không tồn tại" });

            return new KhoDto
            {
                Id = kho.Id,
                TenKho = kho.TenKho,
                DiaChi = kho.DiaChi
            };
        }


        // <summary>
        /// Tạo kho.
        /// </summary>
        /// <returns>Kết quả tạo kho thành công hay thất bại.</returns>
        [HttpPost]
        public async Task<ActionResult<BaseResponse<bool>>> CreateKho([FromBody] KhoDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _khoService.CreateKhoAsync(dto);

            if (!result)
                return NotFound(new { message = "Không thể tạo kho" });

            return Ok(new BaseResponse<bool>(StatusCodeHelper.OK, "200", true, "Tạo kho thành công"));
        }

        /// <summary>
        /// Cập nhật kho.
        /// </summary>
        /// <returns>Kết quả cập nhật kho thành công hay thất bại.</returns>
        [HttpPut]
        public async Task<ActionResult<BaseResponse<bool>>> UpdateKho([FromBody] KhoDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var result = await _khoService.UpdateKhoAsync(dto);
            if (!result)
                return NotFound(new { message = "Kho không tồn tại" });

            return BaseResponse<bool>.OkResponse(true);
        }


        /// <summary>
        /// Xóa kho theo ID.
        /// </summary>
        /// <param name="id">ID của kho cần xóa.</param>
        /// <returns>Kết quả xóa kho thành công hay thất bại.</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> DeleteKho(Guid id)
        {
            var result = await _khoService.DeleteKhoAsync(id);
            if (!result)
                return NotFound(new { message = "Kho không tồn tại" });

            return BaseResponse<bool>.OkResponse(true, "Xóa kho thành công");
        }
    }
}

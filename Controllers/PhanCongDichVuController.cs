using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PhanCongDichVuController : ControllerBase
    {
        private readonly IPhanCongDichVuService _service;

        public PhanCongDichVuController(IPhanCongDichVuService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        /// <summary>
        /// Phân công yêu cầu dịch vụ cho kỹ thuật viên
        /// </summary>
        /// <param name="dto">Thông tin phân công</param>
        /// <returns>Thông tin phân công đã được tạo</returns>
        [HttpPost("phan-cong")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<BaseResponse<PhanCongDichVuDto>> PhanCong([FromBody] CreatePhanCongDichVuDto dto)
        {
            string quanLiId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _service.PhanCongAsync(dto, quanLiId);
            return BaseResponse<PhanCongDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Cập nhật trạng thái phân công
        /// </summary>
        /// <param name="id">ID phân công</param>
        /// <param name="trangThai">Trạng thái mới</param>
        /// <returns>Thông tin phân công đã được cập nhật</returns>
        [HttpPut("trang-thai/{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<BaseResponse<PhanCongDichVuDto>> UpdateTrangThai(string id, [FromBody] string trangThai)
        {
            var result = await _service.UpdateTrangThaiAsync(id, trangThai);
            return BaseResponse<PhanCongDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Đánh dấu phân công đã hoàn thành
        /// </summary>
        /// <param name="id">ID phân công</param>
        /// <returns>Thông tin phân công đã được cập nhật</returns>
        [HttpPost("hoan-thanh/{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<BaseResponse<PhanCongDichVuDto>> HoanThanh(string id)
        {
            var result = await _service.HoanThanhAsync(id);
            return BaseResponse<PhanCongDichVuDto>.OkResponse(result);
        }
    }
}
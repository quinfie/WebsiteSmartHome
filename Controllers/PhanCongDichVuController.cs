using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Utils;

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
        [Authorize(Roles = "Quản Trị Viên, Quản Lí")]
        public async Task<ActionResult<BaseResponse<PhanCongDichVuDto>>> PhanCong([FromBody] CreatePhanCongDichVuDto dto)
        {
            var result = await _service.PhanCongAsync(dto);
            return Ok(BaseResponse<PhanCongDichVuDto>.OkResponse(result));
        }

        /// <summary>
        /// Cập nhật trạng thái phân công
        /// </summary>
        /// <param name="id">ID phân công</param>
        /// <param name="trangThai">Trạng thái mới</param>
        /// <returns>Thông tin phân công đã được cập nhật</returns>
        [HttpPut("trang-thai/{id}")]
        [Authorize(Roles = "Nhân Viên")]
        public async Task<ActionResult<BaseResponse<PhanCongDichVuDto>>> UpdateTrangThai(string id, [FromBody] string trangThai)
        {
            try
            {
                var result = await _service.UpdateTrangThaiAsync(id, trangThai);
                return Ok(BaseResponse<PhanCongDichVuDto>.OkResponse(result));
            }
            catch (BaseException ex)
            {
                return BadRequest(new BaseResponse<PhanCongDichVuDto>(
                    StatusCodeHelper.BadRequest,
                    "error",
                    null,
                    ex.Message
                ));
            }
        }

        /// <summary>
        /// Đánh dấu phân công đã hoàn thành
        /// </summary>
        /// <param name="id">ID phân công</param>
        /// <returns>Thông tin phân công đã được cập nhật</returns>
        [HttpPost("hoan-thanh/{id}")]
        [Authorize(Roles = "Nhân Viên")]
        public async Task<ActionResult<BaseResponse<PhanCongDichVuDto>>> HoanThanh(string id)
        {
            try
            {
                var result = await _service.HoanThanhAsync(id);
                return Ok(BaseResponse<PhanCongDichVuDto>.OkResponse(result));
            }
            catch (BaseException ex)
            {
                return BadRequest(new BaseResponse<PhanCongDichVuDto>(
                    StatusCodeHelper.BadRequest,
                    "error",
                    null,
                    ex.Message
                ));
            }
        }

        /// <summary>
        /// Lấy danh sách phân công theo yêu cầu dịch vụ
        /// </summary>
        /// <param name="yeuCauId">ID của yêu cầu dịch vụ</param>
        /// <returns>Danh sách phân công</returns>
        [HttpGet("yeu-cau/{yeuCauId}")]
        [Authorize(Roles = "Quản Trị Viên,Quản Lí")]
        public async Task<ActionResult<BaseResponse<List<PhanCongDichVuDto>>>> GetPhanCongByYeuCau(string yeuCauId)
        {
            try
            {
                var result = await _service.GetPhanCongByYeuCauAsync(yeuCauId);
                return Ok(BaseResponse<List<PhanCongDichVuDto>>.OkResponse(result));
            }
            catch (BaseException ex)
            {
                return BadRequest(new BaseResponse<List<PhanCongDichVuDto>>(
                    StatusCodeHelper.BadRequest,
                    "error",
                    null,
                    ex.Message
                ));
            }
        }

        /// <summary>
        /// Lấy danh sách phân công theo kỹ thuật viên
        /// </summary>
        /// <param name="kyThuatVienId">ID của kỹ thuật viên</param>
        /// <returns>Danh sách phân công</returns>
        [HttpGet("ky-thuat-vien/{kyThuatVienId}")]
        [Authorize(Roles = "Quản Trị Viên,Quản Lí,Nhân Viên")]
        public async Task<ActionResult<BaseResponse<List<PhanCongDichVuDto>>>> GetPhanCongByKyThuatVien(string kyThuatVienId)
        {
            var result = await _service.GetPhanCongByKyThuatVienAsync(kyThuatVienId);
            return Ok(BaseResponse<List<PhanCongDichVuDto>>.OkResponse(result));
        }

        /// <summary>
        /// Lấy danh sách phân công dạng calendar cho kỹ thuật viên
        /// </summary>
        /// <param name="kyThuatVienId">ID của kỹ thuật viên</param>
        /// <returns>Danh sách phân công</returns>
        [HttpGet("calendar/ky-thuat-vien/{kyThuatVienId}")]
        [Authorize(Roles = "Quản Trị Viên,Quản Lí,Nhân Viên")]
        public async Task<IActionResult> GetPhanCongCalendarByKyThuatVien(string kyThuatVienId)
        {
            var result = await _service.GetPhanCongCalendarByKyThuatVienAsync(kyThuatVienId);
            return Ok(new { data = result });
        }

        /// <summary>
        /// Lấy thông tin phân công theo ID
        /// </summary>
        /// <param name="id">ID của phân công</param>
        /// <returns>Thông tin phân công</returns>
        [HttpGet("{id}")]
        [Authorize(Roles = "Quản Trị Viên,Quản Lí,Nhân Viên")]
        public async Task<ActionResult<BaseResponse<PhanCongCalendarDto>>> GetPhanCongById(string id)
        {
            try
            {
                var result = await _service.GetPhanCongCalendarByIdAsync(id);
                return Ok(BaseResponse<PhanCongCalendarDto>.OkResponse(result));
            }
            catch (BaseException ex)
            {
                return BadRequest(new BaseResponse<PhanCongCalendarDto>(
                    StatusCodeHelper.BadRequest,
                    "error",
                    null,
                    ex.Message
                ));
            }
        }
    }
}
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;

namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Controller quản lý các yêu cầu dịch vụ
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class YeuCauDichVuController : ControllerBase
    {
        private readonly IYeuCauDichVuService _service;

        /// <summary>
        /// Khởi tạo controller với service xử lý yêu cầu dịch vụ
        /// </summary>
        /// <param name="service">Service xử lý yêu cầu dịch vụ</param>
        public YeuCauDichVuController(IYeuCauDichVuService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        /// <summary>
        /// Tạo mới một yêu cầu dịch vụ
        /// </summary>
        /// <param name="dto">Thông tin yêu cầu dịch vụ cần tạo</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được tạo</returns>
        [HttpPost("tao")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> TaoYeuCau([FromBody] CreateYeuCauDichVuDto dto)
        {
            string khachHangId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _service.TaoYeuCauAsync(dto, khachHangId);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Lấy danh sách yêu cầu dịch vụ của khách hàng hiện tại
        /// </summary>
        /// <returns>Danh sách yêu cầu dịch vụ của khách hàng</returns>
        [HttpGet("cua-toi")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<BaseResponse<IEnumerable<YeuCauDichVuDto>>> GetYeuCauCuaToi()
        {
            string khachHangId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _service.GetYeuCauByKhachHangAsync(khachHangId);
            return BaseResponse<IEnumerable<YeuCauDichVuDto>>.OkResponse(result);
        }

        /// <summary>
        /// Lấy danh sách yêu cầu dịch vụ theo khách hàng
        /// </summary>
        /// <param name="khachHangId">ID của khách hàng</param>
        /// <returns>Danh sách yêu cầu dịch vụ của khách hàng</returns>
        [HttpGet("khach-hang/{khachHangId}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<BaseResponse<IEnumerable<YeuCauDichVuDto>>> GetByKhachHang(string khachHangId)
        {
            var result = await _service.GetYeuCauByKhachHangAsync(khachHangId);
            return BaseResponse<IEnumerable<YeuCauDichVuDto>>.OkResponse(result);
        }

        /// <summary>
        /// Lấy thông tin chi tiết yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <returns>Thông tin chi tiết yêu cầu dịch vụ</returns>
        [HttpGet("{id}")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> GetById(string id)
        {
            var result = await _service.GetByIdAsync(id);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Cập nhật trạng thái của yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="trangThai">Trạng thái mới cần cập nhật</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được cập nhật</returns>
        [HttpPut("trang-thai/{id}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> UpdateTrangThai(string id, [FromBody] string trangThai)
        {
            var result = await _service.UpdateTrangThaiAsync(id, trangThai);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Cập nhật chi phí của yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="chiPhi">Chi phí mới cần cập nhật</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được cập nhật</returns>
        [HttpPut("{id}/chi-phi")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> UpdateChiPhi(string id, [FromBody] decimal chiPhi)
        {
            var result = await _service.UpdateChiPhiAsync(id, chiPhi);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Cập nhật ngày xử lý của yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="ngayXuLy">Ngày xử lý mới cần cập nhật</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được cập nhật</returns>
        [HttpPut("{id}/ngay-xu-ly")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> UpdateNgayXuLy(string id, [FromBody] DateTime ngayXuLy)
        {
            var result = await _service.UpdateNgayXuLyAsync(id, ngayXuLy);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Cập nhật tiến độ xử lý của yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="tienDo">Tiến độ mới cần cập nhật</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được cập nhật</returns>
        [HttpPut("{id}/tien-do")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> UpdateTienDo(string id, [FromBody] string tienDo)
        {
            var result = await _service.UpdateTienDoAsync(id, tienDo);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Cập nhật kết quả xử lý của yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="ketQua">Kết quả mới cần cập nhật</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được cập nhật</returns>
        [HttpPut("{id}/ket-qua")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> UpdateKetQua(string id, [FromBody] string ketQua)
        {
            var result = await _service.UpdateKetQuaAsync(id, ketQua);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Hủy yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ cần hủy</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được hủy</returns>
        [HttpPost("huy/{id}")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> HuyYeuCau(string id)
        {
            var result = await _service.HuyYeuCauAsync(id);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }

        /// <summary>
        /// Xác nhận yêu cầu dịch vụ
        /// </summary>
        /// <param name="yeuCauId">ID của yêu cầu dịch vụ</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được xác nhận</returns>
        [HttpPost("xac-nhan/{yeuCauId}")]
        [Authorize(Policy = "RequireManageRole")]
        public async Task<BaseResponse<YeuCauDichVuDto>> XacNhanYeuCau(string yeuCauId)
        {
            string quanLiId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _service.XacNhanYeuCauAsync(yeuCauId, quanLiId);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result);
        }
    }
}
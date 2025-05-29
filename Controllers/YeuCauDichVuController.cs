using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;
using Microsoft.AspNetCore.Authorization;
namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Controller quản lý các yêu cầu dịch vụ
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class YeuCauDichVuController : ControllerBase
    {
        private readonly IYeuCauDichVuService _yeuCauDichVuService;

        /// <summary>
        /// Khởi tạo controller với service xử lý yêu cầu dịch vụ
        /// </summary>
        /// <param name="yeuCauDichVuService">Service xử lý yêu cầu dịch vụ</param>
        public YeuCauDichVuController(IYeuCauDichVuService yeuCauDichVuService)
        {
            _yeuCauDichVuService = yeuCauDichVuService ?? throw new ArgumentNullException(nameof(yeuCauDichVuService));
        }

        /// <summary>
        /// Tạo mới một yêu cầu dịch vụ
        /// </summary>
        /// <param name="dto">Thông tin yêu cầu dịch vụ cần tạo</param>
        /// <param name="userId">ID của người dùng</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được tạo</returns>
        [HttpPost]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> TaoYeuCau([FromBody] CreateYeuCauDichVuDto dto, [FromQuery] string userId)
        {
            var result = await _yeuCauDichVuService.TaoYeuCauAsync(dto, userId);
            return Ok(BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Tạo yêu cầu dịch vụ thành công"));
        }

        /// <summary>
        /// Lấy danh sách yêu cầu dịch vụ của khách hàng hiện tại
        /// </summary>
        /// <param name="userId">ID của khách hàng</param>
        /// <returns>Danh sách yêu cầu dịch vụ của khách hàng</returns>
        [HttpGet("cua-toi")]
        [Authorize(Policy = "RequireCustomerRole")]
        public async Task<ActionResult<BaseResponse<List<YeuCauDichVuKhachHangDto>>>> GetYeuCauCuaToi([FromQuery] string userId)
        {
            var result = await _yeuCauDichVuService.GetYeuCauByKhachHangAsync(userId);
            return Ok(BaseResponse<List<YeuCauDichVuKhachHangDto>>.OkResponse(result, "Lấy danh sách yêu cầu dịch vụ thành công"));
        }

        /// <summary>
        /// Lấy danh sách yêu cầu dịch vụ theo khách hàng
        /// </summary>
        /// <param name="khachHangId">ID của khách hàng</param>
        /// <returns>Danh sách yêu cầu dịch vụ của khách hàng</returns>
        [HttpGet("khach-hang/{khachHangId}")]
        public async Task<ActionResult<BaseResponse<List<YeuCauDichVuKhachHangDto>>>> GetByKhachHang(string khachHangId)
        {
            var result = await _yeuCauDichVuService.GetYeuCauByKhachHangAsync(khachHangId);
            return Ok(BaseResponse<List<YeuCauDichVuKhachHangDto>>.OkResponse(result, "Lấy danh sách yêu cầu dịch vụ thành công"));
        }

        /// <summary>
        /// Lấy thông tin chi tiết yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <returns>Thông tin chi tiết yêu cầu dịch vụ</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> GetById(string id)
        {
            var result = await _yeuCauDichVuService.GetByIdAsync(id);
            return Ok(BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Lấy chi tiết yêu cầu dịch vụ thành công"));
        }

        /// <summary>
        /// Lấy thông tin chi tiết yêu cầu dịch vụ đầy đủ (bao gồm khách hàng và sản phẩm)
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <returns>Thông tin chi tiết yêu cầu dịch vụ đầy đủ</returns>
        [HttpGet("{id}/detailed")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> GetDetailedById(string id)
        {
            var result = await _yeuCauDichVuService.GetDetailedYeuCauByIdAsync(id);
            if (result == null)
            {
                return NotFound(BaseResponse<YeuCauDichVuDto>.ErrorResponse("Yêu cầu dịch vụ không tồn tại"));
            }
            return Ok(BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Lấy chi tiết yêu cầu dịch vụ đầy đủ thành công"));
        }

        /// <summary>
        /// Cập nhật trạng thái của yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="dto">Trạng thái mới cần cập nhật</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được cập nhật</returns>
        [HttpPut("trang-thai/{id}")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> UpdateTrangThai(string id, [FromBody] UpdateTrangThaiYeuCauDto dto)
        {
            var result = await _yeuCauDichVuService.UpdateTrangThaiAsync(id, dto.TrangThai, dto.NgayXuLy);
            return Ok(BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Cập nhật trạng thái thành công"));
        }

        /// <summary>
        /// Cập nhật chi phí của yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="dto">Chi phí mới cần cập nhật</param>
        /// <param name="nhanVienId">ID của nhân viên</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được cập nhật</returns>
        [HttpPut("{id}/chi-phi")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> UpdateChiPhi(string id, [FromBody] UpdateChiPhiYeuCauDto dto, [FromQuery] string nhanVienId)
        {
            var result = await _yeuCauDichVuService.UpdateChiPhiAsync(id, dto.ChiPhiYeuCau, nhanVienId);
            return Ok(BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Cập nhật chi phí thành công"));
        }

        /// <summary>
        /// Cập nhật ngày xử lý của yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="ngayXuLy">Ngày xử lý mới cần cập nhật</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được cập nhật</returns>
        [HttpPut("{id}/ngay-xu-ly")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> UpdateNgayXuLy(string id, [FromBody] DateTime ngayXuLy)
        {
            var result = await _yeuCauDichVuService.UpdateNgayXuLyAsync(id, ngayXuLy);
            return Ok(BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Cập nhật ngày xử lý thành công"));
        }

        [HttpPut("{id}/mo-ta")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> UpdateMoTa(string id, [FromBody] UpdateMoTaDto dto)
        {
            var result = await _yeuCauDichVuService.UpdateMoTaAsync(id, dto.MoTa, dto.IsKetQua);
            return Ok(BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Cập nhật mô tả thành công"));
        }

        /// <summary>
        /// Hủy yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ cần hủy</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được hủy</returns>
        [HttpPut("{id}/huy")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> HuyYeuCau(string id)
        {
            var result = await _yeuCauDichVuService.HuyYeuCauAsync(id);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Hủy yêu cầu thành công");
        }

        /// <summary>
        /// Xác nhận yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ</param>
        /// <param name="quanLyId">ID của người quản lý</param>
        /// <returns>Thông tin yêu cầu dịch vụ đã được xác nhận</returns>
        [HttpPut("{id}/xac-nhan")]
        public async Task<ActionResult<BaseResponse<YeuCauDichVuDto>>> XacNhanYeuCau(string id, [FromQuery] string quanLyId)
        {
            var result = await _yeuCauDichVuService.XacNhanYeuCauAsync(id, quanLyId);
            return BaseResponse<YeuCauDichVuDto>.OkResponse(result, "Xác nhận yêu cầu thành công");
        }

        /// <summary>
        /// Lấy tất cả các yêu cầu dịch vụ với các bộ lọc tùy chọn
        /// </summary>
        /// <param name="trangThai">Lọc theo trạng thái (tùy chọn)</param>
        /// <param name="loaiDichVu">Lọc theo loại dịch vụ (tùy chọn)</param>
        /// <returns>Danh sách các yêu cầu dịch vụ</returns>
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<YeuCauDichVuDto>>>> GetAllYeuCau(
            [FromQuery] string? trangThai = null,
            [FromQuery] string? loaiDichVu = null)
        {
            var result = await _yeuCauDichVuService.GetAllYeuCauAsync(trangThai, loaiDichVu);
            return BaseResponse<List<YeuCauDichVuDto>>.OkResponse(result, "Lấy danh sách yêu cầu dịch vụ thành công");
        }

        /// <summary>
        /// Lấy danh sách yêu cầu dịch vụ chưa được phân công
        /// </summary>
        /// <returns>Danh sách các yêu cầu dịch vụ chưa phân công</returns>
        [HttpGet("chua-phan-cong")]
        public async Task<ActionResult<BaseResponse<List<YeuCauDichVuDto>>>> GetYeuCauChuaPhanCong()
        {
            var result = await _yeuCauDichVuService.GetYeuCauChuaPhanCongAsync();
            return Ok(BaseResponse<List<YeuCauDichVuDto>>.OkResponse(result, "Lấy danh sách yêu cầu chưa phân công thành công"));
        }

        /// <summary>
        /// Lấy danh sách yêu cầu dịch vụ được phân công cho kỹ thuật viên
        /// </summary>
        /// <param name="kyThuatVienId">ID của kỹ thuật viên</param>
        /// <returns>Danh sách các yêu cầu dịch vụ của kỹ thuật viên</returns>
        [HttpGet("ky-thuat-vien/{kyThuatVienId}")]
        public async Task<ActionResult<BaseResponse<List<YeuCauDichVuDto>>>> GetYeuCauTheoKyThuatVien(string kyThuatVienId)
        {
            var result = await _yeuCauDichVuService.GetYeuCauTheoKyThuatVienAsync(kyThuatVienId);
            return Ok(BaseResponse<List<YeuCauDichVuDto>>.OkResponse(result, "Lấy danh sách yêu cầu theo kỹ thuật viên thành công"));
        }

        /// <summary>
        /// Lấy danh sách yêu cầu dịch vụ được phân công cho nhân viên
        /// </summary>
        /// <param name="maNhanVien">Mã nhân viên</param>
        /// <returns>Danh sách các yêu cầu dịch vụ được phân công cho nhân viên</returns>
        [HttpGet("nhan-vien/{maNhanVien}")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<BaseResponse<List<YeuCauDichVuDto>>>> GetYeuCauCuaNhanVien(string maNhanVien)
        {
            var result = await _yeuCauDichVuService.GetYeuCauTheoKyThuatVienAsync(maNhanVien);
            return Ok(BaseResponse<List<YeuCauDichVuDto>>.OkResponse(result, "Lấy danh sách yêu cầu của nhân viên thành công"));
        }

        /// <summary>
        /// Đếm số lượng yêu cầu dịch vụ theo trạng thái
        /// </summary>
        /// <param name="trangThai">Trạng thái cần đếm</param>
        /// <returns>Số lượng yêu cầu dịch vụ</returns>
        [HttpGet("count/{trangThai}")]
        public async Task<ActionResult<BaseResponse<int>>> CountYeuCauTheoTrangThai(string trangThai)
        {
            var result = await _yeuCauDichVuService.CountYeuCauTheoTrangThaiAsync(trangThai);
            return Ok(BaseResponse<int>.OkResponse(result, "Đếm số lượng yêu cầu theo trạng thái thành công"));
        }

        /// <summary>
        /// Tính tổng chi phí các yêu cầu dịch vụ đã hoàn thành
        /// </summary>
        /// <param name="tuNgay">Ngày bắt đầu tính (tùy chọn)</param>
        /// <param name="denNgay">Ngày kết thúc tính (tùy chọn)</param>
        /// <returns>Tổng chi phí</returns>
        [HttpGet("tong-chi-phi")]
        public async Task<ActionResult<BaseResponse<decimal>>> TinhTongChiPhi(
            [FromQuery] DateTime? tuNgay = null,
            [FromQuery] DateTime? denNgay = null)
        {
            var result = await _yeuCauDichVuService.TinhTongChiPhiAsync(tuNgay, denNgay);
            return Ok(BaseResponse<decimal>.OkResponse(result, "Tính tổng chi phí thành công"));
        }

        /// <summary>
        /// Xóa vĩnh viễn một yêu cầu dịch vụ
        /// </summary>
        /// <param name="id">ID của yêu cầu dịch vụ cần xóa</param>
        /// <returns>Kết quả xóa</returns>
        [HttpDelete("{id}")]
        // [Authorize(Policy = "RequireAdminOrManagerRole")] // Cần cấu hình Policy phù hợp
        public async Task<ActionResult<BaseResponse<string>>> DeleteYeuCau(string id)
        {
            await _yeuCauDichVuService.DeleteYeuCauAsync(id);
            return Ok(BaseResponse<string>.OkResponse($"Yêu cầu dịch vụ {id} đã được xóa vĩnh viễn.", "Xóa yêu cầu dịch vụ thành công"));
        }
    }
}
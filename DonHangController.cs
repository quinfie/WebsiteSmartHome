using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/don_hang")]
    public class DonHangController : ControllerBase
    {
        private readonly IDonHangService _donHangService;

        public DonHangController(IDonHangService donHangService)
        {
            _donHangService = donHangService;
        }

        // Lấy tất cả đơn hàng
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<DonHangDto>>>> GetAll()
        {
            var donHangs = await _donHangService.GetAllDonHangAsync();
            return BaseResponse<List<DonHangDto>>.OkResponse(donHangs, "Lấy danh sách đơn hàng thành công");
        }

        // Lấy đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DonHangDto>>> GetById(string id)
        {
            var donHang = await _donHangService.GetDonHangByIdAsync(id);
            if (donHang == null)
                throw new BaseException.BadRequestException("not_found", "Đơn hàng không tồn tại");

            return BaseResponse<DonHangDto>.OkResponse(donHang, "Lấy đơn hàng thành công");
        }

        // Thêm đơn hàng mới
        [HttpPost]
        public async Task<ActionResult<BaseResponse<DonHangDto>>> Create([FromBody] DonHangDto donHangDto)
        {
            if (donHangDto == null)
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ");

            var result = await _donHangService.CreateDonHangAsync(donHangDto);
            if (result)
                return BaseResponse<DonHangDto>.Created(donHangDto, "Tạo đơn hàng thành công");

            throw new BaseException.BadRequestException("create_failed", "Không thể tạo đơn hàng");
        }

        // Cập nhật đơn hàng
        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> Update(string id, [FromBody] DonHangDto donHangDto)
        {
            if (id != donHangDto.MaNguoiDung)
                throw new BaseException.BadRequestException("id_mismatch", "ID không khớp");

            var result = await _donHangService.UpdateDonHangAsync(id, donHangDto);
            if (result)
                return BaseResponse<bool>.OkResponse(true, "Cập nhật đơn hàng thành công");

            throw new BaseException.BadRequestException("not_found", "Đơn hàng không tồn tại");
        }

        // Xóa đơn hàng
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _donHangService.DeleteDonHangAsync(id);
            if (result)
                return BaseResponse<bool>.OkResponse(true, "Xóa đơn hàng thành công");

            throw new BaseException.BadRequestException("not_found", "Đơn hàng không tồn tại");
        }

        // Tìm kiếm đơn hàng theo trạng thái
        [HttpGet("search")]
        public async Task<ActionResult<BaseResponse<List<DonHangDto>>>> Search([FromQuery] string trangThai)
        {
            if (string.IsNullOrWhiteSpace(trangThai))
                throw new BaseException.BadRequestException("invalid_query", "Vui lòng nhập từ khóa tìm kiếm");

            var donHangs = await _donHangService.SearchDonHangAsync(trangThai);
            return BaseResponse<List<DonHangDto>>.OkResponse(donHangs, "Tìm kiếm đơn hàng thành công");
        }
    }
}

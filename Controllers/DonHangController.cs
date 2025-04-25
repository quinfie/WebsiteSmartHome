using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    // Định tuyến mặc định cho controller này: api/don_hang
    [Route("api/don_hang")]
    [ApiController]
    public class DonHangController : ControllerBase
    {
        // Service xử lý logic cho đơn hàng
        private readonly IDonHangService _donHangService;

        // Inject service qua constructor
        public DonHangController(IDonHangService donHangService)
        {
            _donHangService = donHangService;
        }

        // GET: api/don_hang
        // Lấy tất cả đơn hàng
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<DonHangDto>>>> GetAll()
        {
            var donHangs = await _donHangService.GetAllDonHangAsync();
            return BaseResponse<List<DonHangDto>>.OkResponse(donHangs, "Lấy danh sách đơn hàng thành công");
        }

        // POST: api/don_hang
        // Tạo đơn hàng mới
        [HttpPost]
        public async Task<ActionResult<BaseResponse<bool>>> Create([FromBody] CreateDonHangDto createDto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (createDto == null)
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ");

            var result = await _donHangService.CreateDonHangAsync(createDto);
            if (result)
                return BaseResponse<bool>.Created(true, "Tạo đơn hàng và chi tiết đơn hàng thành công");

            // Nếu không thành công thì ném lỗi
            throw new BaseException.BadRequestException("create_failed", "Không thể tạo đơn hàng");
        }


        // PUT: api/don_hang/{id}
        // Cập nhật đơn hàng theo ID
        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> Update(string id, [FromBody] UpdateDonHangDto updateDto)
        {
            var result = await _donHangService.UpdateDonHangAsync(id, updateDto);

            if (result)
                return BaseResponse<bool>.OkResponse(true, "Cập nhật đơn hàng thành công");

            throw new BaseException.BadRequestException("not_found", "Đơn hàng không tồn tại");
        }

        // DELETE: api/don_hang/{id}
        // Xóa đơn hàng theo ID
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> Delete(string id)
        {
            var result = await _donHangService.DeleteDonHangAsync(id);
            if (result)
                return BaseResponse<bool>.OkResponse(true, "Xóa đơn hàng thành công");

            throw new BaseException.BadRequestException("not_found", "Đơn hàng không tồn tại");
        }

        // GET: api/don_hang/{id}
        // Lấy đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<DonHangDto>>> GetById(string id)
        {
            var donHang = await _donHangService.GetDonHangByIdAsync(id);
            if (donHang == null)
                throw new BaseException.BadRequestException("not_found", "Đơn hàng không tồn tại");

            return BaseResponse<DonHangDto>.OkResponse(donHang, "Lấy đơn hàng thành công");
        }
    }
}

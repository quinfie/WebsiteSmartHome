using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Services;

[Route("api/chi_tiet_don_hang")]
[ApiController]
public class ChiTietDonHangController : ControllerBase
{
    private readonly IChiTietDonHangService _chiTietDonHangService;
    private readonly ILogger<ChiTietDonHangController> _logger;

    public ChiTietDonHangController(IChiTietDonHangService chiTietDonHangService, ILogger<ChiTietDonHangController> logger)
    {
        _chiTietDonHangService = chiTietDonHangService;
        _logger = logger;
    }

    // Lấy toàn bộ danh sách chi tiết đơn hàng
    [HttpGet]
    public async Task<ActionResult<BaseResponse<List<ChiTietDonHangDto>>>> GetAll()
    {
        var chiTietDonHangs = await _chiTietDonHangService.GetAllChiTietDonHangAsync();
        return BaseResponse<List<ChiTietDonHangDto>>.OkResponse(chiTietDonHangs, "Lấy danh sách chi tiết đơn hàng thành công");
    }

    // Tạo mới một chi tiết đơn hàng
    [HttpPost]
    public async Task<ActionResult<BaseResponse<bool>>> Create([FromBody] CreateChiTietDonHangDto dto)
    {
        if (!ModelState.IsValid)
            throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ.");

        var result = await _chiTietDonHangService.CreateChiTietDonHangAsync(dto);

        if (result)
            return BaseResponse<bool>.OkResponse(true, "Tạo chi tiết đơn hàng thành công");

        throw new BaseException.BadRequestException("create_failed", "Không thể tạo chi tiết đơn hàng");
    }

    // Cập nhật thông tin một chi tiết đơn hàng theo mã đơn hàng và mã sản phẩm
    [HttpPut("{maDonHang}/{maSanPham}")]
    public async Task<ActionResult<BaseResponse<bool>>> Update(Guid maDonHang, Guid maSanPham, [FromBody] UpdateChiTietDonHangDto dto)
    {
        if (!ModelState.IsValid)
            throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ.");

        var result = await _chiTietDonHangService.UpdateChiTietDonHangAsync(maDonHang, maSanPham, dto);

        if (result)
            return BaseResponse<bool>.OkResponse(true, "Cập nhật chi tiết đơn hàng thành công");

        throw new BaseException.BadRequestException("not_found", "Chi tiết đơn hàng không tồn tại");
    }

    // Xóa chi tiết đơn hàng theo mã đơn hàng và mã sản phẩm
    [HttpDelete("{maDonHang}/{maSanPham}")]
    public async Task<ActionResult<BaseResponse<bool>>> Delete(Guid maDonHang, Guid maSanPham)
    {
        var result = await _chiTietDonHangService.DeleteChiTietDonHangAsync(maDonHang, maSanPham);

        if (result)
            return BaseResponse<bool>.OkResponse(true, "Xóa chi tiết đơn hàng thành công");

        throw new BaseException.BadRequestException("not_found", "Chi tiết đơn hàng không tồn tại");
    }

    // Lấy chi tiết đơn hàng theo mã đơn hàng và mã sản phẩm
    [HttpGet("{maDonHang}/{maSanPham}")]
    public async Task<ActionResult<BaseResponse<ChiTietDonHangDto>>> GetById(Guid maDonHang, Guid maSanPham)
    {
        var chiTiet = await _chiTietDonHangService.GetChiTietDonHangByIdAsync(maDonHang, maSanPham);

        if (chiTiet == null)
            throw new BaseException.BadRequestException("not_found", "Chi tiết đơn hàng không tồn tại");

        return BaseResponse<ChiTietDonHangDto>.OkResponse(chiTiet, "Lấy chi tiết đơn hàng thành công");
    }

    // Tìm kiếm chi tiết đơn hàng theo tên (hoặc từ khóa)
    [HttpGet("search")]
    public async Task<ActionResult<BaseResponse<List<ChiTietDonHangDto>>>> SearchByName(string name)
    {
        var result = await _chiTietDonHangService.SearchChiTietDonHangByNameAsync(name);
        return BaseResponse<List<ChiTietDonHangDto>>.OkResponse(result, "Tìm kiếm chi tiết đơn hàng thành công");
    }
}

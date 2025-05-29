using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireAdminRole")]
    public class ThongKeController : ControllerBase
    {
        private readonly IThongKeService _thongKeService;

        public ThongKeController(IThongKeService thongKeService)
        {
            _thongKeService = thongKeService;
        }

        [HttpGet("donhang")]
        public async Task<ActionResult<List<ThongKeDonHangDto>>> GetThongKeDonHang(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var result = await _thongKeService.GetThongKeDonHang(startDate, endDate);
            return Ok(result);
        }

        [HttpGet("sanpham")]
        public async Task<ActionResult<List<ThongKeSanPhamDto>>> GetThongKeSanPham(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var result = await _thongKeService.GetThongKeSanPham(startDate, endDate);
            return Ok(result);
        }

        [HttpGet("danhmuc")]
        public async Task<ActionResult<List<ThongKeDanhMucDto>>> GetThongKeTheoDanhMuc(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var result = await _thongKeService.GetThongKeTheoDanhMuc(startDate, endDate);
            return Ok(result);
        }

        [HttpGet("dichvu")]
        public async Task<ActionResult<List<ThongKeDichVuDto>>> GetThongKeDichVu(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var result = await _thongKeService.GetThongKeDichVu(startDate, endDate);
            return Ok(result);
        }

        [HttpGet("danhgia")]
        public async Task<ActionResult<List<ThongKeDanhGiaDto>>> GetThongKeDanhGia(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var result = await _thongKeService.GetThongKeDanhGia(startDate, endDate);
            return Ok(result);
        }
    }
} 
using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.Core.Store;

namespace WebsiteSmartHome.Controllers
{
    /// <summary>
    /// Quản lý các thao tác với sản phẩm.
    /// </summary>
    [Route("api/sanpham")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly ISanPhamService _sanPhamService;
        private readonly IUnitOfWork _unitOfWork;

        public SanPhamController(ISanPhamService sanPhamService, IUnitOfWork unitOfWork)
        {
            _sanPhamService = sanPhamService;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Lấy danh sách tất cả sản phẩm.
        /// </summary>
        /// <returns>Danh sách các sản phẩm.</returns>
        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<SanPhamDto>>>> GetAll()
        {
            var sanPhams = await _sanPhamService.GetAllSanPhamAsync();
            return BaseResponse<List<SanPhamDto>>.OkResponse(sanPhams);
        }

        /// <summary>
        /// Lấy thông tin chi tiết của sản phẩm theo ID.
        /// </summary>
        /// <param name="id">ID của sản phẩm cần lấy thông tin.</param>
        /// <returns>Thông tin sản phẩm nếu tìm thấy, null nếu không tìm thấy.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<SanPhamDto>> GetSanPhamByIdAsync(Guid id)
        {
            var sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(id);

            if (sanPham == null)
                return NotFound(new { message = "Sản phẩm không tồn tại" });

            return new SanPhamDto
            {
                Id = sanPham.Id,
                TenSanPham = sanPham.TenSanPham,
                Gia = sanPham.Gia,
                SoLuongTon = sanPham.SoLuongTon,
                ThoiGianBaoHanh = sanPham.ThoiGianBaoHanh,
                ThoiGianBaoTri = sanPham.ThoiGianBaoTri,
                MoTa = sanPham.MoTa
            };
        }

        // <summary>
        /// Tạo sản phẩm.
        /// </summary>
        /// <returns>Kết quả tạo sản phẩm thành công hay thất bại.</returns>
        //[HttpPost]
        //public async Task<ActionResult<BaseResponse<bool>>> CreateSanPham([FromBody] SanPhamDto dto)
        //{
        //    if (dto == null)
        //        return BadRequest(new { message = "Dữ liệu không hợp lệ" });

        //    var result = await _sanPhamService.CreateSanPhamAsync(dto);

        //    if (!result)
        //        return NotFound(new { message = "Không thể tạo sản phẩm" });

        //    return Ok(new BaseResponse<bool>(StatusCodeHelper.OK, "200", true, "Tạo sản phẩm thành công"));
        //}


        /// <summary>
        /// Cập nhật sản phẩm.
        /// </summary>
        /// <returns>Kết quả cập nhật sản phẩm thành công hay thất bại.</returns>
        //[HttpPut]
        //public async Task<ActionResult<BaseResponse<bool>>> UpdateSanPham([FromBody] SanPhamDto dto)
        //{
        //    if (dto == null)
        //        return BadRequest(new { message = "Dữ liệu không hợp lệ" });

        //    var result = await _sanPhamService.UpdateSanPhamAsync(dto);
        //    if (!result)
        //        return NotFound(new { message = "Sản phẩm không tồn tại" });

        //    return BaseResponse<bool>.OkResponse(true);
        //}



        /// <summary>
        /// Xóa sản phẩm theo ID.
        /// </summary>
        /// <param name="id">ID của sản phẩm cần xóa.</param>
        /// <returns>Kết quả xóa sản phẩm thành công hay thất bại.</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> DeleteSanPham(Guid id)
        {
            var result = await _sanPhamService.DeleteSanPhamAsync(id);
            if (!result)
                return NotFound(new { message = "Sản phẩm không tồn tại" });

            return BaseResponse<bool>.OkResponse(true, "Xóa sản phẩm thành công");
        }
    }
}

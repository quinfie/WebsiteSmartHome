using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhMucController: ControllerBase
    {
        private readonly IDanhMucService _danhMucService;

        public DanhMucController(IDanhMucService danhMucService)
        {
            _danhMucService = danhMucService;
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<DanhMucDto>>>> GetAll()
        {
            List<DanhMucDto> danhMucs = await _danhMucService.GetAllDanhMucAsync();
            return BaseResponse<List<DanhMucDto>>.OkResponse(danhMucs);
        }

        //[HttpGet("{id}")]
        //public async Task<ActionResult<DanhMuc>> GetById(Guid id)
        //{
        //    var danhMuc = await _danhMucService.GetDanhMucByIdAsync(id);
        //    if (danhMuc == null)
        //        return NotFound(new { message = "Danh mục không tồn tại" });

        //    return BaseResponse<>.OkResponse(danhMuc);
        //}


        //[HttpPost]
        //public async Task<ActionResult> Create([FromBody] DanhMuc danhMuc)
        //{
        //    if (danhMuc == null)
        //        return BadRequest(new { message = "Dữ liệu không hợp lệ" });

        //    var result = await _danhMucService.CreateDanhMucAsync(danhMuc);
        //    if (result)
        //        return CreatedAtAction(nameof(GetById), new { id = danhMuc.Id }, danhMuc);

        //    return StatusCode(500, new { message = "Không thể tạo danh mục" });
        //}

        //[HttpPut("{id}")]
        //public async Task<ActionResult> Update(Guid id, [FromBody] DanhMuc danhMuc)
        //{
        //    if (id != danhMuc.Id)
        //        return BadRequest(new { message = "ID không khớp" });

        //    var result = await _danhMucService.UpdateDanhMucAsync(id, danhMuc);
        //    if (result)
        //        return NoContent();

        //    return NotFound(new { message = "Danh mục không tồn tại" });
        //}

        //[HttpDelete("{id}")]
        //public async Task<ActionResult> Delete(Guid id)
        //{
        //    var result = await _danhMucService.DeleteDanhMucAsync(id);
        //    if (result)
        //        return NoContent();

        //    return NotFound(new { message = "Danh mục không tồn tại" });
        //}
    }
}

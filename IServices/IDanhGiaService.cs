using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IDanhGiaService
    {
        Task<List<DanhGiaDto>> GetAllDanhGiaAsync();
        Task<List<DanhGiaDto>> SearchDanhGiaByContentAsync(string content);
        Task<DanhGiaDto?> GetDanhGiaByIdAsync(string id); // đổi từ Guid sang string
        Task<bool> CreateDanhGiaAsync(CreateDanhGiaDto danhGiaDto);//HAM DTO RIENG
        Task<bool> UpdateDanhGiaAsync(string maDonHang, string maSanPham, UpdateDanhGiaDto dto);
        Task<bool> DeleteDanhGiaAsync(string id);
    }
}


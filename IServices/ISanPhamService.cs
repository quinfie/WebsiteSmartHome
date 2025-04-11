using System.Threading.Tasks;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;

namespace WebsiteSmartHome.IServices
{
    public interface ISanPhamService
    {
        Task<PagedResult<SanPhamDto>> GetAllAsync(int page, int pageSize);
        Task<SanPhamResponseDto?> GetSanPhamByIdAsync(string id);
        Task<SanPhamResponseDto?> CreateSanPhamAsync(SanPhamCreateDto dto, string maDanhMuc, string maNhaCungCap, string maKho);
        Task<SanPhamResponseDto?> UpdateSanPhamAsync(SanPhamUpdateDto dto);
        Task<SanPhamResponseDto?> DeleteSanPhamAsync(string id);
        Task<PagedResult<SanPhamResponseDto>> SearchSanPhamAsync(
            string? keyword,
            string? maDanhMuc,
            string? maNhaCungCap,
            string? maKho,
            decimal? minPrice,
            decimal? maxPrice,
            string? sortBy = "TenSanPham", // TenSanPham | Gia
            bool ascending = true,
            int page = 1,
            int pageSize = 10);
    }

}

using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.IServices;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;

namespace WebsiteSmartHome.Services
{
    public class SanPhamService : ISanPhamService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SanPhamService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork)); ;
        }

        public async Task<PagedResult<SanPhamDto>> GetAllAsync(int page, int pageSize)
        {
            var repo = _unitOfWork.GetRepository<SanPham>();

            IList<SanPham> allSanPham = await repo.GetAllAsync();
            int totalItems = allSanPham.Count;

            // Áp dụng phân trang
            var sanPhamPaged = allSanPham
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var sanPhamDtos = sanPhamPaged.Select(sp => new SanPhamDto
            {
                Id = sp.Id.ToString(),
                TenSanPham = sp.TenSanPham,
                DonGia = sp.Gia,
                SoLuongTon = sp.SoLuongTon,
                ThoiGianBaoHanh = sp.ThoiGianBaoHanh,
                NgaySanXuat = sp.NgaySanXuat,
                MoTa = sp.MoTa!
            });

            return new PagedResult<SanPhamDto>
            {
                Items = sanPhamDtos.ToList(),
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize
            };
        }


        public async Task<SanPhamResponseDto?> GetSanPhamByIdAsync(string id)
        {
            if (!Guid.TryParse(id, out var guid))
                throw new BaseException.BadRequestException("invalid_id", "Mã sản phẩm không hợp lệ");

            SanPham? sanPham = await _unitOfWork.GetRepository<SanPham>()
                .Entities
                .Include(sp => sp.MaDanhMucNavigation)
                .Include(sp => sp.MaNhaCungCapNavigation)
                .Include(sp => sp.MaKhoNavigation)
                .FirstOrDefaultAsync(sp => sp.Id == guid);

            if (sanPham == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy sản phẩm");

            return new SanPhamResponseDto
            {
                Id = sanPham.Id.ToString(),
                TenSanPham = sanPham.TenSanPham,
                DonGia = sanPham.Gia,
                SoLuongTon = sanPham.SoLuongTon,
                ThoiGianBaoHanh = sanPham.ThoiGianBaoHanh,
                NgaySanXuat = sanPham.NgaySanXuat,
                MoTa = sanPham.MoTa ?? string.Empty,
                TenDanhMuc = sanPham.MaDanhMucNavigation?.TenDanhMuc ?? string.Empty,
                TenNhaCungCap = sanPham.MaNhaCungCapNavigation?.TenNhaCungCap ?? string.Empty,
                TenKho = sanPham.MaKhoNavigation?.TenKho ?? string.Empty
            };
        }

        public async Task<SanPhamResponseDto?> CreateSanPhamAsync(SanPhamCreateDto dto, string maDanhMuc, string maNhaCungCap, string maKho)
        {
            Guid danhMucId = ParseGuidOrThrow(maDanhMuc, "invalid_category", "Mã danh mục không hợp lệ");
            Guid nhaCungCapId = ParseGuidOrThrow(maNhaCungCap, "invalid_supplier", "Mã nhà cung cấp không hợp lệ");
            Guid khoId = ParseGuidOrThrow(maKho, "invalid_warehouse", "Mã kho không hợp lệ");

            await GetEntityOrThrowAsync<DanhMuc>(danhMucId, "category_not_found", "Danh mục không tồn tại");
            await GetEntityOrThrowAsync<NhaCungCap>(nhaCungCapId, "supplier_not_found", "Nhà cung cấp không tồn tại");
            await GetEntityOrThrowAsync<Kho>(khoId, "warehouse_not_found", "Kho không tồn tại");

            if (dto.NgaySanXuat > DateTime.Now)
                throw new BaseException.BadRequestException("invalid_date", "Ngày sản xuất không được vượt quá hiện tại");

            SanPham sanPham = new SanPham
            {
                Id = Guid.NewGuid(),
                TenSanPham = dto.TenSanPham,
                Gia = dto.DonGia,
                SoLuongTon = dto.SoLuongTon,
                ThoiGianBaoHanh = dto.ThoiGianBaoHanh,
                NgaySanXuat = dto.NgaySanXuat,
                MoTa = dto.MoTa,
                MaDanhMuc = danhMucId,
                MaNhaCungCap = nhaCungCapId,
                MaKho = khoId
            };

            await _unitOfWork.GetRepository<SanPham>().InsertAsync(sanPham);
            await _unitOfWork.SaveAsync();

            return MapToResponseDto(sanPham);
        }

        public async Task<SanPhamResponseDto?> UpdateSanPhamAsync(SanPhamUpdateDto dto)
        {
            var id = ParseGuidOrThrow(dto.Id, "invalid_id", "Mã sản phẩm không hợp lệ");
            var danhMucId = ParseGuidOrThrow(dto.MaDanhMuc, "invalid_category", "Mã danh mục không hợp lệ");
            var nhaCungCapId = ParseGuidOrThrow(dto.MaNhaCungCap, "invalid_supplier", "Mã nhà cung cấp không hợp lệ");
            var khoId = ParseGuidOrThrow(dto.MaKho, "invalid_warehouse", "Mã kho không hợp lệ");

            var sanPham = await GetEntityOrThrowAsync<SanPham>(id, "not_found", "Không tìm thấy sản phẩm");
            await GetEntityOrThrowAsync<DanhMuc>(danhMucId, "category_not_found", "Danh mục không tồn tại");
            await GetEntityOrThrowAsync<NhaCungCap>(nhaCungCapId, "supplier_not_found", "Nhà cung cấp không tồn tại");
            await GetEntityOrThrowAsync<Kho>(khoId, "warehouse_not_found", "Kho không tồn tại");

            if (dto.NgaySanXuat > DateTime.Now)
                throw new BaseException.BadRequestException("invalid_date", "Ngày sản xuất không được vượt quá hiện tại");

            sanPham.TenSanPham = dto.TenSanPham;
            sanPham.Gia = dto.DonGia;
            sanPham.SoLuongTon = dto.SoLuongTon ?? sanPham.SoLuongTon;
            sanPham.ThoiGianBaoHanh = dto.ThoiGianBaoHanh;
            sanPham.NgaySanXuat = dto.NgaySanXuat;
            sanPham.MoTa = dto.MoTa;
            sanPham.MaDanhMuc = danhMucId;
            sanPham.MaNhaCungCap = nhaCungCapId;
            sanPham.MaKho = khoId;

            await _unitOfWork.GetRepository<SanPham>().UpdateAsync(sanPham);
            await _unitOfWork.SaveAsync();

            return MapToResponseDto(sanPham);
        }

        public async Task<SanPhamResponseDto?> DeleteSanPhamAsync(string id)
        {
            var guid = ParseGuidOrThrow(id, "invalid_id", "Mã sản phẩm không hợp lệ");
            var sanPham = await GetEntityOrThrowAsync<SanPham>(guid, "not_found", "Không tìm thấy sản phẩm");

            await _unitOfWork.GetRepository<SanPham>().DeleteAsync(sanPham);
            await _unitOfWork.SaveAsync();

            return MapToResponseDto(sanPham);
        }

        public async Task<PagedResult<SanPhamResponseDto>> SearchSanPhamAsync(
    string? keyword,
    string? maDanhMuc,
    string? maNhaCungCap,
    string? maKho,
    decimal? minPrice,
    decimal? maxPrice,
    string? sortBy = "TenSanPham", // TenSanPham | Gia
    bool ascending = true,
    int page = 1,
    int pageSize = 10)
        {
            var query = _unitOfWork.GetRepository<SanPham>()
                .Entities
                .Include(sp => sp.MaDanhMucNavigation)
                .Include(sp => sp.MaNhaCungCapNavigation)
                .Include(sp => sp.MaKhoNavigation)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(sp => sp.TenSanPham.ToLower().Contains(keyword));
            }

            if (Guid.TryParse(maDanhMuc, out var danhMucId))
                query = query.Where(sp => sp.MaDanhMuc == danhMucId);

            if (Guid.TryParse(maNhaCungCap, out var nhaCungCapId))
                query = query.Where(sp => sp.MaNhaCungCap == nhaCungCapId);

            if (Guid.TryParse(maKho, out var khoId))
                query = query.Where(sp => sp.MaKho == khoId);

            if (minPrice.HasValue)
                query = query.Where(sp => sp.Gia >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(sp => sp.Gia <= maxPrice.Value);

            // Sorting
            query = (sortBy?.ToLower(), ascending) switch
            {
                ("gia", true) => query.OrderBy(sp => sp.Gia),
                ("gia", false) => query.OrderByDescending(sp => sp.Gia),
                (_, true) => query.OrderBy(sp => sp.TenSanPham),
                _ => query.OrderByDescending(sp => sp.TenSanPham)
            };

            int totalRecords = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(sp => new SanPhamResponseDto
                {
                    Id = sp.Id.ToString(),
                    TenSanPham = sp.TenSanPham,
                    DonGia = sp.Gia,
                    SoLuongTon = sp.SoLuongTon,
                    ThoiGianBaoHanh = sp.ThoiGianBaoHanh,
                    NgaySanXuat = sp.NgaySanXuat,
                    MoTa = sp.MoTa ?? string.Empty,
                    TenDanhMuc = sp.MaDanhMucNavigation.TenDanhMuc,
                    TenNhaCungCap = sp.MaNhaCungCapNavigation.TenNhaCungCap,
                    TenKho = sp.MaKhoNavigation.TenKho
                })
                .ToListAsync();

            return new PagedResult<SanPhamResponseDto>
            {
                Items = items,
                TotalItems = totalRecords,
                Page = page,
                PageSize = pageSize
            };
        }

        private Guid ParseGuidOrThrow(string input, string errorKey, string errorMessage)
        {
            if (!Guid.TryParse(input, out var guid))
                throw new BaseException.BadRequestException(errorKey, errorMessage);
            return guid;
        }

        private async Task<T> GetEntityOrThrowAsync<T>(Guid id, string errorKey, string errorMessage) where T : class
        {
            var entity = await _unitOfWork.GetRepository<T>().GetByIdAsync(id);
            if (entity == null)
                throw new BaseException.NotFoundException(errorKey, errorMessage);
            return entity;
        }

        private SanPhamResponseDto MapToResponseDto(SanPham sp)
        {
            return new SanPhamResponseDto
            {
                Id = sp.Id.ToString(),
                TenSanPham = sp.TenSanPham,
                DonGia = sp.Gia,
                SoLuongTon = sp.SoLuongTon,
                ThoiGianBaoHanh = sp.ThoiGianBaoHanh,
                NgaySanXuat = sp.NgaySanXuat,
                MoTa = sp.MoTa ?? string.Empty,
                TenDanhMuc = sp.MaDanhMucNavigation?.TenDanhMuc ?? "",
                TenNhaCungCap = sp.MaNhaCungCapNavigation?.TenNhaCungCap ?? "",
                TenKho = sp.MaKhoNavigation?.TenKho ?? ""
            };
        }

    }
}

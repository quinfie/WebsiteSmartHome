using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.IServices;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;
using Microsoft.AspNetCore.Http;

namespace WebsiteSmartHome.Services
{
    public class SanPhamService : ISanPhamService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public SanPhamService(IUnitOfWork unitOfWork, IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _webHostEnvironment = webHostEnvironment ?? throw new ArgumentNullException(nameof(webHostEnvironment));
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
                MoTa = sp.MoTa!,
                img = sp.img
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
                TenKho = sanPham.MaKhoNavigation?.TenKho ?? string.Empty,
                img = sanPham.img
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
                MaKho = khoId,
                img = dto.img
            };

            await _unitOfWork.GetRepository<SanPham>().InsertAsync(sanPham);
            await _unitOfWork.SaveAsync();

            return MapToResponseDto(sanPham);
        }

        public async Task<SanPhamResponseDto?> UpdateSanPhamAsync(string id, SanPhamUpdateDto dto)
        {
            Guid guidId = ParseGuidOrThrow(id, "invalid_id", "Mã sản phẩm không hợp lệ");
            var danhMucId = ParseGuidOrThrow(dto.MaDanhMuc, "invalid_category", "Mã danh mục không hợp lệ");
            var nhaCungCapId = ParseGuidOrThrow(dto.MaNhaCungCap, "invalid_supplier", "Mã nhà cung cấp không hợp lệ");
            var khoId = ParseGuidOrThrow(dto.MaKho, "invalid_warehouse", "Mã kho không hợp lệ");

            var sanPham = await GetEntityOrThrowAsync<SanPham>(guidId, "not_found", "Không tìm thấy sản phẩm");
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

            // Cập nhật đường dẫn hình ảnh nếu có
            if (!string.IsNullOrEmpty(dto.img))
            {
                sanPham.img = dto.img;
            }

            await _unitOfWork.GetRepository<SanPham>().UpdateAsync(sanPham);
            await _unitOfWork.SaveAsync();

            return MapToResponseDto(sanPham);
        }

        public async Task<bool> DeleteSanPhamAsync(string id)
        {

            if (!Guid.TryParse(id, out var guid))
                throw new BaseException.BadRequestException("invalid_id", "Mã sản phẩm không hợp lệ");

            SanPham? sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(guid);

            if (sanPham == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy sản phẩm");

            _unitOfWork.GetRepository<SanPham>().Delete(sanPham);
            _unitOfWork.Save();
            return true;
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
                    TenKho = sp.MaKhoNavigation.TenKho,
                    img = sp.img
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
                TenKho = sp.MaKhoNavigation?.TenKho ?? "",
                img = sp.img
            };
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new BaseException.BadRequestException("invalid_file", "File không hợp lệ");
            }

            // Kiểm tra định dạng file
            string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
            string fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new BaseException.BadRequestException("invalid_file_type", "Chỉ hỗ trợ tải lên ảnh có định dạng JPG, JPEG, PNG hoặc GIF");
            }

            // Tạo tên file mới để tránh trùng lặp
            string fileName = $"{Guid.NewGuid()}{fileExtension}";

            // Đường dẫn lưu trữ
            string uploadFolder = Path.Combine(_webHostEnvironment.WebRootPath, "assets");

            // Tạo thư mục nếu chưa tồn tại
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            string filePath = Path.Combine(uploadFolder, fileName);

            // Lưu file vào thư mục
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về đường dẫn lưu trong DB
            return $"public/{fileName}";
        }

        public async Task<List<SanPhamResponseDto>> GetSuggestedProductsAsync(int limit = 4)
        {
            // Lấy sản phẩm mới nhất (hoặc random nếu muốn)
            var products = await _unitOfWork.GetRepository<SanPham>()
                .Entities
                .OrderByDescending(sp => sp.NgaySanXuat)
                .Take(limit)
                .ToListAsync();

            return products.Select(sp => MapToResponseDto(sp)).ToList();
        }

        public async Task<List<SanPhamResponseDto>> GetSuggestedProductsByOrderAsync(string orderId, int limit = 4)
        {
            if (!Guid.TryParse(orderId, out var guid))
                throw new BaseException.BadRequestException("invalid_id", "Mã đơn hàng không hợp lệ");

            // Lấy danh mục từ các sản phẩm trong đơn hàng và ID các sản phẩm trong đơn hàng
            var orderDetails = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .Entities
                .Include(ct => ct.MaSanPhamNavigation)
                .Where(ct => ct.MaDonHang == guid)
                .ToListAsync();

            var orderCategories = orderDetails
                .Where(ct => ct.MaSanPhamNavigation != null)
                .Select(ct => ct.MaSanPhamNavigation!.MaDanhMuc)
                .Distinct()
                .ToList();

            var orderProductIds = orderDetails
                .Where(ct => ct.MaSanPhamNavigation != null)
                .Select(ct => ct.MaSanPhamNavigation!.Id)
                .ToList();

            var suggestedProducts = new List<SanPham>();

            // 1. Lấy sản phẩm từ các danh mục tương tự (nếu có) và loại trừ sản phẩm đã mua
            if (orderCategories.Any())
            {
                var categorySuggestedProducts = await _unitOfWork.GetRepository<SanPham>()
                    .Entities
                    .Include(sp => sp.MaDanhMucNavigation)
                    .Include(sp => sp.MaNhaCungCapNavigation)
                    .Include(sp => sp.MaKhoNavigation)
                    .Where(sp => orderCategories.Contains(sp.MaDanhMuc) && !orderProductIds.Contains(sp.Id))
                    .OrderByDescending(sp => sp.NgaySanXuat) // Có thể đổi sang phổ biến nếu có
                    .Take(limit)
                    .ToListAsync();

                suggestedProducts.AddRange(categorySuggestedProducts);
            }

            // 2. Nếu chưa đủ số lượng, bổ sung bằng các sản phẩm mới nhất (hoặc phổ biến) không nằm trong đơn hàng
            if (suggestedProducts.Count < limit)
            {
                var remainingLimit = limit - suggestedProducts.Count;
                var fallbackProducts = await _unitOfWork.GetRepository<SanPham>()
                    .Entities
                    .Include(sp => sp.MaDanhMucNavigation)
                    .Include(sp => sp.MaNhaCungCapNavigation)
                    .Include(sp => sp.MaKhoNavigation)
                    .Where(sp => !orderProductIds.Contains(sp.Id) && !suggestedProducts.Select(s => s.Id).Contains(sp.Id)) // Loại bỏ cả sản phẩm đã có trong đơn và sản phẩm đã được thêm từ danh mục
                    .OrderByDescending(sp => sp.NgaySanXuat) // Lấy sản phẩm mới nhất
                    .Take(remainingLimit)
                    .ToListAsync();

                suggestedProducts.AddRange(fallbackProducts);
            }

            return suggestedProducts.Select(sp => MapToResponseDto(sp)).ToList();
        }
    }
}

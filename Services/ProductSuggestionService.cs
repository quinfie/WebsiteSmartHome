using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.Services
{
    public class ProductSuggestionService : IProductSuggestionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductSuggestionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<ProductSuggestionDto>> GetSuggestedProductsAsync(int count = 4)
        {
            var products = _unitOfWork.GetRepository<SanPham>()
                .GetAll()
                .OrderByDescending(p => p.NgaySanXuat)
                .Take(count)
                .Select(p => new ProductSuggestionDto
                {
                    Id = p.Id,
                    Name = p.TenSanPham,
                    Description = p.MoTa ?? string.Empty,
                    Price = p.Gia,
                    ImageUrl = p.img ?? string.Empty,
                    Category = p.MaDanhMucNavigation.TenDanhMuc,
                    Rating = 0, // Chưa có rating
                    ReviewCount = 0 // Chưa có review count
                })
                .ToList();

            return products;
        }

        public async Task<List<ProductSuggestionDto>> GetRelatedProductsAsync(Guid productId, int count = 4)
        {
            var currentProduct = await _unitOfWork.GetRepository<SanPham>()
                .GetByIdAsync(productId);

            if (currentProduct == null)
                return new List<ProductSuggestionDto>();

            var relatedProducts = _unitOfWork.GetRepository<SanPham>()
                .GetAll()
                .Where(p => p.MaDanhMuc == currentProduct.MaDanhMuc && p.Id != productId)
                .OrderByDescending(p => p.NgaySanXuat)
                .Take(count)
                .Select(p => new ProductSuggestionDto
                {
                    Id = p.Id,
                    Name = p.TenSanPham,
                    Description = p.MoTa ?? string.Empty,
                    Price = p.Gia,
                    ImageUrl = p.img ?? string.Empty,
                    Category = p.MaDanhMucNavigation.TenDanhMuc,
                    Rating = 0, // Chưa có rating
                    ReviewCount = 0 // Chưa có review count
                })
                .ToList();

            return relatedProducts;
        }

        public async Task<List<ProductSuggestionDto>> GetPopularProductsAsync(int count = 4)
        {
            var products = _unitOfWork.GetRepository<SanPham>()
                .GetAll()
                .OrderByDescending(p => p.SoLuongTon) // Sử dụng số lượng tồn làm tiêu chí phổ biến
                .Take(count)
                .Select(p => new ProductSuggestionDto
                {
                    Id = p.Id,
                    Name = p.TenSanPham,
                    Description = p.MoTa ?? string.Empty,
                    Price = p.Gia,
                    ImageUrl = p.img ?? string.Empty,
                    Category = p.MaDanhMucNavigation.TenDanhMuc,
                    Rating = 0, // Chưa có rating
                    ReviewCount = 0 // Chưa có review count
                })
                .ToList();

            return products;
        }

        public async Task<List<ProductSuggestionDto>> GetNewArrivalsAsync(int count = 4)
        {
            var products = _unitOfWork.GetRepository<SanPham>()
                .GetAll()
                .OrderByDescending(p => p.NgaySanXuat)
                .Take(count)
                .Select(p => new ProductSuggestionDto
                {
                    Id = p.Id,
                    Name = p.TenSanPham,
                    Description = p.MoTa ?? string.Empty,
                    Price = p.Gia,
                    ImageUrl = p.img ?? string.Empty,
                    Category = p.MaDanhMucNavigation.TenDanhMuc,
                    Rating = 0, // Chưa có rating
                    ReviewCount = 0 // Chưa có review count
                })
                .ToList();

            return products;
        }
    }
}
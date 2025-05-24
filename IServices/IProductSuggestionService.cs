using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IProductSuggestionService
    {
        Task<List<ProductSuggestionDto>> GetSuggestedProductsAsync(int count = 4);
        Task<List<ProductSuggestionDto>> GetRelatedProductsAsync(Guid productId, int count = 4);
        Task<List<ProductSuggestionDto>> GetPopularProductsAsync(int count = 4);
        Task<List<ProductSuggestionDto>> GetNewArrivalsAsync(int count = 4);
    }
}
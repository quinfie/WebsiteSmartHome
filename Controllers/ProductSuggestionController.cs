using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductSuggestionController : ControllerBase
    {
        private readonly IProductSuggestionService _suggestionService;
        private readonly ILogger<ProductSuggestionController> _logger;

        public ProductSuggestionController(
            IProductSuggestionService suggestionService,
            ILogger<ProductSuggestionController> logger)
        {
            _suggestionService = suggestionService;
            _logger = logger;
        }

        [HttpGet("suggested")]
        public async Task<ActionResult<BaseResponse<List<ProductSuggestionDto>>>> GetSuggestedProducts([FromQuery] int count = 4)
        {
            try
            {
                var products = await _suggestionService.GetSuggestedProductsAsync(count);
                return Ok(BaseResponse<List<ProductSuggestionDto>>.OkResponse(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting suggested products");
                return StatusCode(500, BaseResponse<List<ProductSuggestionDto>>.ErrorResponse("Có lỗi xảy ra khi lấy danh sách sản phẩm gợi ý"));
            }
        }

        [HttpGet("related/{productId}")]
        public async Task<ActionResult<BaseResponse<List<ProductSuggestionDto>>>> GetRelatedProducts(Guid productId, [FromQuery] int count = 4)
        {
            try
            {
                var products = await _suggestionService.GetRelatedProductsAsync(productId, count);
                return Ok(BaseResponse<List<ProductSuggestionDto>>.OkResponse(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting related products");
                return StatusCode(500, BaseResponse<List<ProductSuggestionDto>>.ErrorResponse("Có lỗi xảy ra khi lấy danh sách sản phẩm liên quan"));
            }
        }

        [HttpGet("popular")]
        public async Task<ActionResult<BaseResponse<List<ProductSuggestionDto>>>> GetPopularProducts([FromQuery] int count = 4)
        {
            try
            {
                var products = await _suggestionService.GetPopularProductsAsync(count);
                return Ok(BaseResponse<List<ProductSuggestionDto>>.OkResponse(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting popular products");
                return StatusCode(500, BaseResponse<List<ProductSuggestionDto>>.ErrorResponse("Có lỗi xảy ra khi lấy danh sách sản phẩm phổ biến"));
            }
        }

        [HttpGet("new-arrivals")]
        public async Task<ActionResult<BaseResponse<List<ProductSuggestionDto>>>> GetNewArrivals([FromQuery] int count = 4)
        {
            try
            {
                var products = await _suggestionService.GetNewArrivalsAsync(count);
                return Ok(BaseResponse<List<ProductSuggestionDto>>.OkResponse(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting new arrivals");
                return StatusCode(500, BaseResponse<List<ProductSuggestionDto>>.ErrorResponse("Có lỗi xảy ra khi lấy danh sách sản phẩm mới"));
            }
        }
    }
}
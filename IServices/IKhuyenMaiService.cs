using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IKhuyenMaiService
    {
        Task<List<KhuyenMaiDto>> GetAll();
        Task<List<KhuyenMaiDto>> GetValidPromotions(decimal cartTotal);
        Task<KhuyenMaiDto?> GetById(Guid id);
        Task<KhuyenMaiDto> Create(KhuyenMaiCreateDto khuyenMai);
        Task<KhuyenMaiDto?> Update(Guid id, KhuyenMaiUpdateDto khuyenMai);
        Task<bool> Delete(Guid id);
        Task<KhuyenMaiApplyDto> ApplyPromotion(decimal cartTotal, Guid promotionId);
    }
}
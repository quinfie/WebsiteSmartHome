using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface ILichBaoTriService
    {
        Task<List<LichBaoTriDto>> GetAllLichBaoTriAsync();
        Task<List<LichBaoTriDto>> SearchLichBaoTriByOrderAsync(Guid orderId);

        Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(Guid id);
        Task<bool> CreateLichBaoTriAsync(CreateLichBaoTriDto lichBaoTriDto);//DTO RIENG
        Task<bool> UpdateLichBaoTriAsync(Guid id, LichBaoTriDto lichBaoTriDto);
        Task<bool> DeleteLichBaoTriAsync(Guid id);
    }
}

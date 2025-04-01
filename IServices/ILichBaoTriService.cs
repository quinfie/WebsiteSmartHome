using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface ILichBaoTriService
    {
        Task<List<LichBaoTriDto>> GetAllLichBaoTriAsync();
        Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(Guid id);
        Task<bool> CreateLichBaoTriAsync(LichBaoTriDto lichBaoTriDto);
        Task<bool> UpdateLichBaoTriAsync(Guid id, LichBaoTriDto lichBaoTriDto);
        Task<bool> DeleteLichBaoTriAsync(Guid id);
    }
}

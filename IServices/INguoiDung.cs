using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface INguoiDungService
    {
        Task<NguoiDungCreateDto> AddNguoiDungAsync(NguoiDungCreateDto dto);
        Task<IEnumerable<NguoiDungDto>> GetAllNguoiDungAsync();
        Task<NguoiDungDto?> GetNguoiDungByIdAsync(string id);
        Task<IEnumerable<NguoiDungDto>> SearchNguoiDungAsync(string keyword);
    }

}

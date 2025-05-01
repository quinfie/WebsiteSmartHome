using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface INguoiDungService
    {
        Task<IEnumerable<NguoiDungDto>> GetAllNguoiDungAsync();
        Task<NguoiDungDto?> GetNguoiDungByIdAsync(string id);
        Task<NguoiDungDto> AddNguoiDungAsync(NguoiDungCreateDto dto);
        Task UpdateNguoiDungAsync(string id, NguoiDungUpdateDto dto);
        Task DeleteNguoiDungAsync(string id);
        Task<IEnumerable<NguoiDungDto>> SearchNguoiDungAsync(string keyword);
    }

}

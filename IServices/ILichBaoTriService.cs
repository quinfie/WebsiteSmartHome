using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;

namespace WebsiteSmartHome.IServices
{
    public interface ILichBaoTriService
    {
        Task<List<LichBaoTriDto>> GetAllLichBaoTriAsync();
        Task<List<LichBaoTriDto>> GetLichBaoTriByChiTietIdAsync(int chiTietId);
        Task<List<LichBaoTriDto>> GetLichBaoTriByDonHangIdAsync(string donHangId);

        Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(string id);
        Task<bool> CreateLichBaoTriAsync(CreateLichBaoTriDto lichBaoTriDto);//DTO RIENG
        Task<bool> UpdateLichBaoTriAsync(Guid id, LichBaoTriDto lichBaoTriDto);
        Task<bool> DeleteLichBaoTriAsync(Guid id);
        Task<bool> UpdateTrangThaiLichBaoTriAsync(Guid id, string trangThai);

        Task TaoLichBaoTriTuDonHangAsync(Guid maDonHang);
    }
}

using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IPhanCongDichVuService
    {
        Task<PhanCongDichVuDto> PhanCongAsync(CreatePhanCongDichVuDto dto, string quanLiId);
        Task<PhanCongDichVuDto> UpdateTrangThaiAsync(string phanCongId, string trangThai);
        Task<PhanCongDichVuDto> HoanThanhAsync(string phanCongId);
    }
}
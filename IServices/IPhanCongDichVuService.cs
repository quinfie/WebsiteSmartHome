using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IPhanCongDichVuService
    {
        Task<PhanCongDichVuDto> PhanCongAsync(CreatePhanCongDichVuDto dto);
        Task<PhanCongDichVuDto> UpdateTrangThaiAsync(string phanCongId, string trangThai);
        Task<PhanCongDichVuDto> HoanThanhAsync(string phanCongId);

        // Phương thức mới
        Task<List<PhanCongDichVuDto>> GetPhanCongByYeuCauAsync(string yeuCauId);
        Task<List<PhanCongDichVuDto>> GetPhanCongByKyThuatVienAsync(string kyThuatVienId);
        Task<List<PhanCongCalendarDto>> GetPhanCongCalendarByKyThuatVienAsync(string kyThuatVienId);
        Task<PhanCongCalendarDto?> GetPhanCongCalendarByIdAsync(string id);
    }
}
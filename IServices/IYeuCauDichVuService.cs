using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IYeuCauDichVuService
    {
        Task<YeuCauDichVuDto> TaoYeuCauAsync(CreateYeuCauDichVuDto dto, string khachHangId);
        Task<IEnumerable<YeuCauDichVuDto>> GetYeuCauByKhachHangAsync(string khachHangId);
        Task<YeuCauDichVuDto> GetByIdAsync(string id);
        Task<YeuCauDichVuDto> UpdateTrangThaiAsync(string id, string trangThai);
        Task<YeuCauDichVuDto> HuyYeuCauAsync(string id);
        Task<YeuCauDichVuDto> UpdateChiPhiAsync(string id, decimal chiPhi);
        Task<YeuCauDichVuDto> UpdateNgayXuLyAsync(string id, DateTime ngayXuLy);
        Task<YeuCauDichVuDto> UpdateTienDoAsync(string id, string tienDo);
        Task<YeuCauDichVuDto> UpdateKetQuaAsync(string id, string ketQua);
        Task<YeuCauDichVuDto> XacNhanYeuCauAsync(string yeuCauId, string quanLiId);
    }
}
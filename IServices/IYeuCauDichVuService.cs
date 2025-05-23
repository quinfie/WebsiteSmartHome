using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IYeuCauDichVuService
    {
        Task<YeuCauDichVuDto> TaoYeuCauAsync(CreateYeuCauDichVuDto dto, string khachHangId);
        Task<YeuCauDichVuDto> UpdateChiPhiAsync(string id, decimal chiPhi, string nhanVienId);
        Task<YeuCauDichVuDto> UpdateNgayXuLyAsync(string id, DateTime ngayXuLy);
        Task<YeuCauDichVuDto> UpdateMoTaAsync(string id, string moTa, bool isKetQua = false);
        Task<YeuCauDichVuDto> UpdateTrangThaiAsync(string id, string trangThai, DateTime? ngayXuLy);
        Task<YeuCauDichVuDto> HuyYeuCauAsync(string id);
        Task<YeuCauDichVuDto> XacNhanYeuCauAsync(string yeuCauId, string quanLiId);
        Task<List<YeuCauDichVuKhachHangDto>> GetYeuCauByKhachHangAsync(string khachHangId);
        Task<YeuCauDichVuDto> GetByIdAsync(string id);
        Task<YeuCauDichVuDto?> GetDetailedYeuCauByIdAsync(string id);

        // Các phương thức mới
        Task<List<YeuCauDichVuDto>> GetAllYeuCauAsync(string? trangThai = null, string? loaiDichVu = null);
        Task<List<YeuCauDichVuDto>> GetYeuCauChuaPhanCongAsync();
        Task<List<YeuCauDichVuDto>> GetYeuCauTheoKyThuatVienAsync(string kyThuatVienId);
        Task<int> CountYeuCauTheoTrangThaiAsync(string trangThai);
        Task<decimal> TinhTongChiPhiAsync(DateTime? tuNgay = null, DateTime? denNgay = null);

        // Phương thức xóa vĩnh viễn
        Task DeleteYeuCauAsync(string id);
    }
}
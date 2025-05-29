using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.IServices
{
    public interface IThongKeService
    {
        Task<List<ThongKeDonHangDto>> GetThongKeDonHang(DateTime startDate, DateTime endDate);
        Task<List<ThongKeSanPhamDto>> GetThongKeSanPham(DateTime startDate, DateTime endDate);
        Task<List<ThongKeDanhMucDto>> GetThongKeTheoDanhMuc(DateTime startDate, DateTime endDate);
        Task<List<ThongKeDichVuDto>> GetThongKeDichVu(DateTime startDate, DateTime endDate);
        Task<List<ThongKeDanhGiaDto>> GetThongKeDanhGia(DateTime startDate, DateTime endDate);
    }
} 
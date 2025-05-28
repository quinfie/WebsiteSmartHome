using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class ThongKeService : IThongKeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ThongKeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<ThongKeDonHangDto>> GetThongKeDonHang(DateTime startDate, DateTime endDate)
        {
            return await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(d => d.NgayDat >= startDate && d.NgayDat <= endDate)
                .GroupBy(d => d.NgayDat.Date)
                .Select(g => new ThongKeDonHangDto
                {
                    Ngay = g.Key,
                    SoDonHang = g.Count(),
                    TongTien = g.Sum(d => d.TongTien)
                })
                .OrderBy(d => d.Ngay)
                .ToListAsync();
        }

        public async Task<List<ThongKeSanPhamDto>> GetThongKeSanPham(DateTime startDate, DateTime endDate)
        {
            return await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(c => c.MaDonHangNavigation.NgayDat >= startDate && c.MaDonHangNavigation.NgayDat <= endDate)
                .Include(c => c.MaDonHangNavigation)
                .Include(c => c.MaSanPhamNavigation)
                .GroupBy(c => c.MaSanPhamNavigation.TenSanPham)
                .Select(g => new ThongKeSanPhamDto
                {
                    TenSanPham = g.Key,
                    SoLuongBan = g.Sum(c => c.SoLuong),
                    DoanhThu = g.Sum(c => c.SoLuong * c.DonGia)
                })
                .OrderByDescending(x => x.SoLuongBan)
                .Take(10)
                .ToListAsync();
        }

        public async Task<List<ThongKeDanhMucDto>> GetThongKeTheoDanhMuc(DateTime startDate, DateTime endDate)
        {
            var query = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(c => c.MaDonHangNavigation.NgayDat >= startDate && c.MaDonHangNavigation.NgayDat <= endDate)
                .Include(c => c.MaDonHangNavigation)
                .Include(c => c.MaSanPhamNavigation)
                    .ThenInclude(s => s.MaDanhMucNavigation)
                .ToListAsync();

            var result = query
                .GroupBy(c => new { 
                    TenDanhMuc = c.MaSanPhamNavigation.MaDanhMucNavigation.TenDanhMuc,
                    MaDanhMuc = c.MaSanPhamNavigation.MaDanhMucNavigation.Id
                })
                .Select(g => new ThongKeDanhMucDto
                {
                    TenDanhMuc = g.Key.TenDanhMuc,
                    SoLuongSanPham = g.Sum(c => c.SoLuong),
                    TongTien = g.Sum(c => c.SoLuong * c.DonGia)
                })
                .OrderByDescending(x => x.SoLuongSanPham)
                .ToList();

            return result;
        }

        public async Task<List<ThongKeDichVuDto>> GetThongKeDichVu(DateTime startDate, DateTime endDate)
        {
            var startDateOnly = DateOnly.FromDateTime(startDate);
            var endDateOnly = DateOnly.FromDateTime(endDate);

            return await _unitOfWork.GetRepository<YeuCauDichVu>()
                .GetEntitiesWithCondition(y => y.NgayHen >= startDateOnly && y.NgayHen <= endDateOnly)
                .GroupBy(y => y.LoaiDichVu)
                .Select(g => new ThongKeDichVuDto
                {
                    LoaiDichVu = g.Key,
                    SoLuong = g.Count(),
                    TongTien = g.Sum(y => y.ChiPhiYeuCau)
                })
                .OrderByDescending(x => x.SoLuong)
                .ToListAsync();
        }

        public async Task<List<ThongKeDanhGiaDto>> GetThongKeDanhGia(DateTime startDate, DateTime endDate)
        {
            return await _unitOfWork.GetRepository<DanhGia>()
                .GetEntitiesWithCondition(d => d.NgayDanhGia >= startDate && d.NgayDanhGia <= endDate)
                .GroupBy(d => d.SoSao)
                .Select(g => new ThongKeDanhGiaDto
                {
                    Rating = g.Key,
                    SoLuong = g.Count()
                })
                .OrderBy(x => x.Rating)
                .ToListAsync();
        }
    }
} 
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Services
{
    public class ChiTietDonHangService : IChiTietDonHangService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ChiTietDonHangService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<ChiTietDonHangDto>> GetAllChiTietDonHangAsync()
        {
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>().GetAllAsync();
            return chiTietDonHangs.Select(c => new ChiTietDonHangDto
            {
                MaDonHang = c.MaDonHang.ToString(),
                MaSanPham = c.MaSanPham.ToString(),
                SoLuong = c.SoLuong,
                DonGia = c.DonGia
            }).ToList();
        }

        public async Task<ChiTietDonHangDto?> GetChiTietDonHangByIdAsync(Guid maDonHang, Guid maSanPham)
        {
            var chiTiet = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByCondition(x => x.MaDonHang == maDonHang && x.MaSanPham == maSanPham)
                .FirstOrDefaultAsync();

            if (chiTiet == null)
                return null;

            return new ChiTietDonHangDto
            {
                MaDonHang = chiTiet.MaDonHang.ToString(),
                MaSanPham = chiTiet.MaSanPham.ToString(),
                SoLuong = chiTiet.SoLuong,
                DonGia = chiTiet.DonGia
            };
        }

        public async Task<bool> CreateChiTietDonHangAsync(ChiTietDonHangDto dto)
        {
            if (!Guid.TryParse(dto.MaDonHang, out var maDonHangGuid) ||
                !Guid.TryParse(dto.MaSanPham, out var maSanPhamGuid))
            {
                return false;
            }

            var chiTiet = new ChiTietDonHang
            {
                MaDonHang = maDonHangGuid,
                MaSanPham = maSanPhamGuid,
                SoLuong = dto.SoLuong,
                DonGia = dto.DonGia
            };

            try
            {
                await _unitOfWork.GetRepository<ChiTietDonHang>().InsertAsync(chiTiet);
                await _unitOfWork.SaveAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> UpdateChiTietDonHangAsync(Guid maDonHang, Guid maSanPham, ChiTietDonHangDto dto)
        {
            var chiTiet = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByCondition(x => x.MaDonHang == maDonHang && x.MaSanPham == maSanPham)
                .FirstOrDefaultAsync();

            if (chiTiet == null)
                return false;

            chiTiet.SoLuong = dto.SoLuong;
            chiTiet.DonGia = dto.DonGia;

            try
            {
                _unitOfWork.GetRepository<ChiTietDonHang>().Update(chiTiet);
                await _unitOfWork.SaveAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteChiTietDonHangAsync(Guid maDonHang, Guid maSanPham)
        {
            var chiTiet = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByCondition(x => x.MaDonHang == maDonHang && x.MaSanPham == maSanPham)
                .FirstOrDefaultAsync();

            if (chiTiet == null)
                return false;

            try
            {
                _unitOfWork.GetRepository<ChiTietDonHang>().Delete(chiTiet);
                await _unitOfWork.SaveAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<ChiTietDonHangDto>> SearchChiTietDonHangByNameAsync(string name)
        {
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByCondition(ct => ct.MaSanPhamNavigation.TenSanPham.ToLower().Contains(name.ToLower()))
                .Select(ct => new ChiTietDonHangDto
                {
                    MaDonHang = ct.MaDonHang.ToString(),
                    MaSanPham = ct.MaSanPham.ToString(),
                    SoLuong = ct.SoLuong,
                    DonGia = ct.DonGia
                })
                .ToListAsync();

            return chiTietDonHangs;
        }
    }
}

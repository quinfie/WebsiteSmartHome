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
                MaDonHang = c.MaDonHang,
                MaSanPham = c.MaSanPham,
                SoLuong = c.SoLuong,
                DonGia = c.DonGia
            }).ToList();
        }

        public async Task<ChiTietDonHangDto?> GetChiTietDonHangByIdAsync(Guid id)
        {
            var chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>().GetByIdAsync(id);
            if (chiTietDonHang == null)
                return null;

            return new ChiTietDonHangDto
            {
                MaDonHang = chiTietDonHang.MaDonHang,
                MaSanPham = chiTietDonHang.MaSanPham,
                SoLuong = chiTietDonHang.SoLuong,
                DonGia = chiTietDonHang.DonGia
            };
        }

        public async Task<bool> CreateChiTietDonHangAsync(ChiTietDonHangDto chiTietDonHangDto)
        {
            var chiTietDonHang = new ChiTietDonHang
            {
                MaDonHang = chiTietDonHangDto.MaDonHang,
                MaSanPham = chiTietDonHangDto.MaSanPham,
                SoLuong = chiTietDonHangDto.SoLuong,
                DonGia = chiTietDonHangDto.DonGia
            };

            await _unitOfWork.GetRepository<ChiTietDonHang>().InsertAsync(chiTietDonHang);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateChiTietDonHangAsync(Guid id, ChiTietDonHangDto chiTietDonHangDto)
        {
            var chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>().GetByIdAsync(id);
            if (chiTietDonHang == null)
                return false;

            chiTietDonHang.MaSanPham = chiTietDonHangDto.MaSanPham;
            chiTietDonHang.SoLuong = chiTietDonHangDto.SoLuong;
            chiTietDonHang.DonGia = chiTietDonHangDto.DonGia;

            _unitOfWork.GetRepository<ChiTietDonHang>().Update(chiTietDonHang);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteChiTietDonHangAsync(Guid id)
        {
            var chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>().GetByIdAsync(id);
            if (chiTietDonHang == null)
                return false;

            await _unitOfWork.GetRepository<ChiTietDonHang>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }
        public async Task<List<ChiTietDonHangDto>> SearchChiTietDonHangByNameAsync(string name)
        {
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByCondition(ct => ct.SanPham.TenSanPham.Contains(name))  // Truy vấn thuộc tính TenSanPham của SanPham
                .Select(ct => new ChiTietDonHangDto
                {
                    MaDonHang = ct.MaDonHang,
                    MaSanPham = ct.MaSanPham,
                    SoLuong = ct.SoLuong,
                    DonGia = ct.DonGia
                })
                .ToListAsync();

            return chiTietDonHangs;
        }



    }
}

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
<<<<<<< HEAD
                MaDonHang = c.MaDonHang.ToString(),
                MaSanPham = c.MaSanPham.ToString(),
=======
<<<<<<< HEAD
<<<<<<< HEAD
                MaDonHang = c.MaDonHang.ToString(),
                MaSanPham = c.MaSanPham.ToString(),
=======
                MaDonHang = c.MaDonHang,
                MaSanPham = c.MaSanPham,
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
                MaDonHang = c.MaDonHang,
                MaSanPham = c.MaSanPham,
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
                SoLuong = c.SoLuong,
                DonGia = c.DonGia
            }).ToList();
        }

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> main
        public async Task<ChiTietDonHangDto?> GetChiTietDonHangByIdAsync(Guid maDonHang, Guid maSanPham)
        {
            var chiTiet = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByCondition(x => x.MaDonHang == maDonHang && x.MaSanPham == maSanPham)
                .FirstOrDefaultAsync();

            if (chiTiet == null)
<<<<<<< HEAD
=======
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        public async Task<ChiTietDonHangDto?> GetChiTietDonHangByIdAsync(Guid id)
        {
            var chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>().GetByIdAsync(id);
            if (chiTietDonHang == null)
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
                return null;

            return new ChiTietDonHangDto
            {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> main
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
<<<<<<< HEAD
=======
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
                    SoLuong = ct.SoLuong,
                    DonGia = ct.DonGia
                })
                .ToListAsync();

            return chiTietDonHangs;
        }
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======



>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======



>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
    }
}

using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.Services;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class DonHangService : IDonHangService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DonHangService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<DonHangDto>> GetAllDonHangAsync()
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>().GetAllAsync();
            return donHangs.Select(dh => new DonHangDto
            {
                Id = dh.Id.ToString(),
                MaNguoiDung = dh.MaNguoiDung.ToString(),
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                MaKhuyenMai = dh.MaKhuyenMai?.ToString()
            }).ToList();
        }

        public async Task<DonHangDto?> GetDonHangByIdAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid guidId))
                return null;

            var donHang = await _unitOfWork.GetRepository<DonHang>().FindByConditionWithIncludesAsync(
                dh => dh.Id == guidId,
                dh => dh.ChiTietDonHangs
            );

            if (donHang == null) return null;

            return new DonHangDto
            {
                Id = donHang.Id.ToString(),
                MaNguoiDung = donHang.MaNguoiDung.ToString(),
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                NgayDat = donHang.NgayDat,
                MaKhuyenMai = donHang.MaKhuyenMai?.ToString()
            };
        }

        public async Task<List<DonHangDto>> SearchDonHangAsync(string trangThai)
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>().GetEntitiesWithCondition(
                dh => dh.TrangThaiDonHang.Contains(trangThai)
            ).ToListAsync();

            return donHangs.Select(dh => new DonHangDto
            {
                Id = dh.Id.ToString(),
                MaNguoiDung = dh.MaNguoiDung.ToString(),
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                MaKhuyenMai = dh.MaKhuyenMai?.ToString()
            }).ToList();
        }

        public async Task<bool> CreateDonHangAsync(DonHangDto donHangDto)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var donHang = new DonHang
                {
                    Id = Guid.NewGuid(),
                    MaNguoiDung = Guid.Parse(donHangDto.MaNguoiDung),
                    TongTien = donHangDto.TongTien,
                    TrangThaiDonHang = donHangDto.TrangThaiDonHang,
                    NgayDat = DateTime.UtcNow,
                    MaKhuyenMai = string.IsNullOrWhiteSpace(donHangDto.MaKhuyenMai)
                        ? null
                        : Guid.Parse(donHangDto.MaKhuyenMai)
                };

                await _unitOfWork.GetRepository<DonHang>().InsertAsync(donHang);
                await _unitOfWork.SaveAsync();

                _unitOfWork.CommitTransaction();
                return true;
            }
            catch
            {
                _unitOfWork.RollBack();
                return false;
            }
        }

        public async Task<bool> UpdateDonHangAsync(string id, DonHangDto donHangDto)
        {
            if (!Guid.TryParse(id, out Guid guidId)) return false;

            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(guidId);
            if (donHang == null) return false;

            donHang.TrangThaiDonHang = donHangDto.TrangThaiDonHang;
            donHang.MaKhuyenMai = string.IsNullOrWhiteSpace(donHangDto.MaKhuyenMai)
                ? null
                : Guid.Parse(donHangDto.MaKhuyenMai);

            _unitOfWork.GetRepository<DonHang>().Update(donHang);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteDonHangAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid guidId)) return false;

            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(guidId);
            if (donHang == null) return false;

            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaDonHang == guidId).ToListAsync();

            foreach (var chiTiet in chiTietDonHangs)
            {
                _unitOfWork.GetRepository<ChiTietDonHang>().Delete(chiTiet);
            }

            _unitOfWork.GetRepository<DonHang>().Delete(donHang);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}

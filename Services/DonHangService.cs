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

<<<<<<< HEAD
=======
        // Lấy tất cả đơn hàng
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        public async Task<List<DonHangDto>> GetAllDonHangAsync()
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>().GetAllAsync();
            return donHangs.Select(dh => new DonHangDto
            {
<<<<<<< HEAD
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
=======
                Id = dh.Id,
                MaNguoiDung = dh.MaNguoiDung,
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                MaKhuyenMai = dh.MaKhuyenMai
            }).ToList();
        }

        // Tìm đơn hàng theo ID
        public async Task<DonHangDto?> GetDonHangByIdAsync(Guid id)
        {
            var donHang = await _unitOfWork.GetRepository<DonHang>().FindByConditionWithIncludesAsync(
                dh => dh.Id == id,
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
                dh => dh.ChiTietDonHangs
            );

            if (donHang == null) return null;

            return new DonHangDto
            {
<<<<<<< HEAD
                Id = donHang.Id.ToString(),
                MaNguoiDung = donHang.MaNguoiDung.ToString(),
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                NgayDat = donHang.NgayDat,
                MaKhuyenMai = donHang.MaKhuyenMai?.ToString()
            };
        }

=======
                Id = donHang.Id,
                MaNguoiDung = donHang.MaNguoiDung,
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                NgayDat = donHang.NgayDat,
                MaKhuyenMai = donHang.MaKhuyenMai
            };
        }

        // Tìm kiếm theo trạng thái đơn hàng
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        public async Task<List<DonHangDto>> SearchDonHangAsync(string trangThai)
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>().GetEntitiesWithCondition(
                dh => dh.TrangThaiDonHang.Contains(trangThai)
            ).ToListAsync();

            return donHangs.Select(dh => new DonHangDto
            {
<<<<<<< HEAD
                Id = dh.Id.ToString(),
                MaNguoiDung = dh.MaNguoiDung.ToString(),
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                MaKhuyenMai = dh.MaKhuyenMai?.ToString()
=======
                Id = dh.Id,
                MaNguoiDung = dh.MaNguoiDung,
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                MaKhuyenMai = dh.MaKhuyenMai
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            }).ToList();
        }

        public async Task<bool> CreateDonHangAsync(DonHangDto donHangDto)
        {
<<<<<<< HEAD
=======
            // Bắt đầu transaction
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            _unitOfWork.BeginTransaction();

            try
            {
                var donHang = new DonHang
                {
                    Id = Guid.NewGuid(),
<<<<<<< HEAD
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

=======
                    MaNguoiDung = donHangDto.MaNguoiDung,
                    TongTien = donHangDto.TongTien, // Chỉ lấy tổng tiền từ DTO
                    TrangThaiDonHang = donHangDto.TrangThaiDonHang,
                    NgayDat = DateTime.UtcNow,
                    MaKhuyenMai = donHangDto.MaKhuyenMai
                };

                // Thêm vào bảng DonHang
                await _unitOfWork.GetRepository<DonHang>().InsertAsync(donHang);
                await _unitOfWork.SaveAsync();

                // Commit transaction
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
                _unitOfWork.CommitTransaction();
                return true;
            }
            catch
            {
<<<<<<< HEAD
=======
                // Rollback transaction nếu có lỗi
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
                _unitOfWork.RollBack();
                return false;
            }
        }

<<<<<<< HEAD
        public async Task<bool> UpdateDonHangAsync(string id, DonHangDto donHangDto)
        {
            if (!Guid.TryParse(id, out Guid guidId)) return false;

            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(guidId);
            if (donHang == null) return false;

            donHang.TrangThaiDonHang = donHangDto.TrangThaiDonHang;
            donHang.MaKhuyenMai = string.IsNullOrWhiteSpace(donHangDto.MaKhuyenMai)
                ? null
                : Guid.Parse(donHangDto.MaKhuyenMai);
=======


        // Cập nhật đơn hàng
        public async Task<bool> UpdateDonHangAsync(Guid id, DonHangDto donHangDto)
        {
            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(id);
            if (donHang == null) return false;

            donHang.TrangThaiDonHang = donHangDto.TrangThaiDonHang;
            donHang.MaKhuyenMai = donHangDto.MaKhuyenMai;
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

            _unitOfWork.GetRepository<DonHang>().Update(donHang);
            await _unitOfWork.SaveAsync();
            return true;
        }

<<<<<<< HEAD
        public async Task<bool> DeleteDonHangAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid guidId)) return false;

            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(guidId);
            if (donHang == null) return false;

            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaDonHang == guidId).ToListAsync();
=======
        // Xóa đơn hàng (Xóa cả `ChiTietDonHang`)
        public async Task<bool> DeleteDonHangAsync(Guid id)
        {
            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(id);
            if (donHang == null) return false;

            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaDonHang == id).ToListAsync();
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

            foreach (var chiTiet in chiTietDonHangs)
            {
                _unitOfWork.GetRepository<ChiTietDonHang>().Delete(chiTiet);
            }

            _unitOfWork.GetRepository<DonHang>().Delete(donHang);
            await _unitOfWork.SaveAsync();
            return true;
        }
<<<<<<< HEAD
=======


>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
    }
}

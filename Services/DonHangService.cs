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

        // Lấy tất cả đơn hàng
        public async Task<List<DonHangDto>> GetAllDonHangAsync()
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>().GetAllAsync();
            return donHangs.Select(dh => new DonHangDto
            {
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
                dh => dh.ChiTietDonHangs
            );

            if (donHang == null) return null;

            return new DonHangDto
            {
                Id = donHang.Id,
                MaNguoiDung = donHang.MaNguoiDung,
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                NgayDat = donHang.NgayDat,
                MaKhuyenMai = donHang.MaKhuyenMai
            };
        }

        // Tìm kiếm theo trạng thái đơn hàng
        public async Task<List<DonHangDto>> SearchDonHangAsync(string trangThai)
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>().GetEntitiesWithCondition(
                dh => dh.TrangThaiDonHang.Contains(trangThai)
            ).ToListAsync();

            return donHangs.Select(dh => new DonHangDto
            {
                Id = dh.Id,
                MaNguoiDung = dh.MaNguoiDung,
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                MaKhuyenMai = dh.MaKhuyenMai
            }).ToList();
        }

        public async Task<bool> CreateDonHangAsync(DonHangDto donHangDto)
        {
            // Bắt đầu transaction
            _unitOfWork.BeginTransaction();

            try
            {
                var donHang = new DonHang
                {
                    Id = Guid.NewGuid(),
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
                _unitOfWork.CommitTransaction();
                return true;
            }
            catch
            {
                // Rollback transaction nếu có lỗi
                _unitOfWork.RollBack();
                return false;
            }
        }



        // Cập nhật đơn hàng
        public async Task<bool> UpdateDonHangAsync(Guid id, DonHangDto donHangDto)
        {
            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(id);
            if (donHang == null) return false;

            donHang.TrangThaiDonHang = donHangDto.TrangThaiDonHang;
            donHang.MaKhuyenMai = donHangDto.MaKhuyenMai;

            _unitOfWork.GetRepository<DonHang>().Update(donHang);
            await _unitOfWork.SaveAsync();
            return true;
        }

        // Xóa đơn hàng (Xóa cả `ChiTietDonHang`)
        public async Task<bool> DeleteDonHangAsync(Guid id)
        {
            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(id);
            if (donHang == null) return false;

            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaDonHang == id).ToListAsync();

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

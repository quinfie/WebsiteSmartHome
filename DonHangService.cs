using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;
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

        // Lấy danh sách tất cả đơn hàng và chuyển sang dạng DonHangDto
        public async Task<List<DonHangDto>> GetAllDonHangAsync()
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>().GetAllAsync();
            return donHangs.Select(dh => new DonHangDto
            {
                MaNguoiDung = dh.MaNguoiDung.ToString(),
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                MaKhuyenMai = dh.MaKhuyenMai?.ToString()
            }).ToList();
        }

        // Lấy đơn hàng theo ID kèm theo chi tiết đơn hàng
        public async Task<DonHangDto?> GetDonHangByIdAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid guidId))
                return null;

            var donHang = await _unitOfWork.GetRepository<DonHang>().FindByConditionWithIncludesAsync(
                dh => dh.Id == guidId,
                dh => dh.ChiTietDonHangs // include chi tiết đơn hàng
            );

            if (donHang == null) return null;

            return new DonHangDto
            {
                MaNguoiDung = donHang.MaNguoiDung.ToString(),
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                NgayDat = donHang.NgayDat,
                MaKhuyenMai = donHang.MaKhuyenMai?.ToString()
            };
        }

        // Tìm kiếm đơn hàng theo trạng thái
        public async Task<List<DonHangDto>> SearchDonHangAsync(string trangThai)
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>().GetEntitiesWithCondition(
                dh => dh.TrangThaiDonHang.Contains(trangThai)
            ).ToListAsync();

            return donHangs.Select(dh => new DonHangDto
            {
                MaNguoiDung = dh.MaNguoiDung.ToString(),
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                MaKhuyenMai = dh.MaKhuyenMai?.ToString()
            }).ToList();
        }

        // Tạo đơn hàng mới
        public async Task<bool> CreateDonHangAsync(CreateDonHangDto createDto)
        {
            if (createDto == null)
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu không hợp lệ");

            // Tạo đơn hàng
            var donHang = new DonHang
            {
                Id = Guid.NewGuid(),
                MaNguoiDung = Guid.Parse(createDto.MaNguoiDung),
                TongTien = createDto.TongTien,
                TrangThaiDonHang = createDto.TrangThaiDonHang,
                NgayDat = DateTime.UtcNow, // thời gian đặt hàng là thời điểm hiện tại
                MaKhuyenMai = string.IsNullOrWhiteSpace(createDto.MaKhuyenMai) ? null : Guid.Parse(createDto.MaKhuyenMai)
            };

            // Lưu đơn hàng vào cơ sở dữ liệu
            await _unitOfWork.GetRepository<DonHang>().InsertAsync(donHang);
            await _unitOfWork.SaveAsync();

            // Tạo chi tiết đơn hàng
            var chiTietDonHang = new ChiTietDonHang
            {
                MaDonHang = donHang.Id,
                MaSanPham = Guid.Parse(createDto.MaSanPham),  // Lấy MaSanPham từ DTO
                SoLuong = createDto.SoLuong,
                DonGia = await GetDonGiaSanPhamAsync(createDto.MaSanPham) // Lấy giá từ bảng SanPham
            };

            // Tính tổng tiền chi tiết đơn hàng và cập nhật lại tổng tiền đơn hàng
            donHang.TongTien += chiTietDonHang.DonGia * chiTietDonHang.SoLuong;

            // Lưu chi tiết đơn hàng
            await _unitOfWork.GetRepository<ChiTietDonHang>().InsertAsync(chiTietDonHang);
            await _unitOfWork.SaveAsync();

            return true;
        }

        // Phương thức lấy giá của sản phẩm từ bảng SanPham
        private async Task<decimal> GetDonGiaSanPhamAsync(string maSanPham)
        {
            var sanPham = await _unitOfWork.GetRepository<SanPham>().FindByConditionAsync(sp => sp.Id == Guid.Parse(maSanPham));
            if (sanPham == null)
                throw new BaseException.BadRequestException("product_not_found", "Sản phẩm không tồn tại");

            return sanPham.Gia;
        }


        // Cập nhật đơn hàng theo ID
        public async Task<bool> UpdateDonHangAsync(string id, UpdateDonHangDto updateDto)
        {
            if (!Guid.TryParse(id, out Guid guidId))
                throw new BaseException.BadRequestException("invalid_id", "ID không hợp lệ");

            var donHang = await _unitOfWork.GetRepository<DonHang>().FindByConditionAsync(dh => dh.Id == guidId);
            if (donHang == null)
                return false;

            donHang.TongTien = updateDto.TongTien;
            donHang.TrangThaiDonHang = updateDto.TrangThaiDonHang;
            donHang.MaKhuyenMai = string.IsNullOrWhiteSpace(updateDto.MaKhuyenMai) ? null : Guid.Parse(updateDto.MaKhuyenMai);

            await _unitOfWork.SaveAsync();
            return true;
        }

        // Xóa đơn hàng và các chi tiết liên quan
        public async Task<bool> DeleteDonHangAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid guidId)) return false;

            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(guidId);
            if (donHang == null) return false;

            // Xóa các chi tiết đơn hàng trước
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaDonHang == guidId).ToListAsync();

            foreach (var chiTiet in chiTietDonHangs)
            {
                _unitOfWork.GetRepository<ChiTietDonHang>().Delete(chiTiet);
            }

            // Sau đó xóa đơn hàng chính
            _unitOfWork.GetRepository<DonHang>().Delete(donHang);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}

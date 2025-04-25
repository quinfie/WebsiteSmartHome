using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Services
{
    // Service triển khai các chức năng liên quan đến Chi Tiết Đơn Hàng
    public class ChiTietDonHangService : IChiTietDonHangService
    {
        private readonly IUnitOfWork _unitOfWork;

        // Inject UnitOfWork để thao tác dữ liệu
        public ChiTietDonHangService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // Lấy toàn bộ danh sách chi tiết đơn hàng
        public async Task<List<ChiTietDonHangDto>> GetAllChiTietDonHangAsync()
        {
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>().GetAllAsync();

            // Chuyển đổi sang DTO trước khi trả về
            return chiTietDonHangs.Select(c => new ChiTietDonHangDto
            {
                MaDonHang = c.MaDonHang.ToString(),
                MaSanPham = c.MaSanPham.ToString(),
                SoLuong = c.SoLuong,
                DonGia = c.DonGia
            }).ToList();
        }

        // Lấy chi tiết đơn hàng theo ID (kết hợp của MaDonHang và MaSanPham)
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

        // Tạo mới chi tiết đơn hàng
        public async Task<bool> CreateChiTietDonHangAsync(CreateChiTietDonHangDto dto)
        {
            // Kiểm tra và parse các ID hợp lệ
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
                // Thêm vào database
                await _unitOfWork.GetRepository<ChiTietDonHang>().InsertAsync(chiTiet);
                await _unitOfWork.SaveAsync();
                return true;
            }
            catch
            {
                // Bắt lỗi nếu có
                return false;
            }
        }

        // Cập nhật chi tiết đơn hàng theo khóa chính kép
        public async Task<bool> UpdateChiTietDonHangAsync(Guid maDonHang, Guid maSanPham, UpdateChiTietDonHangDto dto)
        {
            var chiTiet = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByCondition(x => x.MaDonHang == maDonHang && x.MaSanPham == maSanPham)
                .FirstOrDefaultAsync();

            if (chiTiet == null)
                return false;

            // Cập nhật dữ liệu
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

        // Xóa chi tiết đơn hàng
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

        // Tìm kiếm chi tiết đơn hàng theo tên sản phẩm
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

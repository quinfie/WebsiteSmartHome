using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;

namespace WebsiteSmartHome.Services
{
    public class LichBaoTriService : ILichBaoTriService
    {
        private readonly IUnitOfWork _unitOfWork;

        public LichBaoTriService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 1. Lấy tất cả
        public async Task<List<LichBaoTriDto>> GetAllLichBaoTriAsync()
        {
            var list = await _unitOfWork.GetRepository<LichBaoTri>()
                                        .GetAllAsync();

            return list.Select(e => new LichBaoTriDto
            {
                Id = e.Id.ToString(),
                MaChiTietDonHang = e.MaChiTietDonHang,
                NgayBaoTri = e.NgayBaoTri,
                LoaiBaoTri = e.LoaiBaoTri,
                TrangThai = e.TrangThai
            }).ToList();
        }

        // 2. Tìm theo MaChiTietDonHang (theo interface gọi là SearchLichBaoTriByOrderAsync)
        public async Task<List<LichBaoTriDto>> SearchLichBaoTriByOrderAsync(Guid orderId)
        {
            // Lấy các LichBaoTri mà ChiTietDonHang.MaDonHang == orderId
            var items = await _unitOfWork.GetRepository<LichBaoTri>()
                .GetEntitiesWithCondition(
                    lb => lb.ChiTietDonHang.MaDonHang == orderId,
                    lb => lb.ChiTietDonHang  // include ChiTietDonHang để truy vấn MaDonHang
                )
                .ToListAsync();

            return items.Select(e => new LichBaoTriDto
            {
                Id = e.Id.ToString(),
                MaChiTietDonHang = e.MaChiTietDonHang,
                NgayBaoTri = e.NgayBaoTri,
                LoaiBaoTri = e.LoaiBaoTri,
                TrangThai = e.TrangThai
            }).ToList();
        }

        // 3. Lấy theo Id
        public async Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(Guid id)
        {
            var e = await _unitOfWork.GetRepository<LichBaoTri>()
                                     .GetByIdAsync(id);
            if (e == null) return null;

            return new LichBaoTriDto
            {
                Id = e.Id.ToString(),
                MaChiTietDonHang = e.MaChiTietDonHang,
                NgayBaoTri = e.NgayBaoTri,
                LoaiBaoTri = e.LoaiBaoTri,
                TrangThai = e.TrangThai
            };
        }

        // 4. Tạo mới
        public async Task<bool> CreateLichBaoTriAsync(CreateLichBaoTriDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            var e = new LichBaoTri
            {
                Id = Guid.NewGuid(),
                MaChiTietDonHang = dto.MaChiTietDonHang,
                NgayBaoTri = dto.NgayBaoTri,
                LoaiBaoTri = dto.LoaiBaoTri,
                TrangThai = dto.TrangThai
            };

            await _unitOfWork.GetRepository<LichBaoTri>().InsertAsync(e);
            await _unitOfWork.SaveAsync();
            return true;
        }

        // 5. Cập nhật (theo interface, nhận LichBaoTriDto)
        public async Task<bool> UpdateLichBaoTriAsync(Guid id, LichBaoTriDto dto)
        {
            var e = await _unitOfWork.GetRepository<LichBaoTri>()
                                     .GetByIdAsync(id);
            if (e == null) return false;

            // Cập nhật tất cả các trường phù hợp
            e.MaChiTietDonHang = dto.MaChiTietDonHang;
            e.NgayBaoTri = dto.NgayBaoTri;
            e.LoaiBaoTri = dto.LoaiBaoTri;
            e.TrangThai = dto.TrangThai;

            _unitOfWork.GetRepository<LichBaoTri>().Update(e);
            await _unitOfWork.SaveAsync();
            return true;
        }

        // 6. Xóa theo Id
        public async Task<bool> DeleteLichBaoTriAsync(Guid id)
        {
            var e = await _unitOfWork.GetRepository<LichBaoTri>()
                                     .GetByIdAsync(id);
            if (e == null) return false;

            await _unitOfWork.GetRepository<LichBaoTri>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task ThemLichBaoTriAsync(List<ChiTietDonHang> chiTietDonHangs)
        {
            foreach (var chiTietDonHang in chiTietDonHangs)
            {
                var maSanPham = chiTietDonHang.MaSanPham;

                // Lấy thông tin sản phẩm từ bảng SanPham
                var sanPham = await _unitOfWork.GetRepository<SanPham>()
                    .FindByConditionAsync(x => x.Id == maSanPham);

                if (sanPham == null)
                {
                    throw new BaseException.NotFoundException("not_found", $"Không tìm thấy sản phẩm với Id {chiTietDonHang.MaSanPham}");
                }

                // Lấy thời gian bảo hành của sản phẩm
                var thoiGianBaoHanh = sanPham.ThoiGianBaoHanh;

                // Tạo các bản ghi lịch bảo trì
                for (int i = 1; i <= thoiGianBaoHanh / 6; i++)  // Mỗi lần 6 tháng
                {
                    // Tính ngày bảo trì (Ngày mua hàng + 6 tháng * i)
                    var ngayBaoTri = DateTime.Now.AddMonths(i * 6);

                    // Tạo lịch bảo trì
                    var lichBaoTri = new LichBaoTri
                    {
                        MaChiTietDonHang = chiTietDonHang.Id,
                        NgayBaoTri = ngayBaoTri,
                        LoaiBaoTri = "Bảo trì",
                        TrangThai = "Chưa thông báo"
                    };

                    // Lưu vào cơ sở dữ liệu
                    await _unitOfWork.GetRepository<LichBaoTri>().InsertAsync(lichBaoTri);
                    await _unitOfWork.GetRepository<LichBaoTri>().SaveAsync();
                }
            }
        }
    }
}

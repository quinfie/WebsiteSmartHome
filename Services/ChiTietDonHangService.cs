using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    // Service triển khai các chức năng liên quan đến Chi Tiết Đơn Hàng
    public class ChiTietDonHangService : IChiTietDonHangService
    {
        private readonly IUnitOfWork _unitOfWork;

        // Inject UnitOfWork để thao tác dữ liệu
        public ChiTietDonHangService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<List<ChiTietDonHangDto>> GetAllChiTietDonHangAsync()
        {
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => true)
                .Include(ct => ct.MaSanPhamNavigation)
                .ToListAsync();

            return chiTietDonHangs.Select(ct => new ChiTietDonHangDto
            {
                Id = ct.Id.ToString(),
                MaDonHang = ct.MaDonHang.ToString(),
                MaSanPham = ct.MaSanPham.ToString(),
                TenSanPham = ct.MaSanPhamNavigation?.TenSanPham ?? "Không xác định",
                SoLuong = ct.SoLuong,
                DonGia = ct.DonGia
            }).ToList();
        }

        public async Task<List<ChiTietDonHangDto>> SearchChiTietDonHangByNameAsync(string name)
        {
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaSanPhamNavigation.TenSanPham.ToLower().Contains(name.ToLower()))
                .Include(ct => ct.MaSanPhamNavigation)
                .ToListAsync();

            return chiTietDonHangs.Select(ct => new ChiTietDonHangDto
            {
                Id = ct.Id.ToString(),
                MaDonHang = ct.MaDonHang.ToString(),
                MaSanPham = ct.MaSanPham.ToString(),
                TenSanPham = ct.MaSanPhamNavigation?.TenSanPham ?? "Không xác định",
                SoLuong = ct.SoLuong,
                DonGia = ct.DonGia
            }).ToList();
        }

        public async Task<List<ChiTietDonHangDto>> GetChiTietDonHangByDonHangIdAsync(string donHangId)
        {
            if (!Guid.TryParse(donHangId, out Guid id))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID đơn hàng không hợp lệ");
            }

            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaDonHang == id)
                .Include(ct => ct.MaSanPhamNavigation)
                .ToListAsync();

            return chiTietDonHangs.Select(ct => new ChiTietDonHangDto
            {
                Id = ct.Id.ToString(),
                MaDonHang = ct.MaDonHang.ToString(),
                MaSanPham = ct.MaSanPham.ToString(),
                TenSanPham = ct.MaSanPhamNavigation?.TenSanPham ?? "Không xác định",
                SoLuong = ct.SoLuong,
                DonGia = ct.DonGia
            }).ToList();
        }

        public async Task<ChiTietDonHangDto> UpdateChiTietDonHangAsync(string id, UpdateChiTietDonHangDto dto)
        {
            if (!Guid.TryParse(id, out Guid chiTietId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID chi tiết đơn hàng không hợp lệ");
            }

            var chiTiet = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByConditionWithIncludesAsync(ct => ct.Id.Equals(chiTietId), ct => ct.MaDonHangNavigation);

            if (chiTiet == null)
            {
                throw new BaseException.NotFoundException("not_found", "Chi tiết đơn hàng không tồn tại");
            }

            // Kiểm tra trạng thái đơn hàng
            if (chiTiet.MaDonHangNavigation.TrangThaiDonHang != OrderStatusHelper.ChoXacNhan.ToString().GetDescription(typeof(OrderStatusHelper)))
            {
                throw new BaseException.ValidationException("invalid_status", "Chỉ có thể cập nhật chi tiết đơn hàng ở trạng thái 'Chờ xác nhận'");
            }

            // Lấy thông tin sản phẩm
            var sanPham = await _unitOfWork.GetRepository<SanPham>().FindByConditionAsync(x => x.Id == chiTiet.MaSanPham);
            if (sanPham == null)
            {
                throw new BaseException.NotFoundException("product_not_found", "Sản phẩm không tồn tại");
            }

            // Tính toán số lượng thay đổi
            int soLuongThayDoi = dto.SoLuongMoi - chiTiet.SoLuong;

            // Kiểm tra số lượng tồn kho
            if (sanPham.SoLuongTon + soLuongThayDoi < 0)
            {
                throw new BaseException.ValidationException("invalid_quantity", "Số lượng sản phẩm không đủ");
            }

            // Cập nhật số lượng tồn kho
            sanPham.SoLuongTon += soLuongThayDoi;
            await _unitOfWork.GetRepository<SanPham>().UpdateAsync(sanPham);

            // Cập nhật thông tin chi tiết đơn hàng
            chiTiet.SoLuong = dto.SoLuongMoi;
            chiTiet.DonGia = dto.DonGiaMoi;

            await _unitOfWork.GetRepository<ChiTietDonHang>().UpdateAsync(chiTiet);
            await _unitOfWork.SaveAsync();

            return new ChiTietDonHangDto
            {
                Id = chiTiet.Id.ToString(),
                MaDonHang = chiTiet.MaDonHang.ToString(),
                MaSanPham = chiTiet.MaSanPham.ToString(),
                TenSanPham = sanPham.TenSanPham,
                SoLuong = chiTiet.SoLuong,
                DonGia = chiTiet.DonGia
            };
        }

        public async Task<bool> DeleteChiTietDonHangAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid chiTietId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID chi tiết đơn hàng không hợp lệ");
            }

            var chiTiet = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .FindByConditionWithIncludesAsync(ct => ct.Id.Equals(chiTietId), ct => ct.MaDonHangNavigation);

            if (chiTiet == null)
            {
                throw new BaseException.NotFoundException("not_found", "Chi tiết đơn hàng không tồn tại");
            }

            // Kiểm tra trạng thái đơn hàng
            if (chiTiet.MaDonHangNavigation.TrangThaiDonHang != OrderStatusHelper.ChoXacNhan.ToString().GetDescription(typeof(OrderStatusHelper)))
            {
                throw new BaseException.ValidationException("invalid_status", "Chỉ có thể xóa chi tiết đơn hàng ở trạng thái 'Chờ xác nhận'");
            }

            // Hoàn trả số lượng tồn kho
            var sanPham = await _unitOfWork.GetRepository<SanPham>().FindByConditionAsync(x => x.Id == chiTiet.MaSanPham);
            if (sanPham != null)
            {
                sanPham.SoLuongTon += chiTiet.SoLuong;
                await _unitOfWork.GetRepository<SanPham>().UpdateAsync(sanPham);
            }

            // Xóa chi tiết đơn hàng
            await _unitOfWork.GetRepository<ChiTietDonHang>().DeleteAsync(chiTietId);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<List<ChiTietDonHang>> ThemChiTietDonHangAsync(Guid donHangId, List<RequestCreateChiTietDonHangDto> chiTietDonHangs)
        {
            var result = new List<ChiTietDonHang>();

            foreach (var chiTiet in chiTietDonHangs)
            {
                if (!Guid.TryParse(chiTiet.MaSanPham, out Guid maSanPham))
                {
                    throw new BaseException.BadRequestException("invalid_product_id", "Mã sản phẩm không hợp lệ");
                }

                var sanPham = await _unitOfWork.GetRepository<SanPham>().FindByConditionAsync(x => x.Id == maSanPham);
                if (sanPham == null)
                {
                    throw new BaseException.NotFoundException("product_not_found", "Sản phẩm không tồn tại");
                }

                if (sanPham.SoLuongTon < chiTiet.SoLuongMua)
                {
                    throw new BaseException.ValidationException("insufficient_quantity", $"Số lượng sản phẩm {sanPham.TenSanPham} không đủ");
                }

                var chiTietDonHang = new ChiTietDonHang
                {
                    MaDonHang = donHangId,
                    MaSanPham = maSanPham,
                    SoLuong = chiTiet.SoLuongMua,
                    DonGia = chiTiet.DonGiaMua
                };

                await _unitOfWork.GetRepository<ChiTietDonHang>().InsertAsync(chiTietDonHang);

                // Cập nhật số lượng tồn kho
                sanPham.SoLuongTon -= chiTiet.SoLuongMua;
                await _unitOfWork.GetRepository<SanPham>().UpdateAsync(sanPham);

                result.Add(chiTietDonHang);
            }

            await _unitOfWork.SaveAsync();
            return result;
        }
    }
}

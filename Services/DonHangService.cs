using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using System.Security.Claims;

namespace WebsiteSmartHome.Services
{
    public class DonHangService : IDonHangService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IChiTietDonHangService _chiTietDonHangService;
        private readonly ILichBaoTriService _lichBaoTriService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DonHangService(IUnitOfWork unitOfWork, IChiTietDonHangService chiTietDonHangService,
            ILichBaoTriService lichBaoTriService, IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _chiTietDonHangService = chiTietDonHangService;
            _lichBaoTriService = lichBaoTriService;
            _httpContextAccessor = httpContextAccessor;
        }

        // Lấy danh sách đơn hàng (không bao gồm chi tiết)
        public async Task<List<DonHangDto>> GetDanhSachDonHangAsync()
        {
            var donHangs = await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(dh => true)
                .Include(dh => dh.MaNguoiDungNavigation)
                .Include(dh => dh.MaKhuyenMaiNavigation)
                .ToListAsync();

            return donHangs.Select(dh => new DonHangDto
            {
                Id = dh.Id.ToString(),
                TenNguoiDung = dh.MaNguoiDungNavigation?.TenNguoiDung ?? "Không xác định",
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                TenKhuyenMai = dh.MaKhuyenMaiNavigation?.TenKhuyenMai
            }).ToList();
        }

        // Lấy chi tiết đơn hàng theo ID
        public async Task<ViewResponseCreateDonHangDto> GetChiTietDonHangAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid donHangId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID đơn hàng không hợp lệ");
            }

            var donHang = await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(dh => dh.Id == donHangId)
                .Include(dh => dh.MaNguoiDungNavigation)
                .Include(dh => dh.MaKhuyenMaiNavigation)
                .Include(dh => dh.ChiTietDonHangs)
                    .ThenInclude(ct => ct.MaSanPhamNavigation)
                .FirstOrDefaultAsync();

            if (donHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
            }

            var chiTietDonHangs = donHang.ChiTietDonHangs.Select(ct => new ChiTietDonHangDto
            {
                TenSanPham = ct.MaSanPhamNavigation?.TenSanPham ?? "Không xác định",
                SoLuong = ct.SoLuong,
                DonGia = ct.DonGia
            }).ToList();

            return new ViewResponseCreateDonHangDto
            {
                TenNguoiDung = donHang.MaNguoiDungNavigation?.TenNguoiDung ?? "Không xác định",
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                TenKhuyenMai = donHang.MaKhuyenMaiNavigation?.TenKhuyenMai,
                NgayDat = donHang.NgayDat,
                ChiTietDonHangs = chiTietDonHangs
            };
        }

        private async Task<KhuyenMai?> ValidateKhuyenMaiAsync(string? maKhuyenMai)
        {
            if (string.IsNullOrWhiteSpace(maKhuyenMai))
                return null;

            var khuyenMai = await _unitOfWork.GetRepository<KhuyenMai>().FindByConditionAsync(x => x.Id.ToString() == maKhuyenMai);
            if (khuyenMai == null || khuyenMai.NgayBatDau > DateTime.Now || khuyenMai.NgayKetThuc < DateTime.Now)
            {
                throw new BaseException.ValidationException("invalid_promotion", "Khuyến mãi không hợp lệ hoặc đã hết hạn");
            }

            return khuyenMai;
        }

        private void ValidateTrangThaiDonHang(string trangThai)
        {
            if (string.IsNullOrWhiteSpace(trangThai))
            {
                throw new BaseException.ValidationException("invalid_status", "Trạng thái đơn hàng không được để trống");
            }

            var validStatuses = Enum.GetValues(typeof(OrderStatusHelper))
                .Cast<OrderStatusHelper>()
                .Select(x => x.ToString().GetDescription(typeof(OrderStatusHelper)))
                .ToList();

            if (!validStatuses.Contains(trangThai))
            {
                throw new BaseException.ValidationException("invalid_status",
                    $"Trạng thái đơn hàng không hợp lệ. Các trạng thái hợp lệ: {string.Join(", ", validStatuses)}");
            }
        }

        private async Task<DonHang> CreateDonHangAsync(RequestCreateDonHangDto dto, KhuyenMai? khuyenMai, string userId)
        {
            var donHang = new DonHang
            {
                MaNguoiDung = Guid.Parse(userId),
                TrangThaiDonHang = OrderStatusHelper.ChoXacNhan.ToString().GetDescription(typeof(OrderStatusHelper)),
                NgayDat = DateTime.Now,
                MaKhuyenMai = khuyenMai?.Id,
                TongTien = 0
            };

            await _unitOfWork.GetRepository<DonHang>().InsertAsync(donHang);
            await _unitOfWork.GetRepository<DonHang>().SaveAsync();

            return donHang;
        }

        private decimal CalculateTongTien(List<RequestCreateChiTietDonHangDto> chiTietDonHangs, KhuyenMai? khuyenMai)
        {
            if (chiTietDonHangs == null || !chiTietDonHangs.Any())
            {
                return 0;
            }

            decimal tongTien = chiTietDonHangs.Sum(ct => ct.DonGiaMua * ct.SoLuongMua);
            if (tongTien < 0)
            {
                throw new BaseException.ValidationException("invalid_total", "Tổng tiền không thể âm");
            }

            if (khuyenMai != null)
            {
                tongTien -= tongTien * khuyenMai.PhanTramGiam / 100;
                if (tongTien < 0)
                {
                    tongTien = 0; // Đảm bảo tổng tiền sau khuyến mãi không âm
                }
            }

            return tongTien;
        }

        private ResponseCreateDonHangDto CreateResponse(DonHang donHang, RequestCreateDonHangDto dto, decimal tongTien)
        {
            return new ResponseCreateDonHangDto
            {
                MaNguoiDung = donHang.MaNguoiDung.ToString(),
                TongTien = tongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                MaKhuyenMai = dto.MaKhuyenMai,
                ChiTietDonHangs = dto.ChiTietDonHangs
            };
        }

        public async Task<ResponseCreateDonHangDto> ThemDonHangAsync(RequestCreateDonHangDto dto, string userId)
        {
            // Kiểm tra người dùng
            var nguoiDung = await _unitOfWork.GetRepository<NguoiDung>()
                .GetEntitiesWithCondition(x => x.MaTaiKhoanNavigation.Id.ToString() == userId)
                .Include(x => x.MaTaiKhoanNavigation)
                .FirstOrDefaultAsync();

            if (nguoiDung == null)
            {
                throw new BaseException.NotFoundException("not_found", "Người dùng không tồn tại");
            }

            // Kiểm tra và lấy thông tin khuyến mãi
            var khuyenMai = await ValidateKhuyenMaiAsync(dto.MaKhuyenMai);

            // Tạo đơn hàng với MaNguoiDung là ID của NguoiDung
            var donHang = await CreateDonHangAsync(dto, khuyenMai, nguoiDung.Id.ToString());

            // Thêm chi tiết đơn hàng
            var chiTietDonHangs = await _chiTietDonHangService.ThemChiTietDonHangAsync(donHang.Id, dto.ChiTietDonHangs!);

            // Xử lý lịch bảo trì
            await _lichBaoTriService.ThemLichBaoTriAsync(chiTietDonHangs);

            // Tính tổng tiền
            decimal tongTien = CalculateTongTien(dto.ChiTietDonHangs!, khuyenMai);

            // Cập nhật tổng tiền
            donHang.TongTien = tongTien;
            await _unitOfWork.GetRepository<DonHang>().UpdateAsync(donHang);
            await _unitOfWork.GetRepository<DonHang>().SaveAsync();

            return CreateResponse(donHang, dto, tongTien);
        }

        public async Task<ResponseCreateDonHangDto> UpdateDonHangAsync(string id, RequestUpdateDonHangDto dto, string userId)
        {
            // Kiểm tra đơn hàng tồn tại
            if (!Guid.TryParse(id, out Guid donHangId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID đơn hàng không hợp lệ");
            }

            var donHang = await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(dh => dh.Id == donHangId)
                .Include(dh => dh.MaNguoiDungNavigation)
                .Include(dh => dh.ChiTietDonHangs)
                .FirstOrDefaultAsync();

            if (donHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
            }

            // Kiểm tra quyền cập nhật đơn hàng
            if (donHang.MaNguoiDungNavigation.MaTaiKhoanNavigation.Id.ToString() != userId)
            {
                throw new BaseException.ValidationException("invalid_permission", "Bạn không có quyền cập nhật đơn hàng này");
            }

            // Kiểm tra trạng thái đơn hàng có thể cập nhật không
            if (donHang.TrangThaiDonHang != OrderStatusHelper.ChoXacNhan.ToString().GetDescription(typeof(OrderStatusHelper)))
            {
                throw new BaseException.ValidationException("invalid_status", "Chỉ có thể cập nhật đơn hàng ở trạng thái 'Chờ xác nhận'");
            }

            // Validate trạng thái mới
            ValidateTrangThaiDonHang(dto.TrangThaiDonHang);

            // Kiểm tra và lấy thông tin khuyến mãi
            var khuyenMai = await ValidateKhuyenMaiAsync(dto.MaKhuyenMai);

            // Xóa các chi tiết đơn hàng cũ
            foreach (var chiTiet in donHang.ChiTietDonHangs)
            {
                // Hoàn trả số lượng tồn kho
                var sanPham = await _unitOfWork.GetRepository<SanPham>().FindByConditionAsync(x => x.Id == chiTiet.MaSanPham);
                if (sanPham != null)
                {
                    sanPham.SoLuongTon += chiTiet.SoLuong;
                    await _unitOfWork.GetRepository<SanPham>().UpdateAsync(sanPham);
                }

                // Xóa chi tiết đơn hàng
                await _unitOfWork.GetRepository<ChiTietDonHang>().DeleteAsync(chiTiet.Id);
            }

            // Thêm chi tiết đơn hàng mới
            var chiTietDonHangs = await _chiTietDonHangService.ThemChiTietDonHangAsync(donHang.Id, dto.ChiTietDonHangs!);

            // Tính tổng tiền mới
            decimal tongTien = CalculateTongTien(dto.ChiTietDonHangs!, khuyenMai);

            // Cập nhật thông tin đơn hàng
            donHang.MaKhuyenMai = khuyenMai?.Id;
            donHang.TongTien = tongTien;

            // Lưu các thay đổi
            await _unitOfWork.GetRepository<DonHang>().UpdateAsync(donHang);
            await _unitOfWork.SaveAsync();

            return new ResponseCreateDonHangDto
            {
                MaNguoiDung = donHang.MaNguoiDung.ToString(),
                TongTien = tongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                MaKhuyenMai = donHang.MaKhuyenMai?.ToString(),
                ChiTietDonHangs = dto.ChiTietDonHangs
            };
        }

        public async Task<bool> DeleteDonHangAsync(string id, string userId)
        {
            if (!Guid.TryParse(id, out Guid donHangId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID đơn hàng không hợp lệ");
            }

            var donHang = await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(dh => dh.Id == donHangId)
                .Include(dh => dh.MaNguoiDungNavigation)
                .FirstOrDefaultAsync();

            if (donHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
            }

            // Kiểm tra quyền xóa đơn hàng
            if (donHang.MaNguoiDungNavigation.MaTaiKhoanNavigation.Id.ToString() != userId)
            {
                throw new BaseException.ValidationException("invalid_permission", "Bạn không có quyền xóa đơn hàng này");
            }

            // Chỉ cho phép xóa khi đơn hàng ở trạng thái "Chờ xác nhận"
            if (donHang.TrangThaiDonHang != OrderStatusHelper.ChoXacNhan.ToString().GetDescription(typeof(OrderStatusHelper)))
            {
                throw new BaseException.ValidationException("invalid_status", "Chỉ có thể xóa đơn hàng ở trạng thái 'Chờ xác nhận'");
            }

            // Lấy danh sách chi tiết đơn hàng
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>().GetEntitiesWithCondition(ct => ct.MaDonHang == donHangId).ToListAsync();

            // Xóa tất cả chi tiết đơn hàng
            foreach (var chiTiet in chiTietDonHangs)
            {
                await _unitOfWork.GetRepository<ChiTietDonHang>().DeleteAsync(chiTiet.Id);
            }

            // Xóa đơn hàng
            await _unitOfWork.GetRepository<DonHang>().DeleteAsync(donHangId);
            await _unitOfWork.SaveAsync();

            return true;
        }

        /// <summary>
        /// Lấy danh sách đơn hàng và chi tiết của người dùng hiện tại
        /// </summary>
        public async Task<List<ViewResponseCreateDonHangDto>> GetDonHangByCurrentUserAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new BaseException.ValidationException("invalid_user", "Thông tin người dùng không hợp lệ");
            }

            var donHangs = await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(dh => dh.MaNguoiDungNavigation.MaTaiKhoanNavigation.Id.ToString() == userId)
                .Include(dh => dh.MaNguoiDungNavigation)
                .Include(dh => dh.MaKhuyenMaiNavigation)
                .Include(dh => dh.ChiTietDonHangs)
                    .ThenInclude(ct => ct.MaSanPhamNavigation)
                .OrderByDescending(dh => dh.NgayDat)
                .ToListAsync();

            return donHangs.Select(dh => new ViewResponseCreateDonHangDto
            {
                Id = dh.Id.ToString(),
                TenNguoiDung = dh.MaNguoiDungNavigation?.TenNguoiDung ?? "Không xác định",
                TongTien = dh.TongTien,
                TrangThaiDonHang = dh.TrangThaiDonHang,
                NgayDat = dh.NgayDat,
                TenKhuyenMai = dh.MaKhuyenMaiNavigation?.TenKhuyenMai,
                ChiTietDonHangs = dh.ChiTietDonHangs.Select(ct => new ChiTietDonHangDto
                {
                    TenSanPham = ct.MaSanPhamNavigation?.TenSanPham ?? "Không xác định",
                    SoLuong = ct.SoLuong,
                    DonGia = ct.DonGia
                }).ToList()
            }).ToList();
        }
    }
}

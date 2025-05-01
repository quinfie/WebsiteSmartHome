using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Base;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Services;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class DonHangService : IDonHangService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IChiTietDonHangService _chiTietDonHangService;
        private readonly ILichBaoTriService _lichBaoTriService;

        public DonHangService(IUnitOfWork unitOfWork, IChiTietDonHangService chiTietDonHangService, ILichBaoTriService lichBaoTriService)
        {
            _unitOfWork = unitOfWork;
            _chiTietDonHangService = chiTietDonHangService;
            _lichBaoTriService = lichBaoTriService;
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

            var chiTietDonHangs = donHang.ChiTietDonHangs.Select(ct => new ViewCreateChiTietDonHangDto
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
            var enumName = GetDesriptionHelper.GetEnumNameByDescription<OrderStatusHelper>(trangThai);
            if (enumName == null)
            {
                var validStatuses = Enum.GetValues(typeof(OrderStatusHelper))
                    .Cast<OrderStatusHelper>()
                    .Select(x => x.ToString().GetDescription(typeof(OrderStatusHelper)))
                    .ToList();

                throw new BaseException.ValidationException("invalid_status", 
                    $"Trạng thái đơn hàng không hợp lệ. Các trạng thái hợp lệ: {string.Join(", ", validStatuses)}");
            }
        }

        private async Task<DonHang> CreateDonHangAsync(RequestCreateDonHangDto dto, KhuyenMai? khuyenMai)
        {
            ValidateTrangThaiDonHang(dto.TrangThaiDonHang);

            var donHang = new DonHang
            {
                MaNguoiDung = Guid.Parse(dto.MaNguoiDung),
                TrangThaiDonHang = dto.TrangThaiDonHang,
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
                MaNguoiDung = dto.MaNguoiDung,
                TongTien = tongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                MaKhuyenMai = dto.MaKhuyenMai,
                ChiTietDonHangs = dto.ChiTietDonHangs
            };
        }

        public async Task<ResponseCreateDonHangDto> ThemDonHangAsync(RequestCreateDonHangDto dto)
        {
            // Kiểm tra người dùng
            var nguoiDung = await _unitOfWork.GetRepository<NguoiDung>().FindByConditionAsync(x => x.Id.ToString() == dto.MaNguoiDung);
            if (nguoiDung == null)
            {
                throw new BaseException.NotFoundException("not_found", "Người dùng không tồn tại");
            }

            // Kiểm tra và lấy thông tin khuyến mãi
            var khuyenMai = await ValidateKhuyenMaiAsync(dto.MaKhuyenMai);

            // Tạo đơn hàng
            var donHang = await CreateDonHangAsync(dto, khuyenMai);

            // Thêm chi tiết đơn hàng
            var chiTietDonHangs = await _chiTietDonHangService.ThemChiTietDonHangAsync(donHang.Id, dto.ChiTietDonHangs);

            // Xử lý lịch bảo trì
            await _lichBaoTriService.ThemLichBaoTriAsync(chiTietDonHangs);

            // Tính tổng tiền
            decimal tongTien = CalculateTongTien(dto.ChiTietDonHangs, khuyenMai);

            // Cập nhật tổng tiền
            donHang.TongTien = tongTien;
            await _unitOfWork.GetRepository<DonHang>().UpdateAsync(donHang);
            await _unitOfWork.GetRepository<DonHang>().SaveAsync();

            return CreateResponse(donHang, dto, tongTien);
        }

        public async Task<ResponseCreateDonHangDto> UpdateDonHangAsync(string id, RequestCreateDonHangDto dto)
        {
            // Kiểm tra đơn hàng tồn tại
            if (!Guid.TryParse(id, out Guid donHangId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID đơn hàng không hợp lệ");
            }

            var donHang = await _unitOfWork.GetRepository<DonHang>()
                .FindByConditionWithIncludesAsync(dh => dh.Id == donHangId, dh => dh.ChiTietDonHangs);

            if (donHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
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
            var chiTietDonHangs = await _chiTietDonHangService.ThemChiTietDonHangAsync(donHang.Id, dto.ChiTietDonHangs);

            // Tính tổng tiền mới
            decimal tongTien = CalculateTongTien(dto.ChiTietDonHangs, khuyenMai);

            // Cập nhật thông tin đơn hàng
            donHang.MaKhuyenMai = khuyenMai?.Id;
            donHang.TongTien = tongTien;

            // Cập nhật lịch bảo trì
            await _lichBaoTriService.ThemLichBaoTriAsync(chiTietDonHangs);

            // Lưu các thay đổi
            await _unitOfWork.GetRepository<DonHang>().UpdateAsync(donHang);
            await _unitOfWork.SaveAsync();

            return CreateResponse(donHang, dto, tongTien);
        }

        public async Task<bool> DeleteDonHangAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid donHangId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID đơn hàng không hợp lệ");
            }

            var donHang = await _unitOfWork.GetRepository<DonHang>().FindByConditionAsync(dh => dh.Id == donHangId);
            if (donHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
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
    }
}

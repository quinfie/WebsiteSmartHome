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
        private readonly ILogger<DonHangService> _logger;

        public DonHangService(IUnitOfWork unitOfWork, IChiTietDonHangService chiTietDonHangService,
            ILichBaoTriService lichBaoTriService, IHttpContextAccessor httpContextAccessor, ILogger<DonHangService> logger)
        {
            _unitOfWork = unitOfWork;
            _chiTietDonHangService = chiTietDonHangService;
            _lichBaoTriService = lichBaoTriService;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
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
                Id = ct.Id.ToString(),
                MaDonHang = ct.MaDonHang.ToString(),
                MaSanPham = ct.MaSanPham.ToString(),
                TenSanPham = ct.MaSanPhamNavigation?.TenSanPham ?? "Không xác định",
                SoLuong = ct.SoLuong,
                DonGia = ct.DonGia
            }).ToList();

            return new ViewResponseCreateDonHangDto
            {
                Id = donHang.Id.ToString(),
                TenNguoiDung = donHang.MaNguoiDungNavigation?.TenNguoiDung ?? "Không xác định",
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                TenKhuyenMai = donHang.MaKhuyenMaiNavigation?.TenKhuyenMai,
                MaKhuyenMai = donHang.MaKhuyenMai?.ToString(),
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
                Id = donHang.Id.ToString(),
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
                    .ThenInclude(nd => nd.MaTaiKhoanNavigation)
                .Include(dh => dh.ChiTietDonHangs)
                .FirstOrDefaultAsync();

            if (donHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
            }

            // Validate trạng thái mới
            ValidateTrangThaiDonHang(dto.TrangThaiDonHang);

            // Kiểm tra và lấy thông tin khuyến mãi
            var khuyenMai = await ValidateKhuyenMaiAsync(dto.MaKhuyenMai);

            var oldChiTietList = donHang.ChiTietDonHangs.ToList();
            var newChiTietList = dto.ChiTietDonHangs ?? new List<RequestCreateChiTietDonHangDto>();

            // Lấy danh sách mã sản phẩm cũ và mới
            var oldMaSanPhamList = oldChiTietList.Select(ct => ct.MaSanPham.ToString()).ToList();
            var newMaSanPhamList = newChiTietList.Select(ct => ct.MaSanPham).ToList();

            // Chỉ update nếu không thêm/xóa sản phẩm (danh sách mã sản phẩm giống nhau)
            bool onlyUpdate = oldMaSanPhamList.Count == newMaSanPhamList.Count
                && oldMaSanPhamList.All(id => newMaSanPhamList.Contains(id))
                && newMaSanPhamList.All(id => oldMaSanPhamList.Contains(id));

            if (onlyUpdate)
            {
                // Chỉ update số lượng, giá, tồn kho
                foreach (var chiTietMoi in newChiTietList)
                {
                    var chiTietCu = oldChiTietList.FirstOrDefault(ct => ct.MaSanPham.ToString() == chiTietMoi.MaSanPham);
                    if (chiTietCu != null)
                    {
                        int soLuongThayDoi = chiTietMoi.SoLuongMua - chiTietCu.SoLuong;
                        if (soLuongThayDoi != 0)
                        {
                            var sanPham = await _unitOfWork.GetRepository<SanPham>().FindByConditionAsync(x => x.Id == chiTietCu.MaSanPham);
                            if (sanPham != null)
                            {
                                sanPham.SoLuongTon -= soLuongThayDoi;
                                await _unitOfWork.GetRepository<SanPham>().UpdateAsync(sanPham);
                            }
                        }
                        chiTietCu.SoLuong = chiTietMoi.SoLuongMua;
                        chiTietCu.DonGia = chiTietMoi.DonGiaMua;
                        await _unitOfWork.GetRepository<ChiTietDonHang>().UpdateAsync(chiTietCu);
                    }
                }
            }
            else
            {
                // XÓA các chi tiết cũ không còn trong danh sách mới (và xóa lịch bảo trì liên quan)
                foreach (var chiTietCu in oldChiTietList)
                {
                    if (!newMaSanPhamList.Contains(chiTietCu.MaSanPham.ToString()))
                    {
                        // Xóa chi tiết đơn hàng và lịch bảo trì liên quan
                        var lichBaoTris = await _unitOfWork.GetRepository<LichBaoTri>()
                            .GetEntitiesWithCondition(lbt => lbt.MaChiTietDonHang == chiTietCu.Id)
                            .ToListAsync();
                        foreach (var lichBaoTri in lichBaoTris)
                        {
                            await _unitOfWork.GetRepository<LichBaoTri>().DeleteAsync(lichBaoTri.Id);
                        }
                        await _unitOfWork.GetRepository<ChiTietDonHang>().DeleteAsync(chiTietCu.Id);
                    }
                }

                // Cập nhật số lượng, giá cho chi tiết cũ còn lại
                foreach (var chiTietMoi in newChiTietList)
                {
                    if (oldMaSanPhamList.Contains(chiTietMoi.MaSanPham))
                    {
                        var chiTietCu = oldChiTietList.FirstOrDefault(ct => ct.MaSanPham.ToString() == chiTietMoi.MaSanPham);
                        if (chiTietCu != null)
                        {
                            int soLuongThayDoi = chiTietMoi.SoLuongMua - chiTietCu.SoLuong;
                            if (soLuongThayDoi != 0)
                            {
                                var sanPham = await _unitOfWork.GetRepository<SanPham>().FindByConditionAsync(x => x.Id == chiTietCu.MaSanPham);
                                if (sanPham != null)
                                {
                                    sanPham.SoLuongTon -= soLuongThayDoi;
                                    await _unitOfWork.GetRepository<SanPham>().UpdateAsync(sanPham);
                                }
                            }
                            chiTietCu.SoLuong = chiTietMoi.SoLuongMua;
                            chiTietCu.DonGia = chiTietMoi.DonGiaMua;
                            await _unitOfWork.GetRepository<ChiTietDonHang>().UpdateAsync(chiTietCu);
                        }
                    }
                }

                // Thêm mới các chi tiết mới (không có trong oldMaSanPhamList)
                foreach (var chiTietMoi in newChiTietList)
                {
                    if (!oldMaSanPhamList.Contains(chiTietMoi.MaSanPham))
                    {
                        var chiTiet = new ChiTietDonHang
                        {
                            MaDonHang = donHang.Id,
                            MaSanPham = Guid.Parse(chiTietMoi.MaSanPham),
                            SoLuong = chiTietMoi.SoLuongMua,
                            DonGia = chiTietMoi.DonGiaMua
                        };
                        await _unitOfWork.GetRepository<ChiTietDonHang>().InsertAsync(chiTiet);
                        await _unitOfWork.GetRepository<ChiTietDonHang>().SaveAsync();

                        _logger.LogInformation($"Đã thêm chi tiết mới cho đơn hàng {donHang.Id}, sản phẩm {chiTietMoi.MaSanPham}, số lượng {chiTietMoi.SoLuongMua}");
                    }
                }
            }

            // Cập nhật thông tin đơn hàng
            donHang.MaKhuyenMai = khuyenMai?.Id;
            donHang.TongTien = CalculateTongTien(newChiTietList.Select(ct => new RequestCreateChiTietDonHangDto
            {
                MaSanPham = ct.MaSanPham,
                SoLuongMua = ct.SoLuongMua,
                DonGiaMua = ct.DonGiaMua
            }).ToList(), khuyenMai);

            // Lưu trạng thái cũ để tracking
            string oldStatus = donHang.TrangThaiDonHang;
            string newStatus = dto.TrangThaiDonHang;

            // Cập nhật trạng thái đơn hàng
            donHang.TrangThaiDonHang = dto.TrangThaiDonHang;

            // Ghi log thay đổi trạng thái
            if (oldStatus != newStatus)
            {
                _logger.LogInformation($"Trạng thái đơn hàng {donHang.Id} đã thay đổi từ '{oldStatus}' sang '{newStatus}'");

                // Nếu trạng thái thay đổi thành "Hoàn thành", tạo lịch bảo trì
                if (newStatus == "Hoàn thành")
                {
                    await _lichBaoTriService.TaoLichBaoTriTuDonHangAsync(donHang.Id);
                }
            }

            await _unitOfWork.GetRepository<DonHang>().UpdateAsync(donHang);
            await _unitOfWork.SaveAsync();

            return new ResponseCreateDonHangDto
            {
                MaNguoiDung = donHang.MaNguoiDung.ToString(),
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                MaKhuyenMai = donHang.MaKhuyenMai?.ToString(),
                ChiTietDonHangs = newChiTietList.Select(ct => new RequestCreateChiTietDonHangDto
                {
                    MaSanPham = ct.MaSanPham,
                    SoLuongMua = ct.SoLuongMua,
                    DonGiaMua = ct.DonGiaMua
                }).ToList()
            };
        }

        public async Task<bool> DeleteDonHangAsync(string id, string userId)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid donHangId))
                {
                    throw new BaseException.BadRequestException("invalid_id", "ID đơn hàng không hợp lệ");
                }

                // Include đầy đủ các navigation properties
                var donHang = await _unitOfWork.GetRepository<DonHang>()
                    .GetEntitiesWithCondition(dh => dh.Id == donHangId)
                    .Include(dh => dh.MaNguoiDungNavigation)
                        .ThenInclude(nd => nd.MaTaiKhoanNavigation)
                    .Include(dh => dh.ChiTietDonHangs)
                    .FirstOrDefaultAsync();

                if (donHang == null)
                {
                    throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
                }

                // Kiểm tra quyền xóa đơn hàng với null check
                var user = _httpContextAccessor.HttpContext?.User;
                var roles = user?.Claims
                    .Where(c => c.Type == ClaimTypes.Role)
                    .Select(c => c.Value)
                    .ToList() ?? new List<string>();

                var requireManageRoles = new List<string> { "Quản Trị Viên", "Quản Lí", "Nhân Viên" }; // Thay đổi theo hệ thống của bạn

                bool isOwner = donHang.MaNguoiDungNavigation?.MaTaiKhoanNavigation?.Id.ToString() == userId;
                bool isManager = roles.Any(r => requireManageRoles.Contains(r));

                if (!isOwner && !isManager)
                {
                    throw new BaseException.ValidationException("invalid_permission", "Bạn không có quyền xóa đơn hàng này");
                }

                // 1. Xóa tất cả LichBaoTri liên quan đến các ChiTietDonHang trước
                foreach (var chiTiet in donHang.ChiTietDonHangs)
                {
                    // Lấy danh sách lịch bảo trì của chi tiết đơn hàng này
                    var lichBaoTris = await _unitOfWork.GetRepository<LichBaoTri>()
                        .GetEntitiesWithCondition(lbt => lbt.MaChiTietDonHang == chiTiet.Id)
                        .ToListAsync();

                    // Xóa từng lịch bảo trì
                    foreach (var lichBaoTri in lichBaoTris)
                    {
                        _logger.LogInformation($"Xóa lịch bảo trì ID: {lichBaoTri.Id} của chi tiết đơn hàng ID: {chiTiet.Id}");
                        await _unitOfWork.GetRepository<LichBaoTri>().DeleteAsync(lichBaoTri.Id);
                    }

                    // Lưu thay đổi sau khi xóa lịch bảo trì để đảm bảo đã xóa hết
                    await _unitOfWork.SaveAsync();
                }

                // 2. Xóa tất cả chi tiết đơn hàng
                foreach (var chiTiet in donHang.ChiTietDonHangs.ToList())
                {
                    _logger.LogInformation($"Xóa chi tiết đơn hàng ID: {chiTiet.Id}");
                    await _unitOfWork.GetRepository<ChiTietDonHang>().DeleteAsync(chiTiet.Id);
                }

                // Lưu thay đổi sau khi xóa chi tiết đơn hàng
                await _unitOfWork.SaveAsync();

                // 3. Xóa đơn hàng
                _logger.LogInformation($"Xóa đơn hàng ID: {donHangId}");
                await _unitOfWork.GetRepository<DonHang>().DeleteAsync(donHangId);

                // Lưu tất cả thay đổi cuối cùng
                await _unitOfWork.SaveAsync();

                return true;
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết
                _logger.LogError($"Error deleting order {id}: {ex.Message}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");

                if (ex.InnerException != null)
                {
                    _logger.LogError($"Inner exception: {ex.InnerException.Message}");
                }

                throw new BaseException.ValidationException("delete_failed", $"Không thể xóa đơn hàng. Lỗi: {ex.Message}");
            }
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
                    Id = ct.Id.ToString(),
                    MaDonHang = ct.MaDonHang.ToString(),
                    MaSanPham = ct.MaSanPham.ToString(),
                    TenSanPham = ct.MaSanPhamNavigation?.TenSanPham ?? "Không xác định",
                    SoLuong = ct.SoLuong,
                    DonGia = ct.DonGia
                }).ToList()
            }).ToList();
        }

        /// <summary>
        /// Lấy danh sách đơn hàng đã hoàn thành của người dùng hiện tại
        /// </summary>
        public async Task<List<ViewResponseCreateDonHangDto>> GetCompletedOrdersAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new BaseException.ValidationException("invalid_user", "Thông tin người dùng không hợp lệ");
            }

            var donHangs = await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(dh =>
                    dh.MaNguoiDungNavigation.MaTaiKhoanNavigation.Id.ToString() == userId &&
                    dh.TrangThaiDonHang == "Hoàn thành")
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
                    Id = ct.Id.ToString(),
                    MaDonHang = ct.MaDonHang.ToString(),
                    MaSanPham = ct.MaSanPham.ToString(),
                    TenSanPham = ct.MaSanPhamNavigation?.TenSanPham ?? "Không xác định",
                    SoLuong = ct.SoLuong,
                    DonGia = ct.DonGia
                }).ToList()
            }).ToList();
        }

        /// <summary>
        /// Cập nhật trạng thái đơn hàng
        /// </summary>
        public async Task UpdateOrderStatusAsync(string orderId, string newStatus)
        {
            if (!Guid.TryParse(orderId, out Guid donHangId))
            {
                _logger.LogError($"Invalid orderId format for status update: {orderId}");
                return; // Or throw an exception, depending on desired behavior
            }

            var donHang = await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(dh => dh.Id == donHangId)
                .FirstOrDefaultAsync();

            if (donHang == null)
            {
                _logger.LogWarning($"Order not found for status update: {orderId}");
                return; // Or throw an exception
            }

            // Validate the new status (optional but recommended)
            try
            {
                ValidateTrangThaiDonHang(newStatus);
            }
            catch (BaseException.ValidationException ex)
            {
                _logger.LogError($"Invalid status provided for order {orderId}: {newStatus} - {ex.Message}");
                return; // Or handle as appropriate
            }

            donHang.TrangThaiDonHang = newStatus;

            await _unitOfWork.GetRepository<DonHang>().UpdateAsync(donHang);
            await _unitOfWork.GetRepository<DonHang>().SaveAsync();

            _logger.LogInformation($"Order {orderId} status updated to {newStatus}");
        }

        public async Task<DonHangDto> GetDonHangByIdAsync(string id)
        {
            if (!Guid.TryParse(id, out Guid donHangId))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID đơn hàng không hợp lệ");
            }

            var donHang = await _unitOfWork.GetRepository<DonHang>()
                .GetEntitiesWithCondition(dh => dh.Id == donHangId)
                .Include(dh => dh.MaNguoiDungNavigation)
                .Include(dh => dh.MaKhuyenMaiNavigation)
                .FirstOrDefaultAsync();

            if (donHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
            }

            return new DonHangDto
            {
                Id = donHang.Id.ToString(),
                TenNguoiDung = donHang.MaNguoiDungNavigation?.TenNguoiDung ?? "Không xác định",
                TongTien = donHang.TongTien,
                TrangThaiDonHang = donHang.TrangThaiDonHang,
                NgayDat = donHang.NgayDat,
                TenKhuyenMai = donHang.MaKhuyenMaiNavigation?.TenKhuyenMai
            };
        }
    }
}

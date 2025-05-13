using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.Utils;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Services
{
    public class LichBaoTriService : ILichBaoTriService
    {
        private readonly IUnitOfWork _unitOfWork;

        public LichBaoTriService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
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
                LoaiBaoTri = GetDesriptionHelper.GetDescription(e.LoaiBaoTri, typeof(TypeServiceHelper)),
                TrangThai = GetDesriptionHelper.GetDescription(e.TrangThai, typeof(TrangThaiLichBaoTri)),
                NguonPhatSinh = e.NguonPhatSinh,
                MaYeuCauDichVu = e.MaYeuCauDichVu?.ToString()
            }).ToList();
        }

        // 2. Lấy lịch bảo trì theo mã chi tiết đơn hàng
        public async Task<List<LichBaoTriDto>> GetLichBaoTriByChiTietIdAsync(int chiTietId)
        {
            var items = await _unitOfWork.GetRepository<LichBaoTri>()
                .GetEntitiesWithCondition(lb => lb.MaChiTietDonHang == chiTietId)
                .ToListAsync();

            return items.Select(e => new LichBaoTriDto
            {
                Id = e.Id.ToString(),
                MaChiTietDonHang = e.MaChiTietDonHang,
                NgayBaoTri = e.NgayBaoTri,
                LoaiBaoTri = GetDesriptionHelper.GetDescription(
                    GetDesriptionHelper.GetEnumNameByDescription<TypeServiceHelper>(e.LoaiBaoTri) ?? e.LoaiBaoTri,
                    typeof(TypeServiceHelper)
                ),
                TrangThai = GetDesriptionHelper.GetDescription(
                    GetDesriptionHelper.GetEnumNameByDescription<TrangThaiLichBaoTri>(e.TrangThai) ?? e.TrangThai,
                    typeof(TrangThaiLichBaoTri)
                ),
                NguonPhatSinh = e.NguonPhatSinh,
                MaYeuCauDichVu = e.MaYeuCauDichVu?.ToString()
            }).ToList();
        }

        // 2.1 Lấy lịch bảo trì theo mã đơn hàng
        public async Task<List<LichBaoTriDto>> GetLichBaoTriByDonHangIdAsync(string donHangId)
        {
            // Lấy tất cả chi tiết đơn hàng thuộc đơn hàng này
            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaDonHang.ToString() == donHangId)
                .ToListAsync();

            if (!chiTietDonHangs.Any())
                return new List<LichBaoTriDto>();

            // Lấy IDs của các chi tiết đơn hàng
            var chiTietIds = chiTietDonHangs.Select(ct => ct.Id).ToList();

            // Lấy tất cả lịch bảo trì liên quan đến các chi tiết đơn hàng này
            var lichBaoTris = await _unitOfWork.GetRepository<LichBaoTri>()
                .GetEntitiesWithCondition(lb => chiTietIds.Contains(lb.MaChiTietDonHang))
                .Include(lb => lb.MaChiTietDonHangNavigation)
                    .ThenInclude(ct => ct.MaSanPhamNavigation)
                .ToListAsync();

            return lichBaoTris.Select(e => new LichBaoTriDto
            {
                Id = e.Id.ToString(),
                MaChiTietDonHang = e.MaChiTietDonHang,
                NgayBaoTri = e.NgayBaoTri,
                LoaiBaoTri = GetDesriptionHelper.GetDescription(
                    GetDesriptionHelper.GetEnumNameByDescription<TypeServiceHelper>(e.LoaiBaoTri) ?? e.LoaiBaoTri,
                    typeof(TypeServiceHelper)
                ),
                TrangThai = GetDesriptionHelper.GetDescription(
                    GetDesriptionHelper.GetEnumNameByDescription<TrangThaiLichBaoTri>(e.TrangThai) ?? e.TrangThai,
                    typeof(TrangThaiLichBaoTri)
                ),
                NguonPhatSinh = e.NguonPhatSinh,
                MaYeuCauDichVu = e.MaYeuCauDichVu?.ToString(),
                TenSanPham = e.MaChiTietDonHangNavigation?.MaSanPhamNavigation?.TenSanPham ?? "Không xác định"
            }).ToList();
        }

        // 3. Lấy theo Id
        public async Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(string id)
        {
            var e = await _unitOfWork.GetRepository<LichBaoTri>()
                                 .GetByIdAsync(Guid.Parse(id));
            if (e == null) return null;

            return new LichBaoTriDto
            {
                Id = e.Id.ToString(),
                MaChiTietDonHang = e.MaChiTietDonHang,
                NgayBaoTri = e.NgayBaoTri,
                LoaiBaoTri = GetDesriptionHelper.GetDescription(e.LoaiBaoTri, typeof(TypeServiceHelper)),
                TrangThai = GetDesriptionHelper.GetDescription(e.TrangThai, typeof(TrangThaiLichBaoTri)),
                NguonPhatSinh = e.NguonPhatSinh,
                MaYeuCauDichVu = e.MaYeuCauDichVu?.ToString()
            };
        }

        // 4. Tạo mới
        public async Task<bool> CreateLichBaoTriAsync(CreateLichBaoTriDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            // Validate LoaiBaoTri
            ValidationHelper.ValidateTrangThai<TypeServiceHelper>(dto.LoaiBaoTri);

            // Validate TrangThai
            ValidationHelper.ValidateTrangThai<TrangThaiLichBaoTri>(dto.TrangThai);

            // Validate NgayBaoTri
            if (dto.NgayBaoTri < DateTime.Now)
            {
                throw new BaseException.BadRequestException("invalid_date", "Ngày bảo trì phải lớn hơn hoặc bằng ngày hiện tại");
            }

            var e = new LichBaoTri
            {
                Id = Guid.NewGuid(),
                MaChiTietDonHang = dto.MaChiTietDonHang,
                NgayBaoTri = dto.NgayBaoTri,
                LoaiBaoTri = dto.LoaiBaoTri,
                TrangThai = dto.TrangThai,
                NguonPhatSinh = "Yêu Cầu",
                MaYeuCauDichVu = string.IsNullOrEmpty(dto.MaYeuCauDichVu) ? null : Guid.Parse(dto.MaYeuCauDichVu)
            };

            await _unitOfWork.GetRepository<LichBaoTri>().InsertAsync(e);
            await _unitOfWork.SaveAsync();
            return true;
        }

        // 5. Cập nhật
        public async Task<bool> UpdateLichBaoTriAsync(Guid id, LichBaoTriDto dto)
        {
            var e = await _unitOfWork.GetRepository<LichBaoTri>()
                                 .GetByIdAsync(id);
            if (e == null) return false;

            // Validate LoaiBaoTri
            ValidationHelper.ValidateTrangThai<TypeServiceHelper>(dto.LoaiBaoTri);

            // Validate TrangThai
            ValidationHelper.ValidateTrangThai<TrangThaiLichBaoTri>(dto.TrangThai);

            // Validate NgayBaoTri
            if (dto.NgayBaoTri < DateTime.Now)
            {
                throw new BaseException.BadRequestException("invalid_date", "Ngày bảo trì phải lớn hơn hoặc bằng ngày hiện tại");
            }

            // Cập nhật tất cả các trường phù hợp
            e.MaChiTietDonHang = dto.MaChiTietDonHang;
            e.NgayBaoTri = dto.NgayBaoTri;
            e.LoaiBaoTri = dto.LoaiBaoTri;
            e.TrangThai = dto.TrangThai;
            e.NguonPhatSinh = "Yêu Cầu";
            e.MaYeuCauDichVu = string.IsNullOrEmpty(dto.MaYeuCauDichVu) ? null : Guid.Parse(dto.MaYeuCauDichVu);

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

        public async Task TaoLichBaoTriTuDonHangAsync(Guid maDonHang)
        {
            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(maDonHang);
            if (donHang == null || donHang.TrangThaiDonHang != "Hoàn thành")
                return;

            var chiTietDonHangs = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetEntitiesWithCondition(ct => ct.MaDonHang == maDonHang)
                .ToListAsync();

            foreach (var chiTiet in chiTietDonHangs)
            {
                var sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(chiTiet.MaSanPham);
                if (sanPham == null || sanPham.ThoiGianBaoHanh <= 0)
                    continue;

                int soDotBaoTri = sanPham.ThoiGianBaoHanh / 6;

                for (int i = 1; i <= soDotBaoTri; i++)
                {
                    var lich = new LichBaoTri
                    {
                        MaChiTietDonHang = chiTiet.Id,
                        NgayBaoTri = donHang.NgayDat.AddMonths(i * 6),
                        LoaiBaoTri = "Bảo trì",
                        TrangThai = "Chưa thông báo",
                        NguonPhatSinh = "Tự động",
                        MaYeuCauDichVu = null
                    };

                    await _unitOfWork.GetRepository<LichBaoTri>().InsertAsync(lich);
                }
            }

            await _unitOfWork.SaveAsync();
        }
        public async Task<bool> TaoLichBaoTriTuYeuCauAsync(string maYeuCau)
        {
            // Lấy yêu cầu dịch vụ
            var yeuCau = await _unitOfWork.GetRepository<YeuCauDichVu>()
                .GetByIdAsync(Guid.Parse(maYeuCau));

            if (yeuCau == null)
            {
                throw new BaseException.NotFoundException("not_found", "Yêu cầu dịch vụ không tồn tại");
            }

            // Kiểm tra yêu cầu đã được xác nhận chưa
            if (yeuCau.TrangThaiYeuCau != TrangThaiYeuCauDichVu.DaXacNhan.ToString().GetDescription(typeof(TrangThaiYeuCauDichVu)))
            {
                throw new BaseException.ValidationException("invalid_status", "Yêu cầu dịch vụ chưa được xác nhận");
            }

            // Kiểm tra quyền truy cập
            var chiTietDonHang = await _unitOfWork.GetRepository<ChiTietDonHang>()
                .GetByIdAsync(yeuCau.MaChiTietDonHang);
            if (chiTietDonHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Chi tiết đơn hàng không tồn tại");
            }

            var donHang = await _unitOfWork.GetRepository<DonHang>()
                .GetByIdAsync(chiTietDonHang.MaDonHang);
            if (donHang == null)
            {
                throw new BaseException.NotFoundException("not_found", "Đơn hàng không tồn tại");
            }

            // Kiểm tra đã có lịch bảo trì cho yêu cầu này chưa
            var existingLich = await _unitOfWork.GetRepository<LichBaoTri>()
                .GetAllAsync();
            if (existingLich.Any(x => x.MaYeuCauDichVu == Guid.Parse(maYeuCau)))
            {
                throw new BaseException.ValidationException("duplicate_schedule", "Đã có lịch bảo trì cho yêu cầu này");
            }

            // Kiểm tra khoảng thời gian giữa các lần bảo trì
            var sanPham = await _unitOfWork.GetRepository<SanPham>()
                .GetByIdAsync(chiTietDonHang.MaSanPham);

            if (sanPham != null)
            {
                // Lấy tất cả lịch bảo trì của sản phẩm
                var lichBaoTriSanPham = existingLich
                    .Where(l => l.MaChiTietDonHangNavigation.MaSanPham == sanPham.Id)
                    .OrderByDescending(l => l.NgayBaoTri)
                    .ToList();

                if (lichBaoTriSanPham.Any())
                {
                    var lastBaoTri = lichBaoTriSanPham.First();
                    var khoangThoiGian = yeuCau.NgayHen.ToDateTime(TimeOnly.MinValue) - lastBaoTri.NgayBaoTri;

                    // Kiểm tra khoảng thời gian tối thiểu (30 ngày)
                    if (khoangThoiGian.TotalDays < 30)
                    {
                        throw new BaseException.ValidationException("invalid_interval",
                            $"Khoảng thời gian giữa các lần bảo trì phải ít nhất 30 ngày. Lần bảo trì gần nhất là {lastBaoTri.NgayBaoTri:dd/MM/yyyy}");
                    }
                }
            }

            // Tạo lịch bảo trì mới
            var lichBaoTri = new LichBaoTri
            {
                MaChiTietDonHang = yeuCau.MaChiTietDonHang,
                NgayBaoTri = yeuCau.NgayHen.ToDateTime(TimeOnly.MinValue),
                LoaiBaoTri = yeuCau.LoaiDichVu,
                TrangThai = TrangThaiLichBaoTri.ChuaThongBao.ToString().GetDescription(typeof(TrangThaiLichBaoTri)),
                NguonPhatSinh = "Yêu Cầu",
                MaYeuCauDichVu = Guid.Parse(maYeuCau)
            };

            await _unitOfWork.GetRepository<LichBaoTri>().InsertAsync(lichBaoTri);
            await _unitOfWork.SaveAsync();

            return true;
        }

        // Cập nhật trạng thái lịch bảo trì
        public async Task<bool> UpdateTrangThaiLichBaoTriAsync(Guid id, string trangThai)
        {
            var lichBaoTri = await _unitOfWork.GetRepository<LichBaoTri>()
                                 .GetByIdAsync(id);

            if (lichBaoTri == null) return false;

            try
            {
                // Xác định giá trị hiển thị hợp lệ để lưu vào database
                string displayValue;

                // Nếu đầu vào là giá trị hiển thị, sử dụng trực tiếp
                if (trangThai == "Đã thông báo" || trangThai == "Chưa thông báo")
                {
                    displayValue = trangThai;
                }
                // Nếu đầu vào là tên enum, chuyển đổi thành giá trị hiển thị
                else if (Enum.TryParse<TrangThaiLichBaoTri>(trangThai, out var enumValue))
                {
                    displayValue = trangThai.GetDescription(typeof(TrangThaiLichBaoTri));
                }
                // Nếu không phải giá trị hợp lệ, báo lỗi
                else
                {
                    throw new BaseException.ValidationException("invalid_status", $"Trạng thái '{trangThai}' không hợp lệ");
                }

                // Cập nhật trường trạng thái với giá trị hiển thị
                lichBaoTri.TrangThai = displayValue;

                _unitOfWork.GetRepository<LichBaoTri>().Update(lichBaoTri);
                await _unitOfWork.SaveAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi cập nhật trạng thái: {ex.Message}");
                throw;
            }
        }
    }
}

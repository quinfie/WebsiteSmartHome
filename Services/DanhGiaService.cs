using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace WebsiteSmartHome.Services
{
    public class DanhGiaService : IDanhGiaService
    {
        private readonly IUnitOfWork _unitOfWork;

        // Constructor: inject UnitOfWork để quản lý các repository
        public DanhGiaService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // Lấy danh sách tất cả đánh giá
        public async Task<List<DanhGiaDto>> GetAllDanhGiaAsync()
        {
            var danhGias = await _unitOfWork.GetRepository<DanhGia>().GetAllAsync();
            return danhGias.Select(d => new DanhGiaDto
            {
                Id = d.Id.ToString(),
                MaDonHang = d.MaDonHang.ToString(),
                MaSanPham = d.MaSanPham.ToString(),
                SoSao = d.SoSao,
                NoiDung = d.NoiDung,
                NgayDanhGia = d.NgayDanhGia
            }).ToList();
        }

        // Lấy chi tiết đánh giá theo Id
        public async Task<DanhGiaDto?> GetDanhGiaByIdAsync(string id)
        {
            // Kiểm tra và chuyển đổi string sang Guid
            if (!Guid.TryParse(id, out var guid))
                throw BaseException.BadRequest("ID không hợp lệ");

            var danhGia = await _unitOfWork.GetRepository<DanhGia>().GetByIdAsync(guid);
            if (danhGia == null) return null;

            return new DanhGiaDto
            {
                Id = danhGia.Id.ToString(),
                MaDonHang = danhGia.MaDonHang.ToString(),
                MaSanPham = danhGia.MaSanPham.ToString(),
                SoSao = danhGia.SoSao,
                NoiDung = danhGia.NoiDung,
                NgayDanhGia = danhGia.NgayDanhGia
            };
        }

        // Thêm mới đánh giá
        public async Task<bool> CreateDanhGiaAsync(CreateDanhGiaDto dto)
        {
            // Kiểm tra mã đơn hàng và sản phẩm hợp lệ
            if (!Guid.TryParse(dto.MaDonHang, out Guid maDonHang) ||
                !Guid.TryParse(dto.MaSanPham, out Guid maSanPham))
            {
                throw BaseException.BadRequest("Mã đơn hàng hoặc mã sản phẩm không hợp lệ.");
            }

            // Kiểm tra xem đánh giá cho cặp đơn hàng và sản phẩm này đã tồn tại chưa
            var existingReview = await _unitOfWork.GetRepository<DanhGia>()
                 .FindByCondition(dg => dg.MaDonHang == maDonHang && dg.MaSanPham == maSanPham)
                 .FirstOrDefaultAsync();

            if (existingReview != null)
            {
                // Đánh giá đã tồn tại, không cần tạo mới. Có thể xem là thành công.
                return true;
            }

            // Tạo đối tượng đánh giá mới
            var danhGia = new DanhGia
            {
                Id = Guid.NewGuid(),
                MaDonHang = maDonHang,
                MaSanPham = maSanPham,
                SoSao = dto.SoSao,
                NoiDung = dto.NoiDung,
                NgayDanhGia = DateTime.Now // Tự động set ngày
            };

            // Thêm vào DB
            await _unitOfWork.GetRepository<DanhGia>().InsertAsync(danhGia);
            await _unitOfWork.SaveAsync();
            return true;
        }

        // Cập nhật nội dung đánh giá theo mã đơn hàng và mã sản phẩm
        public async Task<bool> UpdateDanhGiaAsync(string maDonHang, string maSanPham, UpdateDanhGiaDto dto)
        {
            // Kiểm tra đầu vào
            if (!Guid.TryParse(maDonHang, out Guid donHangId) || !Guid.TryParse(maSanPham, out Guid sanPhamId))
                throw BaseException.BadRequest("Mã đơn hàng hoặc mã sản phẩm không hợp lệ.");

            // Tìm đánh giá cần cập nhật
            var danhGia = await _unitOfWork.GetRepository<DanhGia>()
                 .FindByCondition(dg => dg.MaDonHang == donHangId && dg.MaSanPham == sanPhamId)
                 .FirstOrDefaultAsync();

            if (danhGia == null)
                return false;

            // Gán giá trị mới
            danhGia.SoSao = dto.SoSao;
            danhGia.NoiDung = dto.NoiDung;
            danhGia.NgayDanhGia = DateTime.Now;

            // Cập nhật vào DB
            _unitOfWork.GetRepository<DanhGia>().Update(danhGia);
            await _unitOfWork.SaveAsync();
            return true;
        }

        // Xóa đánh giá theo Id
        public async Task<bool> DeleteDanhGiaAsync(string id)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGia>().GetByIdAsync(id);
            if (danhGia == null)
                return false;

            await _unitOfWork.GetRepository<DanhGia>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }

        // Lấy danh sách đánh giá theo Mã đơn hàng
        public async Task<List<DanhGiaDto>> GetDanhGiaByMaDonHangAsync(string maDonHang)
        {
            // Kiểm tra và chuyển đổi string sang Guid
            if (!Guid.TryParse(maDonHang, out var guid))
                throw BaseException.BadRequest("Mã đơn hàng không hợp lệ");

            var danhGias = await _unitOfWork.GetRepository<DanhGia>()
                 .FindByCondition(dg => dg.MaDonHang == guid)
                 .Select(dg => new DanhGiaDto
                 {
                     Id = dg.Id.ToString(),
                     MaDonHang = dg.MaDonHang.ToString(),
                     MaSanPham = dg.MaSanPham.ToString(),
                     SoSao = dg.SoSao,
                     NoiDung = dg.NoiDung,
                     NgayDanhGia = dg.NgayDanhGia
                 })
                 .ToListAsync();

            return danhGias;
        }

        // Tìm đánh giá theo nội dung chứa chuỗi nhập vào
        public async Task<List<DanhGiaDto>> SearchDanhGiaByContentAsync(string content)
        {
            var danhGias = await _unitOfWork.GetRepository<DanhGia>()
                .FindByCondition(dg => dg.NoiDung != null && dg.NoiDung.Contains(content))
                .Select(dg => new DanhGiaDto
                {
                    Id = dg.Id.ToString(),
                    MaDonHang = dg.MaDonHang.ToString(),
                    MaSanPham = dg.MaSanPham.ToString(),
                    SoSao = dg.SoSao,
                    NoiDung = dg.NoiDung
                })
                .ToListAsync();

            return danhGias;
        }

        // Lấy danh sách đánh giá theo Mã sản phẩm
        public async Task<PagedResponse<DanhGiaDto>> GetDanhGiaByMaSanPhamAsync(string maSanPham, int pageNumber, int pageSize)
        {
            // Kiểm tra và chuyển đổi string sang Guid
            if (!Guid.TryParse(maSanPham, out var guid))
                throw BaseException.BadRequest("Mã sản phẩm không hợp lệ");

            var query = _unitOfWork.GetRepository<DanhGia>()
                 .FindByCondition(dg => dg.MaSanPham == guid);

            var totalCount = await query.CountAsync();

            var danhGias = await query
                 .Skip((pageNumber - 1) * pageSize)
                 .Take(pageSize)
                 .Select(dg => new DanhGiaDto
                 {
                     Id = dg.Id.ToString(),
                     MaDonHang = dg.MaDonHang.ToString(),
                     MaSanPham = dg.MaSanPham.ToString(),
                     SoSao = dg.SoSao,
                     NoiDung = dg.NoiDung,
                     NgayDanhGia = dg.NgayDanhGia
                 })
                 .ToListAsync();

            return new PagedResponse<DanhGiaDto>(danhGias, pageNumber, pageSize, totalCount);
        }

        public async Task<DanhGiaDetailDto?> GetDanhGiaDetailByIdAsync(string id)
        {
            if (!Guid.TryParse(id, out var guid))
                throw BaseException.BadRequest("ID không hợp lệ");

            var danhGia = await _unitOfWork.GetRepository<DanhGia>().GetByIdAsync(guid);
            if (danhGia == null) return null;

            // Lấy thông tin liên quan
            var donHang = await _unitOfWork.GetRepository<DonHang>().GetByIdAsync(danhGia.MaDonHang);
            var nguoiDung = donHang != null ? await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(donHang.MaNguoiDung) : null;
            var sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(danhGia.MaSanPham);

            return new DanhGiaDetailDto
            {
                Id = danhGia.Id.ToString(),
                MaDonHang = danhGia.MaDonHang.ToString(),
                MaSanPham = danhGia.MaSanPham.ToString(),
                MaNguoiDung = donHang?.MaNguoiDung.ToString() ?? "",
                SoSao = danhGia.SoSao,
                NoiDung = danhGia.NoiDung,
                NgayDanhGia = danhGia.NgayDanhGia,
                TenNguoiDung = nguoiDung?.TenNguoiDung ?? "",
                TenSanPham = sanPham?.TenSanPham ?? "",
                NgayDatHang = donHang?.NgayDat
            };
        }
    }
}

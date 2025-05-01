using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
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
    }
}

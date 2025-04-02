using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.IServices;

namespace WebsiteSmartHome.Services
{
    public class SanPhamService : ISanPhamService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SanPhamService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IUnitOfWork GetUnitOfWork()
        {
            return _unitOfWork;
        }

        public async Task<List<SanPhamDto>> GetAllSanPhamAsync()
        {
            var sanPhams = await _unitOfWork.GetRepository<SanPham>().GetAllAsync();
            if (sanPhams == null || !sanPhams.Any()) return new List<SanPhamDto>();

            return sanPhams.Select(d => new SanPhamDto
            {
                Id = d.Id,
                TenSanPham = d.TenSanPham,
                Gia = d.Gia,
                SoLuongTon = d.SoLuongTon,
                ThoiGianBaoHanh = d.ThoiGianBaoHanh,
                ThoiGianBaoTri = d.ThoiGianBaoTri,
                MoTa = d.MoTa,
                MaDanhMuc = d.MaDanhMuc,
                MaNhaCungCap = d.MaNhaCungCap,
                MaKho = d.MaKho
            }).ToList();
        }

        public async Task<SanPham?> GetSanPhamByIdAsync(Guid id)
        {
            return await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(id);
        }

        public async Task<bool> CreateSanPhamAsync(SanPhamDto dto)
        {
            if (dto == null) return false;

            // Kiểm tra khóa ngoại trước khi tạo sản phẩm
            var danhMuc = await _unitOfWork.GetRepository<DanhMuc>().GetByIdAsync(dto.MaDanhMuc);
            var nhaCungCap = await _unitOfWork.GetRepository<NhaCungCap>().GetByIdAsync(dto.MaNhaCungCap);
            var kho = await _unitOfWork.GetRepository<Kho>().GetByIdAsync(dto.MaKho);

            if (danhMuc == null) throw new Exception("Danh mục không tồn tại.");
            if (nhaCungCap == null) throw new Exception("Nhà cung cấp không tồn tại.");
            if (kho == null) throw new Exception("Kho không tồn tại.");

            var sanPham = new SanPham
            {
                Id = Guid.NewGuid(),
                TenSanPham = dto.TenSanPham,
                Gia = dto.Gia,
                SoLuongTon = dto.SoLuongTon,
                ThoiGianBaoHanh = dto.ThoiGianBaoHanh,
                ThoiGianBaoTri = dto.ThoiGianBaoTri,
                MoTa = dto.MoTa,
                MaDanhMuc = dto.MaDanhMuc,
                MaNhaCungCap = dto.MaNhaCungCap,
                MaKho = dto.MaKho
            };

            await _unitOfWork.GetRepository<SanPham>().InsertAsync(sanPham);
            await _unitOfWork.SaveAsync();
            return true;
        }


        public async Task<bool> UpdateSanPhamAsync(SanPhamDto dto)
        {
            if (dto == null) return false;
            var sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(dto.Id);
            if (sanPham == null) return false;

            sanPham.TenSanPham = dto.TenSanPham;
            sanPham.Gia = dto.Gia;
            sanPham.SoLuongTon = dto.SoLuongTon;
            sanPham.ThoiGianBaoHanh = dto.ThoiGianBaoHanh;
            sanPham.ThoiGianBaoTri = dto.ThoiGianBaoTri;
            sanPham.MoTa = dto.MoTa;
            sanPham.MaDanhMuc = dto.MaDanhMuc;
            sanPham.MaNhaCungCap = dto.MaNhaCungCap;
            sanPham.MaKho = dto.MaKho;

            _unitOfWork.GetRepository<SanPham>().Update(sanPham);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteSanPhamAsync(Guid id)
        {
            var sanPham = await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(id);
            if (sanPham == null) return false;

            await _unitOfWork.GetRepository<SanPham>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}

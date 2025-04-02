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
                MoTa = d.MoTa
            }).ToList();
        }

        public async Task<SanPham?> GetSanPhamByIdAsync(Guid id)
        {
            return await _unitOfWork.GetRepository<SanPham>().GetByIdAsync(id);
        }

        public async Task<bool> CreateSanPhamAsync(SanPhamDto dto)
        {
            if (dto == null) return false;

            var sanPham = new SanPham
            {
                Id = Guid.NewGuid(),
                TenSanPham = dto.TenSanPham,
                Gia = dto.Gia,
                SoLuongTon = dto.SoLuongTon,
                ThoiGianBaoHanh = dto.ThoiGianBaoHanh,
                ThoiGianBaoTri = dto.ThoiGianBaoTri,
                MoTa = dto.MoTa
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

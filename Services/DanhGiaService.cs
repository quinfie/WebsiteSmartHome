using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class DanhGiaService : IDanhGiaService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DanhGiaService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<DanhGiaDto>> GetAllDanhGiaAsync()
        {
            var danhGias = await _unitOfWork.GetRepository<DanhGium>().GetAllAsync();
            return danhGias.Select(d => new DanhGiaDto
            {
                Id = d.Id,
                MaDonHang = d.MaDonHang,
                MaSanPham = d.MaSanPham,
                SoSao = d.SoSao,
                NoiDung = d.NoiDung,
                NgayDanhGia = d.NgayDanhGia
            }).ToList();
        }

        public async Task<DanhGiaDto?> GetDanhGiaByIdAsync(Guid id)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGium>().GetByIdAsync(id);
            if (danhGia == null)
                return null;

            return new DanhGiaDto
            {
                Id = danhGia.Id,
                MaDonHang = danhGia.MaDonHang,
                MaSanPham = danhGia.MaSanPham,
                SoSao = danhGia.SoSao,
                NoiDung = danhGia.NoiDung,
                NgayDanhGia = danhGia.NgayDanhGia
            };
        }

        public async Task<bool> CreateDanhGiaAsync(DanhGiaDto danhGiaDto)
        {
            var danhGia = new DanhGium
            {
                MaDonHang = danhGiaDto.MaDonHang,
                MaSanPham = danhGiaDto.MaSanPham,
                SoSao = danhGiaDto.SoSao,
                NoiDung = danhGiaDto.NoiDung,
                NgayDanhGia = danhGiaDto.NgayDanhGia
            };

            await _unitOfWork.GetRepository<DanhGium>().InsertAsync(danhGia);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateDanhGiaAsync(Guid id, DanhGiaDto danhGiaDto)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGium>().GetByIdAsync(id);
            if (danhGia == null)
                return false;

            danhGia.SoSao = danhGiaDto.SoSao;
            danhGia.NoiDung = danhGiaDto.NoiDung;
            danhGia.NgayDanhGia = danhGiaDto.NgayDanhGia;

            _unitOfWork.GetRepository<DanhGium>().Update(danhGia);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteDanhGiaAsync(Guid id)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGium>().GetByIdAsync(id);
            if (danhGia == null)
                return false;

            await _unitOfWork.GetRepository<DanhGium>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}

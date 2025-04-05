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

        public DanhGiaService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

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


        public async Task<DanhGiaDto?> GetDanhGiaByIdAsync(string id)
        {
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


        public async Task<bool> CreateDanhGiaAsync(DanhGiaDto dto)
        {
            if (!Guid.TryParse(dto.MaDonHang, out Guid maDonHang) ||
                !Guid.TryParse(dto.MaSanPham, out Guid maSanPham))
            {
                throw BaseException.BadRequest("Mã đơn hàng hoặc mã sản phẩm không hợp lệ.");
            }

            var danhGia = new DanhGia
            {
                Id = Guid.NewGuid(),
                MaDonHang = maDonHang,
                MaSanPham = maSanPham,
                SoSao = dto.SoSao,
                NoiDung = dto.NoiDung,
                NgayDanhGia = dto.NgayDanhGia
            };

            await _unitOfWork.GetRepository<DanhGia>().InsertAsync(danhGia);
            await _unitOfWork.SaveAsync();
            return true;
        }


        public async Task<bool> UpdateDanhGiaAsync(string id, DanhGiaDto danhGiaDto)
        {
            if (!Guid.TryParse(id, out Guid guid))
                throw BaseException.BadRequest("ID không hợp lệ");

            var danhGia = await _unitOfWork.GetRepository<DanhGia>().GetByIdAsync(guid);
            if (danhGia == null)
                return false;

            danhGia.SoSao = danhGiaDto.SoSao;
            danhGia.NoiDung = danhGiaDto.NoiDung;
            danhGia.NgayDanhGia = danhGiaDto.NgayDanhGia;

            _unitOfWork.GetRepository<DanhGia>().Update(danhGia);
            await _unitOfWork.SaveAsync();
            return true;
        }


        public async Task<bool> DeleteDanhGiaAsync(string id)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGia>().GetByIdAsync(id);
            if (danhGia == null)
                return false;

            await _unitOfWork.GetRepository<DanhGia>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }
        public async Task<List<DanhGiaDto>> SearchDanhGiaByContentAsync(string content)
        {
            var danhGias = await _unitOfWork.GetRepository<DanhGia>()
                .FindByCondition(dg => dg.NoiDung.Contains(content))
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

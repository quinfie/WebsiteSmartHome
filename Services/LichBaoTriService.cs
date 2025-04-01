using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class LichBaoTriService : ILichBaoTriService
    {
        private readonly IUnitOfWork _unitOfWork;

        public LichBaoTriService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<LichBaoTriDto>> GetAllLichBaoTriAsync()
        {
            var lichBaoTris = await _unitOfWork.GetRepository<LichBaoTri>().GetAllAsync();
            return lichBaoTris.Select(l => new LichBaoTriDto
            {
                Id = l.Id,
                MaDonHang = l.MaDonHang,
                MaSanPham = l.MaSanPham,
                NgayBaoTriKeTiep = l.NgayBaoTriKeTiep,
                DaThongBao = l.DaThongBao
            }).ToList();
        }

        public async Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(Guid id)
        {
            var lichBaoTri = await _unitOfWork.GetRepository<LichBaoTri>().GetByIdAsync(id);
            if (lichBaoTri == null)
                return null;

            return new LichBaoTriDto
            {
                Id = lichBaoTri.Id,
                MaDonHang = lichBaoTri.MaDonHang,
                MaSanPham = lichBaoTri.MaSanPham,
                NgayBaoTriKeTiep = lichBaoTri.NgayBaoTriKeTiep,
                DaThongBao = lichBaoTri.DaThongBao
            };
        }

        public async Task<bool> CreateLichBaoTriAsync(LichBaoTriDto lichBaoTriDto)
        {
            var lichBaoTri = new LichBaoTri
            {
                MaDonHang = lichBaoTriDto.MaDonHang,
                MaSanPham = lichBaoTriDto.MaSanPham,
                NgayBaoTriKeTiep = lichBaoTriDto.NgayBaoTriKeTiep,
                DaThongBao = lichBaoTriDto.DaThongBao
            };

            await _unitOfWork.GetRepository<LichBaoTri>().InsertAsync(lichBaoTri);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateLichBaoTriAsync(Guid id, LichBaoTriDto lichBaoTriDto)
        {
            var lichBaoTri = await _unitOfWork.GetRepository<LichBaoTri>().GetByIdAsync(id);
            if (lichBaoTri == null)
                return false;

            lichBaoTri.NgayBaoTriKeTiep = lichBaoTriDto.NgayBaoTriKeTiep;
            lichBaoTri.DaThongBao = lichBaoTriDto.DaThongBao;

            _unitOfWork.GetRepository<LichBaoTri>().Update(lichBaoTri);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteLichBaoTriAsync(Guid id)
        {
            var lichBaoTri = await _unitOfWork.GetRepository<LichBaoTri>().GetByIdAsync(id);
            if (lichBaoTri == null)
                return false;

            await _unitOfWork.GetRepository<LichBaoTri>().DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}

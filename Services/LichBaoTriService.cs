using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.IServices;

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
            var lichBaoTris = await _unitOfWork.GetRepository<LichBaoTri>()
                .GetAllAsync();
            return lichBaoTris.Select(l => new LichBaoTriDto
            {
                Id = l.Id.ToString(), // Chuyển Guid thành string
                MaDonHang = l.MaDonHang.ToString(), // Chuyển Guid thành string
                MaSanPham = l.MaSanPham.ToString(), // Chuyển Guid thành string
                NgayBaoTriKeTiep = l.NgayBaoTriKeTiep,
                DaThongBao = l.DaThongBao
            }).ToList();
        }

        public async Task<List<LichBaoTriDto>> SearchLichBaoTriByOrderAsync(Guid orderId)
        {
            var lichBaoTris = await _unitOfWork.GetRepository<LichBaoTri>()
                .FindByCondition(lb => lb.MaDonHang == orderId)
                .Select(lb => new LichBaoTriDto
                {
                    Id = lb.Id.ToString(),
                    MaDonHang = lb.MaDonHang.ToString(),
                    MaSanPham = lb.MaSanPham.ToString(),
                    NgayBaoTriKeTiep = lb.NgayBaoTriKeTiep,
                    DaThongBao = lb.DaThongBao
                })
                .ToListAsync();

            return lichBaoTris;
        }

        public async Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(Guid id)
        {
            var lichBaoTri = await _unitOfWork.GetRepository<LichBaoTri>()
                .GetByIdAsync(id);
            if (lichBaoTri == null)
                return null;

            return new LichBaoTriDto
            {
                Id = lichBaoTri.Id.ToString(),
                MaDonHang = lichBaoTri.MaDonHang.ToString(),
                MaSanPham = lichBaoTri.MaSanPham.ToString(),
                NgayBaoTriKeTiep = lichBaoTri.NgayBaoTriKeTiep,
                DaThongBao = lichBaoTri.DaThongBao
            };
        }

        public async Task<bool> CreateLichBaoTriAsync(LichBaoTriDto lichBaoTriDto)
        {
            if (lichBaoTriDto == null)
                throw new ArgumentNullException(nameof(lichBaoTriDto), "Dữ liệu không hợp lệ");

            var donHang = await _unitOfWork.GetRepository<ChiTietDonHang>().FindByCondition(d => d.MaDonHang.ToString() == lichBaoTriDto.MaDonHang).FirstOrDefaultAsync();
            if (donHang == null)
                throw new ArgumentException("Mã đơn hàng không tồn tại");

            //var sanPham = await _unitOfWork.GetRepository<SanPham>().FindByCondition(s => s.MaSanPham.ToString() == lichBaoTriDto.MaSanPham).FirstOrDefaultAsync();
            //if (sanPham == null)
            //    throw new ArgumentException("Mã sản phẩm không tồn tại");

            var lichBaoTri = new LichBaoTri
            {
                MaDonHang = Guid.Parse(lichBaoTriDto.MaDonHang), // Chuyển string thành Guid
                MaSanPham = Guid.Parse(lichBaoTriDto.MaSanPham), // Chuyển string thành Guid
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

            lichBaoTri.MaSanPham = Guid.Parse(lichBaoTriDto.MaSanPham); // Chuyển string thành Guid
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

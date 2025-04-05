using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
<<<<<<< HEAD
<<<<<<< HEAD
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.IServices;
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;

<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

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
<<<<<<< HEAD
<<<<<<< HEAD
            var lichBaoTris = await _unitOfWork.GetRepository<LichBaoTri>()
                .GetAllAsync();
            return lichBaoTris.Select(l => new LichBaoTriDto
            {
                Id = l.Id.ToString(), // Chuyển Guid thành string
                MaDonHang = l.MaDonHang.ToString(), // Chuyển Guid thành string
                MaSanPham = l.MaSanPham.ToString(), // Chuyển Guid thành string
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            var lichBaoTris = await _unitOfWork.GetRepository<LichBaoTri>().GetAllAsync();
            return lichBaoTris.Select(l => new LichBaoTriDto
            {
                Id = l.Id,
                MaDonHang = l.MaDonHang,
                MaSanPham = l.MaSanPham,
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
                NgayBaoTriKeTiep = l.NgayBaoTriKeTiep,
                DaThongBao = l.DaThongBao
            }).ToList();
        }

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
        public async Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(Guid id)
        {
            var lichBaoTri = await _unitOfWork.GetRepository<LichBaoTri>().GetByIdAsync(id);
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
        public async Task<LichBaoTriDto?> GetLichBaoTriByIdAsync(Guid id)
        {
            var lichBaoTri = await _unitOfWork.GetRepository<LichBaoTri>().GetByIdAsync(id);
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            if (lichBaoTri == null)
                return null;

            return new LichBaoTriDto
            {
<<<<<<< HEAD
<<<<<<< HEAD
                Id = lichBaoTri.Id.ToString(),
                MaDonHang = lichBaoTri.MaDonHang.ToString(),
                MaSanPham = lichBaoTri.MaSanPham.ToString(),
=======
                Id = lichBaoTri.Id,
                MaDonHang = lichBaoTri.MaDonHang,
                MaSanPham = lichBaoTri.MaSanPham,
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
                Id = lichBaoTri.Id,
                MaDonHang = lichBaoTri.MaDonHang,
                MaSanPham = lichBaoTri.MaSanPham,
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
                NgayBaoTriKeTiep = lichBaoTri.NgayBaoTriKeTiep,
                DaThongBao = lichBaoTri.DaThongBao
            };
        }

        public async Task<bool> CreateLichBaoTriAsync(LichBaoTriDto lichBaoTriDto)
        {
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            var lichBaoTri = new LichBaoTri
            {
                MaDonHang = lichBaoTriDto.MaDonHang,
                MaSanPham = lichBaoTriDto.MaSanPham,
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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

<<<<<<< HEAD
<<<<<<< HEAD
            lichBaoTri.MaSanPham = Guid.Parse(lichBaoTriDto.MaSanPham); // Chuyển string thành Guid
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        public async Task<List<LichBaoTriDto>> SearchLichBaoTriByOrderAsync(Guid orderId)
        {
            return await _unitOfWork.GetRepository<LichBaoTri>()
                .FindByCondition(lb => lb.MaDonHang == orderId)
                .Select(lb => new LichBaoTriDto
                {
                    Id = lb.Id,
                    MaDonHang = lb.MaDonHang,
                    MaSanPham = lb.MaSanPham,
                    NgayBaoTriKeTiep = lb.NgayBaoTriKeTiep
                })
                .ToListAsync();
        }

<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
    }
}

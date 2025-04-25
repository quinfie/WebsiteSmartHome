<<<<<<< HEAD
﻿using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
=======
<<<<<<< HEAD
<<<<<<< HEAD
﻿using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
=======
﻿using WebsiteSmartHome.Core.DTOs;
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
﻿using WebsiteSmartHome.Core.DTOs;
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> main
            var danhGias = await _unitOfWork.GetRepository<DanhGia>().GetAllAsync();
            return danhGias.Select(d => new DanhGiaDto
            {
                Id = d.Id.ToString(),
                MaDonHang = d.MaDonHang.ToString(),
                MaSanPham = d.MaSanPham.ToString(),
<<<<<<< HEAD
=======
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            var danhGias = await _unitOfWork.GetRepository<DanhGium>().GetAllAsync();
            return danhGias.Select(d => new DanhGiaDto
            {
                Id = d.Id,
                MaDonHang = d.MaDonHang,
                MaSanPham = d.MaSanPham,
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
                SoSao = d.SoSao,
                NoiDung = d.NoiDung,
                NgayDanhGia = d.NgayDanhGia
            }).ToList();
        }

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> main

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
<<<<<<< HEAD
=======
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
                SoSao = danhGia.SoSao,
                NoiDung = danhGia.NoiDung,
                NgayDanhGia = danhGia.NgayDanhGia
            };
        }

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> main

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
<<<<<<< HEAD
=======
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
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
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
            await _unitOfWork.SaveAsync();
            return true;
        }

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> main

        public async Task<bool> UpdateDanhGiaAsync(string id, DanhGiaDto danhGiaDto)
        {
            if (!Guid.TryParse(id, out Guid guid))
                throw BaseException.BadRequest("ID không hợp lệ");

            var danhGia = await _unitOfWork.GetRepository<DanhGia>().GetByIdAsync(guid);
<<<<<<< HEAD
=======
=======
        public async Task<bool> UpdateDanhGiaAsync(Guid id, DanhGiaDto danhGiaDto)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGium>().GetByIdAsync(id);
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
        public async Task<bool> UpdateDanhGiaAsync(Guid id, DanhGiaDto danhGiaDto)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGium>().GetByIdAsync(id);
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
            if (danhGia == null)
                return false;

            danhGia.SoSao = danhGiaDto.SoSao;
            danhGia.NoiDung = danhGiaDto.NoiDung;
            danhGia.NgayDanhGia = danhGiaDto.NgayDanhGia;

<<<<<<< HEAD
            _unitOfWork.GetRepository<DanhGia>().Update(danhGia);
=======
<<<<<<< HEAD
<<<<<<< HEAD
            _unitOfWork.GetRepository<DanhGia>().Update(danhGia);
=======
            _unitOfWork.GetRepository<DanhGium>().Update(danhGia);
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
            _unitOfWork.GetRepository<DanhGium>().Update(danhGia);
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
            await _unitOfWork.SaveAsync();
            return true;
        }

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> main

        public async Task<bool> DeleteDanhGiaAsync(string id)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGia>().GetByIdAsync(id);
            if (danhGia == null)
                return false;

            await _unitOfWork.GetRepository<DanhGia>().DeleteAsync(id);
<<<<<<< HEAD
=======
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
        public async Task<bool> DeleteDanhGiaAsync(Guid id)
        {
            var danhGia = await _unitOfWork.GetRepository<DanhGium>().GetByIdAsync(id);
            if (danhGia == null)
                return false;

            await _unitOfWork.GetRepository<DanhGium>().DeleteAsync(id);
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
            await _unitOfWork.SaveAsync();
            return true;
        }
        public async Task<List<DanhGiaDto>> SearchDanhGiaByContentAsync(string content)
        {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> main
            var danhGias = await _unitOfWork.GetRepository<DanhGia>()
                .FindByCondition(dg => dg.NoiDung.Contains(content))
                .Select(dg => new DanhGiaDto
                {
                    Id = dg.Id.ToString(),
                    MaDonHang = dg.MaDonHang.ToString(),
                    MaSanPham = dg.MaSanPham.ToString(),
<<<<<<< HEAD
=======
=======
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
            return await _unitOfWork.GetRepository<DanhGium>()
                .FindByCondition(dg => dg.NoiDung.Contains(content))
                .Select(dg => new DanhGiaDto
                {
                    Id = dg.Id,
                    MaDonHang = dg.MaDonHang,
                    MaSanPham = dg.MaSanPham,
<<<<<<< HEAD
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
                    SoSao = dg.SoSao,
                    NoiDung = dg.NoiDung
                })
                .ToListAsync();
<<<<<<< HEAD

            return danhGias;
        }
=======
<<<<<<< HEAD
<<<<<<< HEAD

            return danhGias;
        }
=======
        }

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
=======
        }

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0
>>>>>>> main
    }
}

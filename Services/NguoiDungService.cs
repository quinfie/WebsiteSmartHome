using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core.Utils;
using Microsoft.Data.SqlClient;

namespace WebsiteSmartHome.Services
{
    public class NguoiDungService : INguoiDungService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NguoiDungService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<IEnumerable<NguoiDungDto>> GetAllNguoiDungAsync()
        {
            IList<NguoiDung> list = await _unitOfWork.GetRepository<NguoiDung>().GetAllAsync();
            return list.Select(x => new NguoiDungDto
            {
                id = x.Id.ToString(),
                TenNguoiDung = x.TenNguoiDung,
                GioiTinh = x.GioiTinh!,
                NgaySinh = x.NgaySinh,
                Cccd = x.Cccd!,
                Sdt = x.Sdt!,
                DiaChi = x.DiaChi
            });
        }

        public async Task<NguoiDungDto?> GetNguoiDungByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new BaseException.BadRequestException("invalid_data", "Mã người dùng không được để trống");
            }

            Guid.TryParse(id, out Guid guidId);
            NguoiDung? nd = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(guidId);

            if (nd == null)
            {
                throw new BaseException.NotFoundException("not_found", "Người dùng không tồn tại");
            }

            return new NguoiDungDto
            {
                id = nd.Id.ToString(),
                TenNguoiDung = nd.TenNguoiDung,
                GioiTinh = nd.GioiTinh!,
                NgaySinh = nd.NgaySinh,
                Cccd = nd.Cccd!,
                Sdt = nd.Sdt!,
                DiaChi = nd.DiaChi
            };
        }

        private async Task CheckNguoiDungExistsAsync(NguoiDungCreateDto nguoiDungDto)
        {
            var existingCCCD = await _unitOfWork.GetRepository<NguoiDung>().FindByConditionAsync(t => t.Cccd == nguoiDungDto.Cccd);
            if (existingCCCD != null)
            {
                throw new BaseException.BadRequestException("duplicate", "CCCD đã tồn tại");
            }

            var existingSoDienThoai = await _unitOfWork.GetRepository<NguoiDung>().FindByConditionAsync(t => t.Sdt == nguoiDungDto.Sdt);
            if (existingSoDienThoai != null)
            {
                throw new BaseException.BadRequestException("duplicate", "Số điện thoại đã tồn tại");
            }
        }

        public async Task<NguoiDungCreateDto> AddNguoiDungAsync(NguoiDungCreateDto dto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (dto == null)
            {
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu người dùng không hợp lệ");
            }

            ValidationHelper.ValidateGioiTinh(dto.GioiTinh);
            ValidationHelper.ValidateDiaChi(dto.DiaChi);
            ValidationHelper.ValidateNgaySinh(dto.NgaySinh);
            ValidationHelper.ValidateSDT(dto.Sdt);
            ValidationHelper.ValidateCCCD(dto.Cccd);

            await CheckNguoiDungExistsAsync(dto);

            NguoiDung nguoiDung = new NguoiDung
            {
                TenNguoiDung = dto.TenNguoiDung,
                GioiTinh = dto.GioiTinh,
                NgaySinh = dto.NgaySinh,
                Cccd = dto.Cccd,
                Sdt = dto.Sdt,
                DiaChi = dto.DiaChi
            };

            try
            {
                await _unitOfWork.GetRepository<NguoiDung>().InsertAsync(nguoiDung);
                await _unitOfWork.SaveAsync();
                return dto;
            }
            catch (SqlException)
            {
                throw new BaseException.BadRequestException("server_error", "Lỗi hệ thống khi thêm tài khoản");
            }


        }

        //public async Task UpdateAsync(NguoiDungDto dto)
        //{
        //    if (string.IsNullOrWhiteSpace(dto.Id) || !Guid.TryParse(dto.Id, out var id))
        //        throw new BaseException.BadRequestException("invalid_id", "Mã người dùng không hợp lệ");

        //    var nd = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(id);
        //    if (nd == null)
        //        throw new BaseException.NotFoundException("not_found", "Không tìm thấy người dùng");

        //    nd.TenNguoiDung = dto.TenNguoiDung;
        //    nd.GioiTinh = dto.GioiTinh;
        //    nd.NgaySinh = dto.NgaySinh;
        //    nd.Cccd = dto.Cccd;
        //    nd.Sdt = dto.Sdt;
        //    nd.DiaChi = dto.DiaChi;

        //    _unitOfWork.GetRepository<NguoiDung>().Update(nd);
        //    await _unitOfWork.SaveAsync();
        //}

        //public async Task DeleteAsync(string id)
        //{
        //    if (!Guid.TryParse(id, out var guid))
        //        throw new BaseException.BadRequestException("invalid_id", "Mã người dùng không hợp lệ");

        //    var nd = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(guid);
        //    if (nd == null)
        //        throw new BaseException.NotFoundException("not_found", "Không tìm thấy người dùng");

        //    _unitOfWork.GetRepository<NguoiDung>().Delete(nd);
        //    await _unitOfWork.SaveAsync();
        //}

        public async Task<IEnumerable<NguoiDungDto>> SearchNguoiDungAsync(string keyword)
        {
            var query = _unitOfWork.GetRepository<NguoiDung>().Entities;

            query = query.Where(x =>
                x.TenNguoiDung.Contains(keyword) ||
                (x.Sdt != null && x.Sdt.Contains(keyword)) ||
                (x.Cccd != null && x.Cccd.Contains(keyword)));

            var result = await query.ToListAsync();

            return result.Select(x => new NguoiDungDto
            {
                id = x.Id.ToString(),
                TenNguoiDung = x.TenNguoiDung,
                GioiTinh = x.GioiTinh!,
                NgaySinh = x.NgaySinh!,
                Cccd = x.Cccd!,
                Sdt = x.Sdt!,
                DiaChi = x.DiaChi
            });
        }
    }


}

using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.Core;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core.DTOs;
using Microsoft.Data.SqlClient;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.IServices;


namespace WebsiteSmartHome.Services
{
    public class TaiKhoanService : ITaiKhoanService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TaiKhoanService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<IEnumerable<TaiKhoanDto>> GetTaiKhoanAsync()
        {
            var taiKhoanList = await _unitOfWork.GetRepository<TaiKhoan>().GetAllAsync();
            return taiKhoanList.Select(t => new TaiKhoanDto
            {
                Id = t.Id.ToString(),
                Email = t.Email,
                TenTaiKhoan = t.TenTaiKhoan,
                MaNguoiDung = t.MaNguoiDung.ToString(),
                MatKhau = t.MatKhau,
                TrangThai = t.TrangThai,
                MaVaiTro = t.MaVaiTro.ToString()
            });
        }

        public async Task<TaiKhoanDto?> GetTaiKhoanByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new BaseException.BadRequestException("invalid_data", "Mã người dùng không được để trống");
            }

            TaiKhoan? taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(id);

            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("not_found", "Tài khoản không tồn tại");
            }

            return new TaiKhoanDto
            {
                Id = taiKhoan.Id.ToString(),
                Email = taiKhoan.Email,
                TenTaiKhoan = taiKhoan.TenTaiKhoan,
                TrangThai = taiKhoan.TrangThai,
                MaVaiTro = taiKhoan.MaVaiTro.ToString()
            };
        }

        public async Task AddTaiKhoanAsync(TaiKhoanDto taiKhoanDto)
        {
            // Validate tài khoản trước khi thêm
            ValidateTaiKhoan(taiKhoanDto);

            // Kiểm tra trùng email, trùng tên tài khoản, trùng mã người dùng
            TaiKhoan? existingTaiKhoanByEmail = await _unitOfWork.GetRepository<TaiKhoan>().FindByConditionAsync(t => t.Email == taiKhoanDto.Email);
            if (existingTaiKhoanByEmail != null)
            {
                throw new BaseException.BadRequestException("duplicate", "Email đã tồn tại");
            }

            TaiKhoan? existingTaiKhoanByTenTaiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().FindByConditionAsync(t => t.TenTaiKhoan == taiKhoanDto.TenTaiKhoan);
            if (existingTaiKhoanByTenTaiKhoan != null)
            {
                throw new BaseException.BadRequestException("duplicate", "Tên tài khoản đã tồn tại");
            }

            VaiTro? vaiTro = await _unitOfWork.GetRepository<VaiTro>().GetByIdAsync(taiKhoanDto.MaVaiTro);

            if (vaiTro == null)
            {
                throw new BaseException.BadRequestException("not_found", "Vai trò không tồn tại");
            }

            // Tạo tài khoản mới
            var taiKhoan = new TaiKhoan
            {
                Email = taiKhoanDto.Email,
                TenTaiKhoan = taiKhoanDto.TenTaiKhoan,
                MatKhau = taiKhoanDto.MatKhau,
                MaVaiTro = vaiTro.Id,
                TrangThai = taiKhoanDto.TrangThai
            };

            try
            {
                // Thực hiện chèn tài khoản vào cơ sở dữ liệu
                await _unitOfWork.GetRepository<TaiKhoan>().InsertAsync(taiKhoan);
                await _unitOfWork.SaveAsync();
            }
            catch (SqlException)
            {
                throw new BaseException.BadRequestException("server_error", "Lỗi hệ thống khi thêm tài khoản");
            }
        }

        private void ValidateTaiKhoan(TaiKhoanDto taiKhoanDto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (taiKhoanDto == null)
            {
                throw new BaseException.BadRequestException("invalid_data", "Dữ liệu tài khoản không hợp lệ");
            }

            if (string.IsNullOrWhiteSpace(taiKhoanDto.Email) || string.IsNullOrWhiteSpace(taiKhoanDto.TenTaiKhoan))
            {
                throw new BaseException.BadRequestException("invalid_data", "Thông tin tài khoản không được để trống");
            }

            // Kiểm tra định dạng email
            if (!ValidationAccount.IsValidEmail(taiKhoanDto.Email))
            {
                throw new BaseException.BadRequestException("invalid_data", "Email không hợp lệ");
            }

            // Kiểm tra mật khẩu (ít nhất 8 ký tự)
            if (string.IsNullOrWhiteSpace(taiKhoanDto.MatKhau) || !ValidationAccount.IsValidPassword(taiKhoanDto.MatKhau))
            {
                throw new BaseException.BadRequestException("invalid_data", "Mật khẩu phải có ít nhất 8 ký tự");
            }

            // Kiểm tra trạng thái hợp lệ
            if (!Enum.IsDefined(typeof(AccountStatus), taiKhoanDto.TrangThai))
            {
                throw new BaseException.BadRequestException("invalid_data", "Trạng thái không hợp lệ");
            }
        }

        //public async Task<bool> UpdateTaiKhoanAsync(Guid id, TaiKhoanDto taiKhoanDto)
        //{
        //    //if (id == Guid.Empty)
        //    //{
        //    //    throw new BaseException.BadRequestException("invalid_id", "ID không hợp lệ");
        //    //}

        //    //if (taiKhoanDto == null || string.IsNullOrWhiteSpace(taiKhoanDto.Email) || string.IsNullOrWhiteSpace(taiKhoanDto.TenTaiKhoan))
        //    //{
        //    //    throw new BaseException.BadRequestException("invalid_data", "Thông tin tài khoản không được để trống");
        //    //}

        //    //var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(id);
        //    //if (taiKhoan == null)
        //    //{
        //    //    throw new BaseException.NotFoundException("tai_khoan_not_found", "Tài khoản không tồn tại");
        //    //}

        //    //taiKhoan.Email = taiKhoanDto.Email;
        //    //taiKhoan.TenTaiKhoan = taiKhoanDto.TenTaiKhoan;
        //    //taiKhoan.TrangThai = taiKhoanDto.TrangThai;
        //    //taiKhoan.MaVaiTro = taiKhoanDto.MaVaiTro;

        //    //_unitOfWork.GetRepository<TaiKhoan>().Update(taiKhoan);
        //    //await _unitOfWork.SaveAsync();
        //    return true;
        //}

        //public async Task<bool> DeleteTaiKhoanAsync(Guid id)
        //{
        //    if (id == Guid.Empty)
        //    {
        //        throw new BaseException.BadRequestException("invalid_id", "ID không hợp lệ");
        //    }

        //    var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(id);
        //    if (taiKhoan == null)
        //    {
        //        throw new BaseException.NotFoundException("tai_khoan_not_found", "Tài khoản không tồn tại");
        //    }

        //    _unitOfWork.GetRepository<TaiKhoan>().Delete(taiKhoan);
        //    await _unitOfWork.SaveAsync();
        //    return true;
        //}

        public async Task<IEnumerable<TaiKhoan>> SearchTaiKhoan(string? keyword, string? trangThai)
        {
            if (string.IsNullOrWhiteSpace(keyword) && string.IsNullOrWhiteSpace(trangThai))
            {
                throw new BaseException.BadRequestException("invalid_search", "Từ khóa tìm kiếm hoặc trạng thái không hợp lệ");
            }

            var repository = _unitOfWork.GetRepository<TaiKhoan>();
            IQueryable<TaiKhoan> query = repository.Entities;

            // Kiểm tra từ khóa tìm kiếm cho các trường TenTaiKhoan và Email
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(t => t.TenTaiKhoan.Contains(keyword) || t.Email.Contains(keyword));
            }

            // Kiểm tra trạng thái nếu có
            if (!string.IsNullOrWhiteSpace(trangThai))
            {
                query = query.Where(t => t.TrangThai.Equals(trangThai, StringComparison.OrdinalIgnoreCase));
            }

            return await query.ToListAsync();
        }
    }

}

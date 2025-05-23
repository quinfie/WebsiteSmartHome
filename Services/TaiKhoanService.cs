using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.Core;
using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core.DTOs;
using Microsoft.Data.SqlClient;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.IServices;
using System.ComponentModel;


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
            IList<TaiKhoan> taiKhoanList = await _unitOfWork.GetRepository<TaiKhoan>().GetAllAsync();

            return taiKhoanList.Select(t => new TaiKhoanDto
            {
                Id = t.Id.ToString(),
                TenTaiKhoan = t.TenTaiKhoan,
                MatKhau = t.MatKhau,
                Email = t.Email,
                TrangThai = t.TrangThai,
                NgayTao = t.NgayTao
            });
        }


        public async Task<TaiKhoanDto?> GetTaiKhoanByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new BaseException.BadRequestException("invalid_data", "Mã tài khoản không được để trống");
            }

            Guid.TryParse(id, out Guid guidId);
            TaiKhoan? taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(guidId);

            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("not_found", "Tài khoản không tồn tại");
            }

            return new TaiKhoanDto
            {
                Id = taiKhoan.Id.ToString(),
                TenTaiKhoan = taiKhoan.TenTaiKhoan,
                TrangThai = taiKhoan.TrangThai,
                MatKhau = taiKhoan.MatKhau,
                Email = taiKhoan.Email,
                NgayTao = taiKhoan.NgayTao,
                MaNguoiDung = taiKhoan.NguoiDung!.Id.ToString(),
            };
        }

        private async Task CheckTaiKhoanExistsAsync(TaiKhoanCreateDto taiKhoanDto)
        {
            var repo = _unitOfWork.GetRepository<TaiKhoan>();

            // Kiểm tra email hoặc tên tài khoản trùng
            var exists = await repo.FindByConditionAsync(t =>
                t.Email == taiKhoanDto.Email || t.TenTaiKhoan == taiKhoanDto.TenTaiKhoan);

            if (exists != null)
            {
                if (exists.Email == taiKhoanDto.Email)
                    throw new BaseException.BadRequestException("duplicate", "Email đã tồn tại");

                if (exists.TenTaiKhoan == taiKhoanDto.TenTaiKhoan)
                    throw new BaseException.BadRequestException("duplicate", "Tên tài khoản đã tồn tại");
            }
        }

        public async Task<TaiKhoanDto> AddTaiKhoanAsync(TaiKhoanCreateDto taiKhoanDto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (taiKhoanDto == null)
            {
                throw new BaseException.BadRequestException("invalid_input", "Dữ liệu tài khoản không hợp lệ");
            }

            // Kiểm tra email và tên tài khoản
            if (string.IsNullOrWhiteSpace(taiKhoanDto.Email) || string.IsNullOrWhiteSpace(taiKhoanDto.TenTaiKhoan))
            {
                throw new BaseException.BadRequestException("invalid_input", "Email và tên tài khoản không được để trống");
            }

            // Kiểm tra mật khẩu
            if (string.IsNullOrWhiteSpace(taiKhoanDto.MatKhau))
            {
                throw new BaseException.BadRequestException("invalid_input", "Mật khẩu không được để trống");
            }

            // Kiểm tra tài khoản đã tồn tại chưa
            var existingTaiKhoan = await _unitOfWork.GetRepository<TaiKhoan>()
                .FindByConditionAsync(t => t.Email == taiKhoanDto.Email || t.TenTaiKhoan == taiKhoanDto.TenTaiKhoan);

            if (existingTaiKhoan != null)
            {
                throw new BaseException.BadRequestException("duplicate", "Email hoặc tên tài khoản đã tồn tại");
            }

            // Tạo tài khoản mới
            var taiKhoan = new TaiKhoan
            {
                Email = taiKhoanDto.Email,
                TenTaiKhoan = taiKhoanDto.TenTaiKhoan,
                MatKhau = PasswordHelper.HashPassword(taiKhoanDto.MatKhau),
                TrangThai = taiKhoanDto.TrangThai,
                NgayTao = DateTime.Now
            };

            await _unitOfWork.GetRepository<TaiKhoan>().InsertAsync(taiKhoan);
            await _unitOfWork.SaveAsync();

            return new TaiKhoanDto
            {
                Id = taiKhoan.Id.ToString(),
                Email = taiKhoan.Email,
                TenTaiKhoan = taiKhoan.TenTaiKhoan,
                MatKhau = taiKhoan.MatKhau,
                TrangThai = taiKhoan.TrangThai,
                NgayTao = taiKhoan.NgayTao,
            };
        }

        public async Task UpdateTaiKhoanAsync(string taiKhoanId, UpdateTaiKhoanDto taiKhoanDto)
        {
            if (taiKhoanDto == null)
            {
                throw new BaseException.ValidationException("invalid_data", "Dữ liệu tài khoản không hợp lệ");
            }

            // Tìm tài khoản theo Id
            TaiKhoan? taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>()
                .FindByConditionAsync(x => x.Id.ToString() == taiKhoanId);

            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("not_found", "Tài khoản không tồn tại");
            }

            // Cập nhật TenTaiKhoan nếu khác
            if (taiKhoan.TenTaiKhoan != taiKhoanDto.TenTaiKhoan)
            {
                // Kiểm tra trùng tên tài khoản
                var existingUsername = await _unitOfWork.GetRepository<TaiKhoan>()
                    .FindByConditionAsync(x => x.TenTaiKhoan == taiKhoanDto.TenTaiKhoan && x.Id.ToString() != taiKhoanId);
                if (existingUsername != null)
                {
                    throw new BaseException.BadRequestException("duplicate", "Tên tài khoản đã tồn tại");
                }
                taiKhoan.TenTaiKhoan = taiKhoanDto.TenTaiKhoan;
            }

            // Cập nhật Email nếu khác
            if (taiKhoan.Email != taiKhoanDto.Email)
            {
                ValidationHelper.ValidateEmail(taiKhoanDto.Email);
                // Kiểm tra trùng email
                var existingEmail = await _unitOfWork.GetRepository<TaiKhoan>()
                    .FindByConditionAsync(x => x.Email == taiKhoanDto.Email && x.Id.ToString() != taiKhoanId);
                if (existingEmail != null)
                {
                    throw new BaseException.BadRequestException("duplicate", "Email đã tồn tại");
                }
                taiKhoan.Email = taiKhoanDto.Email;
            }

            // Cập nhật Trạng thái nếu khác
            if (taiKhoan.TrangThai != taiKhoanDto.TrangThai)
            {
                ValidationHelper.ValidateTrangThai<AccountStatus>(taiKhoanDto.TrangThai);
                taiKhoan.TrangThai = taiKhoanDto.TrangThai;
            }

            try
            {
                _unitOfWork.GetRepository<TaiKhoan>().Update(taiKhoan);
                await _unitOfWork.SaveAsync();
            }
            catch (SqlException)
            {
                throw new BaseException.BadRequestException("server_error", "Lỗi hệ thống khi cập nhật tài khoản");
            }
        }

        public async Task DeleteTaiKhoanAsync(string taiKhoanId)
        {
            if (!Guid.TryParse(taiKhoanId, out var guid))
            {
                throw new BaseException.BadRequestException("invalid_id", "ID tài khoản không hợp lệ");
            }

            TaiKhoan? taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(guid);
            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("not_found", "Tài khoản không tồn tại");
            }

            try
            {
                _unitOfWork.GetRepository<TaiKhoan>().Delete(taiKhoan);
                await _unitOfWork.SaveAsync();
            }
            catch (SqlException)
            {
                throw new BaseException.BadRequestException("server_error", "Lỗi hệ thống khi xoá tài khoản");
            }
        }

        public async Task<IEnumerable<TaiKhoanDto>> SearchTaiKhoan(string? keyword, string? trangThai)
        {
            if (string.IsNullOrWhiteSpace(keyword) && string.IsNullOrWhiteSpace(trangThai))
            {
                throw new BaseException.BadRequestException("invalid_search", "Từ khóa tìm kiếm hoặc trạng thái không hợp lệ");
            }

            var repository = _unitOfWork.GetRepository<TaiKhoan>();
            IQueryable<TaiKhoan> query = repository.Entities;

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(t => t.TenTaiKhoan.Contains(keyword) || t.Email.Contains(keyword));
            }

            if (!string.IsNullOrWhiteSpace(trangThai))
            {
                // So sánh không phân biệt hoa thường bằng cách chuyển về lower case
                trangThai = GetDesriptionHelper.GetDescription(trangThai, typeof(AccountStatus));
                query = query.Where(t => t.TrangThai.ToLower() == trangThai.ToLower());
            }

            var results = await query.ToListAsync();

            return results.Select(t =>
            {
                string moTaTrangThai;

                if (Enum.TryParse<AccountStatus>(t.TrangThai, out var statusEnum))
                {
                    moTaTrangThai = GetEnumDescription(statusEnum);
                }
                else
                {
                    moTaTrangThai = t.TrangThai; // fallback nếu DB lưu sai hoặc enum đổi tên
                }

                return new TaiKhoanDto
                {
                    Id = t.Id.ToString(),
                    Email = t.Email,
                    TenTaiKhoan = t.TenTaiKhoan,
                    MatKhau = t.MatKhau,
                    NgayTao = t.NgayTao,
                    TrangThai = moTaTrangThai
                };
            });
        }
        private static string GetEnumDescription(Enum value)
        {
            var field = value.GetType().GetField(value.ToString());
            var attribute = field?.GetCustomAttributes(typeof(DescriptionAttribute), false)
                                 .FirstOrDefault() as DescriptionAttribute;
            return attribute?.Description ?? value.ToString();
        }

    }
}

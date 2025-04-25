using WebsiteSmartHome.Data;
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
                NgayTao = taiKhoan.NgayTao
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

        public async Task AddTaiKhoanAsync(TaiKhoanCreateDto taiKhoanDto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (taiKhoanDto == null)
            {
                throw new BaseException.ValidationException("invalid_data", "Dữ liệu tài khoản không hợp lệ");
            }

            // Kiểm tra dữ liệu hợp lệ
            ValidationHelper.ValidateEmail(taiKhoanDto.Email);
            ValidationHelper.ValidatePassword(taiKhoanDto.MatKhau);
            ValidationHelper.ValidateTrangThai<AccountStatus>(taiKhoanDto.TrangThai);

            // Kiểm tra trùng email, trùng tên tài khoản
            await CheckTaiKhoanExistsAsync(taiKhoanDto);

            TaiKhoan taiKhoan = new TaiKhoan
            {
                Email = taiKhoanDto.Email,
                TenTaiKhoan = taiKhoanDto.TenTaiKhoan,
                MatKhau = taiKhoanDto.MatKhau,
                TrangThai = taiKhoanDto.TrangThai,
                NgayTao = taiKhoanDto.NgayTao
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

        public async Task UpdateTaiKhoanAsync(string taiKhoanId, TaiKhoanUpdateDto taiKhoanDto)
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

            // Cập nhật Email nếu khác
            if (!string.IsNullOrWhiteSpace(taiKhoanDto.Email) && taiKhoan.Email != taiKhoanDto.Email)
            {
                ValidationHelper.ValidateEmail(taiKhoanDto.Email);
                taiKhoan.Email = taiKhoanDto.Email;
            }

            // Cập nhật Mật khẩu nếu có
            if (!string.IsNullOrWhiteSpace(taiKhoanDto.MatKhau))
            {
                ValidationHelper.ValidatePassword(taiKhoanDto.MatKhau);
                taiKhoan.MatKhau = taiKhoanDto.MatKhau;
            }

            // Cập nhật Trạng thái nếu khác
            if (taiKhoan.TrangThai != taiKhoanDto.TrangThai)
            {
                ValidationHelper.ValidateTrangThai<AccountStatus>(taiKhoanDto.TrangThai!);
                taiKhoan.TrangThai = taiKhoanDto.TrangThai!;
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

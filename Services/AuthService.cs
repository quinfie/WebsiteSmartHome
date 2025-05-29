using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace WebsiteSmartHome.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IVaiTroService _vaiTroService;
        private readonly INguoiDungService _nguoiDungService;
        private readonly ITaiKhoanService _taiKhoanService;
        private readonly IAccountVerificationService _verificationService;
        private readonly IEmailService _emailService;
        private readonly string _jwtSecret;

        public AuthService(
            IUnitOfWork unitOfWork,
            IConfiguration configuration,
            ITaiKhoanService taiKhoanService,
            INguoiDungService nguoiDungService,
            IVaiTroService vaiTroService,
            IAccountVerificationService verificationService,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _vaiTroService = vaiTroService ?? throw new ArgumentNullException(nameof(vaiTroService));
            _nguoiDungService = nguoiDungService ?? throw new ArgumentNullException(nameof(nguoiDungService));
            _taiKhoanService = taiKhoanService ?? throw new ArgumentNullException(nameof(taiKhoanService));
            _verificationService = verificationService ?? throw new ArgumentNullException(nameof(verificationService));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _jwtSecret = _configuration["JwtSettings:Secret"];
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Tìm tài khoản theo email hoặc tên tài khoản
            var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>()
                .FindByConditionAsync(t =>
                    t.Email == request.Username || t.TenTaiKhoan == request.Username);

            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("invalid_credentials", "Email/tên tài khoản hoặc mật khẩu không đúng");
            }

            // Kiểm tra mật khẩu
            if (!PasswordHelper.VerifyPassword(request.Password, taiKhoan.MatKhau))
            {
                throw new BaseException.BadRequestException("invalid_credentials", "Email/tên tài khoản hoặc mật khẩu không đúng");
            }

            // Lấy tên trạng thái bị khóa từ enum
            string trangThaiBiKhoa = AccountStatus.BiKhoa.ToString().GetDescription(typeof(AccountStatus));

            // Kiểm tra trạng thái tài khoản
            if (taiKhoan.TrangThai == trangThaiBiKhoa)
            {
                throw new BaseException.BadRequestException("account_inactive", "Tài khoản đã bị khóa");
            }

            // Lấy thông tin người dùng
            var nguoiDung = await _unitOfWork.GetRepository<NguoiDung>()
                .FindByConditionAsync(n => n.MaTaiKhoan == taiKhoan.Id);

            if (nguoiDung == null)
            {
                throw new BaseException.NotFoundException("user_not_found", "Không tìm thấy thông tin người dùng");
            }

            // Lấy vai trò của người dùng
            var vaiTro = await _unitOfWork.GetRepository<VaiTro>()
                .FindByConditionAsync(v => v.Id == nguoiDung.MaVaiTro);

            // Tạo token
            var token = GenerateJwtToken(taiKhoan.Email, taiKhoan.TenTaiKhoan, vaiTro?.TenVaiTro ?? RoleHelper.KhachHang.ToString(), taiKhoan.Id.ToString());

            return new AuthResponseDto
            {
                Token = token,
                TenNguoiDung = nguoiDung.TenNguoiDung,
                TenTaiKhoan = taiKhoan.TenTaiKhoan,
                Email = taiKhoan.Email,
                VaiTro = vaiTro?.TenVaiTro ?? RoleHelper.KhachHang.ToString()
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // Kiểm tra tài khoản đã tồn tại chưa
            var existingTaiKhoan = await _unitOfWork.GetRepository<TaiKhoan>()
                .FindByConditionAsync(t => t.Email == request.Email || t.TenTaiKhoan == request.TenTaiKhoan);

            if (existingTaiKhoan != null)
            {
                throw new BaseException.BadRequestException("duplicate", "Email hoặc tên tài khoản đã tồn tại");
            }

            // Kiểm tra vai trò có hợp lệ không
            if (!Enum.TryParse<RoleHelper>(request.VaiTro, true, out var vaiTroEnum))
            {
                throw new BaseException.BadRequestException("invalid_role", "Vai trò không hợp lệ");
            }

            // Lấy tên vai trò từ enum
            string vaiTroDbName = vaiTroEnum.ToString().GetDescription(typeof(RoleHelper));

            // Lấy vai trò từ request
            var vaiTroId = await _vaiTroService.GetRoleIdByNameAsync(vaiTroDbName);
            if (vaiTroId == null)
            {
                throw new BaseException.NotFoundException("role_not_found", "Không tìm thấy vai trò được chỉ định");
            }

            // Lấy tên trạng thái "Chờ xác minh" từ enum
            string trangThaiDbName = AccountStatus.ChoXacMinh.ToString().GetDescription(typeof(AccountStatus));

            // Tạo tài khoản mới với mật khẩu đã hash
            var taiKhoan = new TaiKhoan
            {
                Email = request.Email,
                TenTaiKhoan = request.TenTaiKhoan,
                MatKhau = PasswordHelper.HashPassword(request.MatKhau),
                TrangThai = trangThaiDbName,
                NgayTao = DateTime.Now
            };

            await _unitOfWork.GetRepository<TaiKhoan>().InsertAsync(taiKhoan);
            await _unitOfWork.SaveAsync();

            // Tạo người dùng mới với mã tài khoản vừa tạo
            var nguoiDung = new NguoiDung
            {
                TenNguoiDung = request.TenNguoiDung,
                GioiTinh = request.GioiTinh,
                NgaySinh = request.NgaySinh,
                Cccd = request.Cccd,
                SoDienThoai = request.Sdt,
                DiaChi = request.DiaChi,
                MaVaiTro = vaiTroId.Value,
                MaTaiKhoan = taiKhoan.Id
            };

            await _unitOfWork.GetRepository<NguoiDung>().InsertAsync(nguoiDung);
            await _unitOfWork.SaveAsync();

            // Tạo và gửi email xác thực
            var verificationDto = new CreateVerificationDto
            {
                TaiKhoanId = taiKhoan.Id,
                Email = taiKhoan.Email
            };
            await _verificationService.CreateVerificationAsync(verificationDto);

            // Lấy thông tin vai trò
            var vaiTro = await _vaiTroService.GetVaiTroByIdAsync(vaiTroId.Value.ToString());

            // Tạo token
            var token = GenerateJwtToken(request.Email, request.TenTaiKhoan, vaiTro!.TenVaiTro, taiKhoan.Id.ToString());

            return new AuthResponseDto
            {
                Token = token,
                TenNguoiDung = request.TenNguoiDung,
                TenTaiKhoan = request.TenTaiKhoan,
                Email = request.Email,
                VaiTro = vaiTro.TenVaiTro
            };
        }

        private string GenerateJwtToken(string email, string tenTaiKhoan, string tenVaiTro, string userId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, tenTaiKhoan),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, tenVaiTro),
                new Claim(ClaimTypes.NameIdentifier, userId)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<TaiKhoanDto> GetProfileAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new BaseException.BadRequestException("invalid_user_id", "UserId không được để trống");
            }

            TaiKhoan? taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>()
                .Entities
                .Include(tk => tk.NguoiDung)
                .FirstOrDefaultAsync(tk => tk.Id == Guid.Parse(userId));
            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("account_not_found", "Không tìm thấy tài khoản");
            }

            return new TaiKhoanDto
            {
                Email = taiKhoan.Email,
                TenTaiKhoan = taiKhoan.TenTaiKhoan,
                MatKhau = taiKhoan.MatKhau,
                NgayTao = taiKhoan.NgayTao,
                TrangThai = taiKhoan.TrangThai,
                MaNguoiDung = taiKhoan.NguoiDung?.Id.ToString() ?? ""
            };
        }

        public async Task<bool> UpdateTaiKhoanAsync(string userId, UpdateTaiKhoanDto taiKhoan)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new BaseException.BadRequestException("invalid_user_id", "UserId không được để trống");
            }

            var existingTaiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(Guid.Parse(userId));
            if (existingTaiKhoan == null)
            {
                throw new BaseException.NotFoundException("account_not_found", "Không tìm thấy tài khoản");
            }

            // Validate email
            ValidationHelper.ValidateEmail(taiKhoan.Email);

            // Validate username length
            if (taiKhoan.TenTaiKhoan.Length < 3 || taiKhoan.TenTaiKhoan.Length > 50)
            {
                throw new BaseException.BadRequestException("invalid_username_length", "Tên tài khoản phải có độ dài từ 3 đến 50 ký tự");
            }

            // Validate account status
            ValidationHelper.ValidateTrangThai<AccountStatus>(taiKhoan.TrangThai);

            // Update only necessary fields
            existingTaiKhoan.Email = taiKhoan.Email;
            existingTaiKhoan.TenTaiKhoan = taiKhoan.TenTaiKhoan;
            existingTaiKhoan.TrangThai = taiKhoan.TrangThai;

            await _unitOfWork.GetRepository<TaiKhoan>().UpdateAsync(existingTaiKhoan);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> UpdateNguoiDungAsync(string userId, UpdateNguoiDungDto nguoiDung)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new BaseException.BadRequestException("invalid_user_id", "UserId không được để trống");
            }

            var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(Guid.Parse(userId));
            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("account_not_found", "Không tìm thấy tài khoản");
            }

            var existingNguoiDung = await _unitOfWork.GetRepository<NguoiDung>().GetByIdAsync(taiKhoan.Id);
            if (existingNguoiDung == null)
            {
                throw new BaseException.NotFoundException("user_not_found", "Không tìm thấy thông tin người dùng");
            }

            // Update only necessary fields
            //existingNguoiDung.TenNguoiDung = nguoiDung.TenNguoiDung;

            // Validate and update optional fields if provided
            if (!string.IsNullOrWhiteSpace(nguoiDung.SoDienThoai))
            {
                ValidationHelper.ValidateSDT(nguoiDung.SoDienThoai);
                existingNguoiDung.SoDienThoai = nguoiDung.SoDienThoai;
            }

            if (!string.IsNullOrWhiteSpace(nguoiDung.CCCD))
            {
                ValidationHelper.ValidateCCCD(nguoiDung.CCCD);
                existingNguoiDung.Cccd = nguoiDung.CCCD;
            }

            if (nguoiDung.NgaySinh.HasValue)
            {
                ValidationHelper.ValidateNgaySinh(nguoiDung.NgaySinh.Value);
                existingNguoiDung.NgaySinh = nguoiDung.NgaySinh;
            }

            if (!string.IsNullOrWhiteSpace(nguoiDung.GioiTinh))
            {
                ValidationHelper.ValidateGioiTinh(nguoiDung.GioiTinh);
                existingNguoiDung.GioiTinh = nguoiDung.GioiTinh;
            }

            if (!string.IsNullOrWhiteSpace(nguoiDung.DiaChi))
            {
                ValidationHelper.ValidateDiaChi(nguoiDung.DiaChi);
                existingNguoiDung.DiaChi = nguoiDung.DiaChi;
            }

            await _unitOfWork.GetRepository<NguoiDung>().UpdateAsync(existingNguoiDung);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto changePassword)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new BaseException.BadRequestException("invalid_user_id", "UserId không được để trống");
            }

            var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().GetByIdAsync(Guid.Parse(userId));
            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("account_not_found", "Không tìm thấy tài khoản");
            }

            // Verify current password
            if (!PasswordHelper.VerifyPassword(changePassword.CurrentPassword, taiKhoan.MatKhau))
            {
                throw new BaseException.BadRequestException("invalid_password", "Mật khẩu hiện tại không đúng");
            }

            // Update password
            taiKhoan.MatKhau = PasswordHelper.HashPassword(changePassword.NewPassword);
            await _unitOfWork.GetRepository<TaiKhoan>().UpdateAsync(taiKhoan);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPassword)
        {
            var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>()
                .FindByConditionAsync(t => t.Email == forgotPassword.Email);

            if (taiKhoan == null)
            {
                throw new BaseException.NotFoundException("account_not_found", "Không tìm thấy tài khoản với email này");
            }

            // Tạo mật khẩu mới ngẫu nhiên
            string newPassword = GenerateRandomPassword();
            
            // Cập nhật mật khẩu mới
            taiKhoan.MatKhau = PasswordHelper.HashPassword(newPassword);
            await _unitOfWork.GetRepository<TaiKhoan>().UpdateAsync(taiKhoan);
            await _unitOfWork.SaveAsync();

            // Gửi mật khẩu mới qua email
            await _emailService.SendPasswordResetEmailAsync(taiKhoan.Email, newPassword);

            return true;
        }

        private string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)),
                ValidateLifetime = true
            };

            try
            {
                var principal = handler.ValidateToken(token, validationParameters, out _);
                var email = principal.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                    return false;

                var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().FindByConditionAsync(t => t.Email == email);
                if (taiKhoan == null)
                    return false;

                taiKhoan.TrangThai = AccountStatus.HoatDong.ToString().GetDescription(typeof(AccountStatus));
                await _unitOfWork.GetRepository<TaiKhoan>().UpdateAsync(taiKhoan);
                await _unitOfWork.SaveAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> ResendVerificationEmailAsync(string email)
        {
            var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>().FindByConditionAsync(t => t.Email == email);
            if (taiKhoan == null)
                return false;

            // Nếu đã xác thực thì không gửi lại
            if (taiKhoan.TrangThai == AccountStatus.HoatDong.ToString().GetDescription(typeof(AccountStatus)))
                return false;

            // Gửi lại email xác thực
            await _emailService.SendVerificationEmailAsync(email, null);
            return true;
        }
    }
}
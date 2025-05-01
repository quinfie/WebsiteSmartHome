using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IVaiTroService _vaiTroService;
        private readonly INguoiDungService _nguoiDungService;
        private readonly ITaiKhoanService _taiKhoanService;

        public AuthService(
            IUnitOfWork unitOfWork,
            IConfiguration configuration,
            ITaiKhoanService taiKhoanService,
            INguoiDungService nguoiDungService,
            IVaiTroService vaiTroService)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _vaiTroService = vaiTroService;
            _nguoiDungService = nguoiDungService;
            _taiKhoanService = taiKhoanService;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Tìm tài khoản theo email hoặc tên tài khoản
            var taiKhoan = await _unitOfWork.GetRepository<TaiKhoan>()
                .FindByConditionAsync(t => 
                    t.Email == request.Username || t.TenTaiKhoan == request.Username);

            if (taiKhoan == null)
            {
                throw new BaseException.BadRequestException("invalid_credentials", "Email/tên tài khoản hoặc mật khẩu không đúng");
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
            var token = GenerateJwtToken(taiKhoan.Email, taiKhoan.TenTaiKhoan, vaiTro?.TenVaiTro ?? RoleHelper.KhachHang.ToString());

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

            // Kiểm tra trạng thái có hợp lệ không
            if (!Enum.TryParse<AccountStatus>(request.TrangThai, true, out var trangThaiEnum))
            {
                throw new BaseException.BadRequestException("invalid_status", "Trạng thái không hợp lệ");
            }

            // Lấy tên trạng thái từ enum
            string trangThaiDbName = trangThaiEnum.ToString().GetDescription(typeof(AccountStatus));

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
                CCCD = request.Cccd,
                SoDienThoai = request.Sdt,
                DiaChi = request.DiaChi,
                MaVaiTro = vaiTroId.Value,
                MaTaiKhoan = taiKhoan.Id
            };

            await _unitOfWork.GetRepository<NguoiDung>().InsertAsync(nguoiDung);
            await _unitOfWork.SaveAsync();

            // Lấy thông tin vai trò
            var vaiTro = await _vaiTroService.GetVaiTroByIdAsync(vaiTroId.Value.ToString());

            // Tạo token
            var token = GenerateJwtToken(request.Email, request.TenTaiKhoan, vaiTro.TenVaiTro);

            return new AuthResponseDto
            {
                Token = token,
                TenNguoiDung = request.TenNguoiDung,
                TenTaiKhoan = request.TenTaiKhoan,
                Email = request.Email,
                VaiTro = vaiTro.TenVaiTro
            };
        }

        private string GenerateJwtToken(string email, string tenTaiKhoan, string tenVaiTro)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, tenTaiKhoan),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, tenVaiTro)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
} 
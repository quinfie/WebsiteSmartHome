using System.Text.RegularExpressions;
using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.Core.Utils
{
    public static class ValidationHelper
    {
        // Kiểm tra email hợp lệ
        public static void ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
            {
                throw new BaseException.ValidationException("invalid_email", "Email không hợp lệ");
            }
        }

        // Kiểm tra mật khẩu hợp lệ
        public static void ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || !IsValidPassword(password))
            {
                throw new BaseException.ValidationException("invalid_password", "Mật khẩu phải có ít nhất 8 ký tự");
            }
        }

        // Kiểm tra trạng thái tài khoản hợp lệ
        public static void ValidateTrangThai<TEnum>(string trangThai) where TEnum : Enum
        {
            var match = GetDesriptionHelper.GetEnumNameByDescription<TEnum>(trangThai);
            if (match == null)
            {
                throw new BaseException.ValidationException("invalid_status", $"Trạng thái '{trangThai}' không hợp lệ");
            }
        }

        // Kiểm tra vai trò hợp lệ
        public static void ValidateRole(string role)
        {
            var enumName = GetDesriptionHelper.GetEnumNameByDescription<RoleHelper>(role);
            if (enumName == null)
            {
                throw new BaseException.ValidationException("invalid_role", $"Vai trò '{role}' không hợp lệ");
            }
        }

        // Kiểm tra địa chỉ
        public static void ValidateDiaChi(string diaChi)
        {
            if (string.IsNullOrWhiteSpace(diaChi))
            {
                throw new BaseException.ValidationException("invalid_address", "Địa chỉ không được để trống");
            }
        }

        public static void ValidateGioiTinh(string? gioiTinh)
        {
            // Nếu gioiTinh không phải null và không phải khoảng trắng
            if (!string.IsNullOrWhiteSpace(gioiTinh))
            {
                var trimmedGender = gioiTinh.Trim();

                // Kiểm tra xem giá trị có phải là "Nam" hoặc "Nữ" không, đúng định dạng
                if (trimmedGender != "Nam" && trimmedGender != "Nữ")
                {
                    throw new BaseException.BadRequestException("invalid_gender", "Giới tính chỉ được phép là 'Nam' hoặc 'Nữ'");
                }
            }
            else
            {
                // Nếu không nhập, có thể xử lý như lỗi hoặc giữ lại (tùy vào yêu cầu hệ thống của bạn)
                throw new BaseException.BadRequestException("invalid_gender", "Giới tính không được để trống");
            }
        }



        // Kiểm tra CCCD
        public static void ValidateCCCD(string? cccd)
        {
            if (!string.IsNullOrWhiteSpace(cccd))
            {
                if (cccd.Length != 12 || !cccd.All(char.IsDigit))
                {
                    throw new BaseException.ValidationException("invalid_cccd", "CCCD phải gồm đúng 12 chữ số");
                }
            }
        }

        // Kiểm tra số điện thoại hợp lệ
        public static void ValidateSDT(string? sdt)
        {
            if (!string.IsNullOrWhiteSpace(sdt))
            {
                if (sdt.Length != 10 || !sdt.StartsWith("0") || !sdt.All(char.IsDigit))
                {
                    throw new BaseException.BadRequestException("invalid_phone", "Số điện thoại phải bắt đầu bằng '0' và gồm đúng 10 chữ số");
                }
            }
        }

        // Kiểm tra ngày sinh hợp lệ
        public static void ValidateNgaySinh(DateTime? ngaySinh)
        {
            if (ngaySinh.HasValue && ngaySinh.Value > DateTime.Today)
            {
                throw new BaseException.ValidationException("invalid_dob", "Ngày sinh không được lớn hơn ngày hiện tại");
            }
        }

        // Kiểm tra ngày hẹn hợp lệ
        public static void ValidateNgayHen(DateTime ngayHen)
        {
            if (ngayHen.Date < DateTime.Today)
            {
                throw new BaseException.ValidationException("invalid_date", "Ngày hẹn không được nhỏ hơn ngày hiện tại");
            }
        }

        // Kiểm tra loại dịch vụ hợp lệ
        public static void ValidateLoaiDichVu(string loaiDichVu)
        {
            if (loaiDichVu != "Bảo hành" && loaiDichVu != "Sửa chữa")
            {
                throw new BaseException.ValidationException("invalid_type_service", "Loại dịch vụ chỉ được phép là 'Bảo hành' hoặc 'Sửa chữa'");
            }
        }

        // Kiểm tra trạng thái yêu cầu dịch vụ hợp lệ
        public static void ValidateTrangThaiYeuCau(string trangThai)
        {
            var validStatuses = new[] { "Đang chờ xác nhận", "Đã xác nhận", "Hoàn thành", "Đã hủy" };
            if (!validStatuses.Contains(trangThai))
            {
                throw new BaseException.ValidationException("invalid_status", "Trạng thái yêu cầu không hợp lệ");
            }
        }

        // Kiểm tra chi phí hợp lệ
        public static void ValidateChiPhi(decimal chiPhi)
        {
            if (chiPhi < 0)
            {
                throw new BaseException.ValidationException("invalid_cost", "Chi phí không được âm");
            }
        }

        public static void ValidateThoiGianBaoHanh(DateTime ngayMua, int thoiGianBaoHanh)
        {
            var ngayHetHan = ngayMua.AddMonths(thoiGianBaoHanh);
            if (DateTime.Now > ngayHetHan)
            {
                throw new BaseException.ValidationException("expired_warranty",
                    $"Sản phẩm đã hết thời gian bảo hành. Ngày hết hạn: {ngayHetHan:dd/MM/yyyy}");
            }
        }

        public static void ValidateChiPhiSuaChua(decimal chiPhi, string loaiDichVu)
        {
            if (loaiDichVu == TypeServiceHelper.SuaChua.ToString().GetDescription(typeof(TypeServiceHelper)) && chiPhi < 0)
            {
                throw new BaseException.ValidationException("missing_cost", "Chưa có báo giá cho yêu cầu sửa chữa");
            }
        }

        public static void ValidateMoTa(string moTa)
        {
            if (string.IsNullOrWhiteSpace(moTa))
            {
                throw new BaseException.ValidationException("invalid_mota", "Mô tả không được để trống");
            }
        }

        public static void ValidateGhiChu(string ghiChu)
        {
            if (!string.IsNullOrWhiteSpace(ghiChu))
            {
                throw new BaseException.ValidationException("invalid_ghichu", "Ghi chú không được quá để trống");
            }
        }

        // Các hàm kiểm tra riêng lẻ cho các loại khác
        private static bool IsValidEmail(string email)
        {
            var regex = new Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
            return regex.IsMatch(email);
        }

        private static bool IsValidPassword(string password)
        {
            return password.Length >= 8;
        }
    }
}

using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.Core.Utils;

namespace WebsiteSmartHome.Services
{
    public class KhuyenMaiService : IKhuyenMaiService
    {
        private readonly IUnitOfWork _unitOfWork;

        public KhuyenMaiService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<List<KhuyenMaiDto>> GetValidPromotions(decimal cartTotal)
        {
            var today = DateTime.Now;
            var repository = _unitOfWork.GetRepository<KhuyenMai>();

            var khuyenMais = await repository.Entities
                .Where(km =>
                    km.NgayBatDau <= today &&
                    km.NgayKetThuc >= today)
                .ToListAsync();

            return khuyenMais.Select(km => new KhuyenMaiDto
            {
                Id = km.Id.ToString(),
                TenKhuyenMai = km.TenKhuyenMai,
                PhanTramGiam = km.PhanTramGiam,
                NgayBatDau = km.NgayBatDau,
                NgayKetThuc = km.NgayKetThuc
            }).ToList();
        }

        public async Task<KhuyenMaiDto?> GetById(Guid id)
        {
            var khuyenMai = await _unitOfWork.GetRepository<KhuyenMai>().GetByIdAsync(id);
            if (khuyenMai == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy khuyến mãi");

            return new KhuyenMaiDto
            {
                Id = khuyenMai.Id.ToString(),
                TenKhuyenMai = khuyenMai.TenKhuyenMai,
                PhanTramGiam = khuyenMai.PhanTramGiam,
                NgayBatDau = khuyenMai.NgayBatDau,
                NgayKetThuc = khuyenMai.NgayKetThuc
            };
        }

        public async Task<KhuyenMaiDto> Create(KhuyenMaiCreateDto dto)
        {
            ValidateKhuyenMai(dto);

            // Kiểm tra trùng tên
            var exist = await _unitOfWork.GetRepository<KhuyenMai>()
                .FindByConditionAsync(km => km.TenKhuyenMai == dto.TenKhuyenMai);
            if (exist != null)
                throw new BaseException.BadRequestException("duplicate", "Khuyến mãi đã tồn tại");

            var khuyenMai = new KhuyenMai
            {
                Id = Guid.NewGuid(),
                TenKhuyenMai = dto.TenKhuyenMai,
                PhanTramGiam = dto.PhanTramGiam,
                NgayBatDau = dto.NgayBatDau,
                NgayKetThuc = dto.NgayKetThuc
            };

            await _unitOfWork.GetRepository<KhuyenMai>().InsertAsync(khuyenMai);
            await _unitOfWork.SaveAsync();

            return new KhuyenMaiDto
            {
                Id = khuyenMai.Id.ToString(),
                TenKhuyenMai = khuyenMai.TenKhuyenMai,
                PhanTramGiam = khuyenMai.PhanTramGiam,
                NgayBatDau = khuyenMai.NgayBatDau,
                NgayKetThuc = khuyenMai.NgayKetThuc
            };
        }

        public async Task<KhuyenMaiDto?> Update(Guid id, KhuyenMaiUpdateDto dto)
        {
            var existingKhuyenMai = await _unitOfWork.GetRepository<KhuyenMai>().GetByIdAsync(id);
            if (existingKhuyenMai == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy khuyến mãi");

            ValidateKhuyenMai(dto);

            // Kiểm tra trùng tên với khuyến mãi khác
            var exist = await _unitOfWork.GetRepository<KhuyenMai>()
                .FindByConditionAsync(km => km.TenKhuyenMai == dto.TenKhuyenMai && km.Id != id);
            if (exist != null)
                throw new BaseException.BadRequestException("duplicate", "Tên khuyến mãi đã tồn tại");

            existingKhuyenMai.TenKhuyenMai = dto.TenKhuyenMai;
            existingKhuyenMai.PhanTramGiam = dto.PhanTramGiam;
            existingKhuyenMai.NgayBatDau = dto.NgayBatDau;
            existingKhuyenMai.NgayKetThuc = dto.NgayKetThuc;

            _unitOfWork.GetRepository<KhuyenMai>().Update(existingKhuyenMai);
            await _unitOfWork.SaveAsync();

            return new KhuyenMaiDto
            {
                Id = existingKhuyenMai.Id.ToString(),
                TenKhuyenMai = existingKhuyenMai.TenKhuyenMai,
                PhanTramGiam = existingKhuyenMai.PhanTramGiam,
                NgayBatDau = existingKhuyenMai.NgayBatDau,
                NgayKetThuc = existingKhuyenMai.NgayKetThuc
            };
        }

        public async Task<bool> Delete(Guid id)
        {
            var khuyenMai = await _unitOfWork.GetRepository<KhuyenMai>().GetByIdAsync(id);
            if (khuyenMai == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy khuyến mãi");

            _unitOfWork.GetRepository<KhuyenMai>().Delete(khuyenMai);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<KhuyenMaiApplyDto> ApplyPromotion(decimal cartTotal, Guid promotionId)
        {
            var khuyenMai = await _unitOfWork.GetRepository<KhuyenMai>().GetByIdAsync(promotionId);
            if (khuyenMai == null)
                throw new BaseException.NotFoundException("not_found", "Không tìm thấy khuyến mãi");

            // Kiểm tra ngày hiệu lực
            var today = DateTime.Now;
            if (today < khuyenMai.NgayBatDau || today > khuyenMai.NgayKetThuc)
            {
                throw new BaseException.BadRequestException("expired_promotion", "Khuyến mãi đã hết hạn");
            }

            // Áp dụng giảm giá phần trăm
            var soTienGiam = (cartTotal * khuyenMai.PhanTramGiam) / 100;
            var tongTienSauGiam = cartTotal - soTienGiam;

            return new KhuyenMaiApplyDto
            {
                Id = khuyenMai.Id.ToString(),
                TenKhuyenMai = khuyenMai.TenKhuyenMai,
                PhanTramGiam = khuyenMai.PhanTramGiam,
                SoTienGiam = soTienGiam,
                TongTienSauGiam = tongTienSauGiam
            };
        }

        public async Task<List<KhuyenMaiDto>> GetAll()
        {
            var repository = _unitOfWork.GetRepository<KhuyenMai>();
            var khuyenMais = await repository.Entities.ToListAsync();

            return khuyenMais.Select(km => new KhuyenMaiDto
            {
                Id = km.Id.ToString(),
                TenKhuyenMai = km.TenKhuyenMai,
                PhanTramGiam = km.PhanTramGiam,
                NgayBatDau = km.NgayBatDau,
                NgayKetThuc = km.NgayKetThuc
            }).ToList();
        }

        private void ValidateKhuyenMai(KhuyenMaiCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.TenKhuyenMai))
                throw new BaseException.ValidationException("invalid_name", "Tên khuyến mãi không được để trống");

            if (dto.PhanTramGiam <= 0 || dto.PhanTramGiam > 100)
                throw new BaseException.ValidationException("invalid_discount", "Phần trăm giảm phải từ 1-100%");

            if (dto.NgayBatDau >= dto.NgayKetThuc)
                throw new BaseException.ValidationException("invalid_date", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");

            if (dto.NgayKetThuc < DateTime.Now)
                throw new BaseException.ValidationException("invalid_end_date", "Ngày kết thúc không được nhỏ hơn ngày hiện tại");
        }

        private void ValidateKhuyenMai(KhuyenMaiUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.TenKhuyenMai))
                throw new BaseException.ValidationException("invalid_name", "Tên khuyến mãi không được để trống");

            if (dto.PhanTramGiam <= 0 || dto.PhanTramGiam > 100)
                throw new BaseException.ValidationException("invalid_discount", "Phần trăm giảm phải từ 1-100%");

            if (dto.NgayBatDau >= dto.NgayKetThuc)
                throw new BaseException.ValidationException("invalid_date", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");

            if (dto.NgayKetThuc < DateTime.Now)
                throw new BaseException.ValidationException("invalid_end_date", "Ngày kết thúc không được nhỏ hơn ngày hiện tại");
        }
    }
}
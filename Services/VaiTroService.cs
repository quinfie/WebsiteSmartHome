using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Core.DTOs;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.UnitOfWork;

namespace WebsiteSmartHome.Services
{
    public class VaiTroService : IVaiTroService
    {
        private readonly IUnitOfWork _unitOfWork;

        public VaiTroService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<VaiTroDto>> GetVaiTroAsync()
        {
            IList<VaiTro> vaiTroList = await _unitOfWork.GetRepository<VaiTro>().GetAllAsync();
            return vaiTroList.Select(v => new VaiTroDto
            {
                Id = v.Id.ToString(),
                TenVaiTro = v.TenVaiTro
            }).ToList();
        }

        public async Task<VaiTroDto?> GetVaiTroByIdAsync(string id)
        {
            VaiTro? vaiTro = await _unitOfWork.GetRepository<VaiTro>().GetByIdAsync(id);
            if (vaiTro == null)
            {
                throw new BaseException.NotFoundException("not_found", "Vai trò không tồn tại");
            }
            return new VaiTroDto
            {
                Id = vaiTro.Id.ToString(),
                TenVaiTro = vaiTro.TenVaiTro
            };
        }

        public async Task AddVaiTroAsync(string tenVaiTro)
        {
            if (string.IsNullOrWhiteSpace(tenVaiTro))
            {
                throw new BaseException.BadRequestException("invalid_data", "Tên vai trò không được để trống");
            }

            VaiTro vaiTro = new VaiTro
            {
                TenVaiTro = tenVaiTro
            };
            await _unitOfWork.GetRepository<VaiTro>().InsertAsync(vaiTro);
            await _unitOfWork.SaveAsync();
        }

        public async Task<bool> UpdateVaiTroAsync(string id, string tenVaiTro)
        {
            VaiTro? vaiTro = await _unitOfWork.GetRepository<VaiTro>().GetByIdAsync(id);
            if (vaiTro == null)
            {
                throw new BaseException.NotFoundException("not_found", "Vai trò không tồn tại");
            }

            vaiTro.TenVaiTro = tenVaiTro;

            _unitOfWork.GetRepository<VaiTro>().Update(vaiTro);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteVaiTroAsync(string id)
        {
            VaiTro? vaiTro = await _unitOfWork.GetRepository<VaiTro>().GetByIdAsync(id);
            if (vaiTro == null)
            {
                throw new BaseException.NotFoundException("not_found", "Vai trò không tồn tại");
            }

            _unitOfWork.GetRepository<VaiTro>().Delete(vaiTro);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<VaiTro>> SearchVaiTro(string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                throw new BaseException.BadRequestException("invalid_data", "Từ khóa tìm kiếm không hợp lệ");
            }

            var repository = _unitOfWork.GetRepository<VaiTro>();
            IQueryable<VaiTro> query = repository.Entities;

            query = query.Where(v => v.TenVaiTro.Contains(keyword));

            List<VaiTro> result = await query.ToListAsync();

            if (!result.Any())
            {
                throw new BaseException.NotFoundException("not_found", $"Không tồn tại vai trò với '{keyword}'");
            }

            return result;
        }
    }
}
using WebsiteSmartHome.Data;
using WebsiteSmartHome.Repositories;

namespace WebsiteSmartHome.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private bool disposed = false;
        private readonly SmartHomeDbContext _dbContext;

        // Constructor sửa lại
        public UnitOfWork(SmartHomeDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Begin Transaction
        public void BeginTransaction()
        {
            _dbContext.Database.BeginTransaction();
        }

        // Commit Transaction
        public void CommitTransaction()
        {
            _dbContext.Database.CommitTransaction();
        }

        // Dispose để giải phóng tài nguyên
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // Dispose với tham số bool
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    _dbContext.Dispose();
                }
            }
            disposed = true;
        }

        // Rollback Transaction
        public void RollBack()
        {
            _dbContext.Database.RollbackTransaction();
        }

        // Lưu thay đổi
        public void Save()
        {
            _dbContext.SaveChanges();
        }

        // Lưu thay đổi không đồng bộ
        public async Task SaveAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        // Trả về Repository cho entity
        public IGenericRepository<T> GetRepository<T>() where T : class
        {
            return new GenericRepository<T>(_dbContext);  // Cách khởi tạo Repository
        }
    }
}

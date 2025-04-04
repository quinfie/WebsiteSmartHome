using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.Repositories;

namespace WebsiteSmartHome.UnitOfWork
{
    public class UnitOfWork(SmartHomeDbContext dbContext) : IUnitOfWork
    {
        private bool disposed = false;
        private readonly SmartHomeDbContext _dbContext = dbContext;
        public void BeginTransaction()
        {
            _dbContext.Database.BeginTransaction();
        }

        public void CommitTransaction()
        {
            _dbContext.Database.CommitTransaction();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

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

        public void RollBack()
        {
            _dbContext.Database.RollbackTransaction();
        }

        public void Save()
        {
            _dbContext.SaveChanges();
        }

        public async Task SaveAsync()
        {
            //await _dbContext.SaveChangesAsync();
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine("Error saving to database: " + ex.InnerException?.Message);
                throw;
            }
        }

        public IGenericRepository<T> GetRepository<T>() where T : class
        {
            return new GenericRepository<T>(_dbContext);
        }
    }
}

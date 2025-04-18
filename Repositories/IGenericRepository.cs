﻿using WebsiteSmartHome.Core;
using System.Linq.Expressions;

namespace WebsiteSmartHome.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        // query
        IQueryable<T> Entities { get; }

        // non async
        IEnumerable<T> GetAll();
        T? GetById(object id);
        void Insert(T obj);
        void InsertRange(IList<T> obj);
        void Update(T obj);
        void Delete(object id);
        void Save();

        // async
        Task<IList<T>> GetAllAsync();
        Task<BasePaginatedList<T>> GetPagging(IQueryable<T> query, int index, int pageSize);
        BasePaginatedList<T> GetPaggingDto(IEnumerable<T> items, int pageNumber, int pageSize);
        Task<T?> GetByIdAsync(object id);
        Task InsertAsync(T obj);
        Task UpdateAsync(T obj);
        Task DeleteAsync(object id);
        Task SaveAsync();

        //new method for condition finding
        Task<T?> FindByConditionAsync(Expression<Func<T, bool>> expression);
        Task<T?> FindByConditionWithIncludesAsync(Expression<Func<T, bool>> expression, params Expression<Func<T, object>>[] includes);
        IQueryable<T> GetEntitiesWithCondition(Expression<Func<T, bool>> expression, params Expression<Func<T, object>>[] includes);
        Task<TResult?> FindByConditionWithIncludesAndSelectAsync<TResult>(
            Expression<Func<T, bool>> expression,
            Expression<Func<T, TResult>> selector,
            params Expression<Func<T, object>>[] includes);


        IQueryable<TResult> GetEntitiesWithConditionAndSelect<TResult>(
            Expression<Func<T, bool>> expression,
            Expression<Func<T, TResult>> selector,
            params Expression<Func<T, object>>[] includes);
        IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);

    }
}

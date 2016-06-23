using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Table;

namespace Zer0.Azure
{
	public interface ITableStorageRepository<T>
	{
		Task InsertAsync(T entity);
		Task<TableResult> UpdateAsync(T entity);
		Task<TableResult> ReplaceAsync(T entity);
		Task<TableResult> DeleteAsync(string partitionKey, string rowKey);
		Task<T> GetAsync(string partitionKey, string rowKey);
		Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> filter, CancellationToken cancellationToken = default(CancellationToken), Action<IList<T>> onProgress = null);
		Task<IEnumerable<T>> GetByPartitionKeyAsync(string partitionKey);
		IQueryable<T> Get(Expression<Func<T, bool>> filter);
	}
}
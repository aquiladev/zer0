using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage.Table.Queryable;

namespace Zer0.Azure
{
	public class TableStorageRepository<T> : ITableStorageRepository<T> where T : TableEntity, new()
	{
		private readonly CloudTable _cloudTable;

		public TableStorageRepository(string tableName, string storageConnectionString, IRetryPolicy retryPolicy)
		{
			CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(storageConnectionString);
			TableRequestOptions tableRequestOptions = new TableRequestOptions { RetryPolicy = retryPolicy };
			CloudTableClient cloudTableClient = cloudStorageAccount.CreateCloudTableClient();
			cloudTableClient.DefaultRequestOptions = tableRequestOptions;
			_cloudTable = cloudTableClient.GetTableReference(tableName);
			_cloudTable.CreateIfNotExists();
		}

		public async Task InsertAsync(T entity)
		{
			await _cloudTable.ExecuteAsync(TableOperation.Insert(entity));
		}

		public async Task<TableResult> UpdateAsync(T entity)
		{
			return await _cloudTable.ExecuteAsync(TableOperation.Merge(entity));
		}

		public async Task<TableResult> ReplaceAsync(T entity)
		{
			return await _cloudTable.ExecuteAsync(TableOperation.InsertOrReplace(entity));
		}

		public async Task<TableResult> DeleteAsync(string partitionKey, string rowKey)
		{
			var entity = new DynamicTableEntity("ThePartitionKey", "TheRowKey") { ETag = "*" };
			return await _cloudTable.ExecuteAsync(TableOperation.Delete(entity));
		}

		public async Task<T> GetAsync(string partitionKey, string rowKey)
		{
			try
			{
				var task = _cloudTable.ExecuteAsync(TableOperation.Retrieve<T>(partitionKey, rowKey));
				return (await task).Result as T;
			}
			catch (Exception)
			{
				return new T();
			}
		}

		public async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> filter, CancellationToken cancellationToken = new CancellationToken(), Action<IList<T>> onProgress = null)
		{
			return await _cloudTable.ExecuteQueryAsync(
				new TableQuery<T>().Where(filter).AsTableQuery(), cancellationToken, onProgress);
		}

		public async Task<IEnumerable<T>> GetByPartitionKeyAsync(string partitionKey)
		{
			return await _cloudTable.ExecuteQueryAsync(
				new TableQuery<T>().Where(TableQuery.GenerateFilterCondition("PartitionKey", "eq", partitionKey)));
		}

		public IQueryable<T> Get(Expression<Func<T, bool>> filter)
		{
			return _cloudTable.CreateQuery<T>().Where(filter);
		}
	}
}

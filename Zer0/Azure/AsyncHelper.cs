using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Table;

namespace Zer0.Azure
{
	public static class AsyncHelpers
	{
		public static async Task<IList<T>> ExecuteQueryAsync<T>(this CloudTable table, TableQuery<T> query,
			CancellationToken cancellationToken = default(CancellationToken), Action<IList<T>> onProgress = null) where T : ITableEntity, new()
		{
			List<T> items = new List<T>();
			TableContinuationToken token = null;
			do
			{
				TableQuerySegment<T> tableQuerySegment = await table.ExecuteQuerySegmentedAsync(query, token, cancellationToken);
				token = tableQuerySegment.ContinuationToken;
				items.AddRange(tableQuerySegment);
				onProgress?.Invoke(items);
			}
			while (token != null && !cancellationToken.IsCancellationRequested);
			return items;
		}
	}
}

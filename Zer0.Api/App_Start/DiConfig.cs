using System;
using System.Configuration;
using System.Web.Http;
using LightInject;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Zer0.Azure;
using Zer0.Domain;

namespace Zer0.Api
{
	public static class DiConfig
	{
		public static void Register(ServiceContainer container, HttpConfiguration config)
		{
			container.RegisterApiControllers();
			
			container.Register<ITableStorageRepository<CommandEntity>>(
				x => new TableStorageRepository<CommandEntity>(
					ConfigurationManager.AppSettings["CommandsTableName"],
					ConfigurationManager.AppSettings["StorageConnectionString"],
					new ExponentialRetry(TimeSpan.FromSeconds(1), 3)),
				new PerScopeLifetime());

			container.EnablePerWebRequestScope();
			container.EnableWebApi(config);
		}
	}
}
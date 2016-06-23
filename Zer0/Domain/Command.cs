using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace Zer0.Domain
{
	public class CommandEntity : TableEntity
	{
		public CommandEntity() { }

		public CommandEntity(string agentName)
		{
			AgentName = agentName;
			PartitionKey = $"{agentName} {DateTime.UtcNow.ToString("yyyyMM")}";
			RowKey = DateTime.UtcNow.Ticks.ToString();
		}

		public string AgentName { get; set; }
		public string Name { get; set; }
	}
}

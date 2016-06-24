using System;
using System.Collections.Generic;
using Zer0.Commands;

namespace Zer0
{
	public static class CommandTypeFactory
	{
		private static readonly Dictionary<string, Type> Container = new Dictionary<string, Type>
		{
			{"PullCommand", typeof(PullCommand)},
			{"FetchCountersCommand", typeof(FetchCountersCommand)},
			{"StartMonitorCommand", typeof(StartMonitorCommand)},
			{"StopMonitorCommand", typeof(StopMonitorCommand)}
		};

		public static Type GetType(string name)
		{
			return Container[name];
		}
	}
}

using System;
using System.Collections.Generic;
using Zer0.Commands;

namespace Zer0
{
	public static class CommandTypeFactory
	{
		private static readonly Dictionary<string, Type> Container = new Dictionary<string, Type>
		{
			{"SyncServerCommand", typeof(SyncServerCommand)},
			{"FetchCountersCommand", typeof(FetchCountersCommand)},
			{"StartResourceMonitorCommand", typeof(StartResourceMonitorCommand)},
			{"StopResourceMonitorCommand", typeof(StopResourceMonitorCommand)}
		};

		public static Type GetType(string name)
		{
			return Container[name];
		}
	}
}

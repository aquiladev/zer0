using System;
using System.Collections.Concurrent;

namespace Zer0.Commands
{
	public class StartResourceMonitorCommand : ICommand
	{
		public string Name => "StartResourceMonitorCommand";

		public void Execute(ConcurrentQueue<ICommand> queue)
		{
			queue.Enqueue(new FetchCountersCommand());
			Console.Out.WriteLine("Start resource monitor");
		}
	}
}

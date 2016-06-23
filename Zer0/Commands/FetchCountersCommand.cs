using System;
using System.Collections.Concurrent;

namespace Zer0.Commands
{
	public class FetchCountersCommand : ICommand
	{
		public string Name => "FetchCountersCommand";

		public void Execute(ConcurrentQueue<ICommand> queue)
		{
			queue.Enqueue(new FetchCountersCommand());
			Console.Out.WriteLine("Fetch counters");
		}
	}
}

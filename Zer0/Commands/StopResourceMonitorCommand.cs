using System;
using System.Collections.Concurrent;

namespace Zer0.Commands
{
	public class StopResourceMonitorCommand : ICommand
	{
		public string Name => "StopResourceMonitorCommand";

		public void Execute(ConcurrentQueue<ICommand> queue)
		{
			for (var i = 0; i < queue.Count; i++)
			{
				ICommand command;
				if (queue.TryDequeue(out command) && !(command is FetchCountersCommand))
				{
					queue.Enqueue(command);
				}
			}
			Console.Out.WriteLine("Stop resource monitor");
		}
	}
}

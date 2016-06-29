using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Zer0.Commands;

namespace Zer0.Agent
{
	class Program
	{
		private const int LoopInterval = 1000;
		private const int ServerTrackInterval = 20000;
		private readonly ConcurrentQueue<ICommand> _queue = new ConcurrentQueue<ICommand>();

		static void Main(string[] args)
		{
			var app = new Program();
			app.Run();
		}

		private void Run()
		{
			Console.WriteLine("Start");
			var pullTask = SetTimerTask(() => { _queue.Enqueue(new PullCommand()); }, ServerTrackInterval, new CancellationToken());

			while (true)
			{
				ICommand value;
				if (_queue.TryDequeue(out value))
				{
					value.Execute(_queue);
				}
				else
				{
					Console.WriteLine($"{DateTime.Now} -");
				}
				Thread.Sleep(LoopInterval);
			}
		}

		private Task SetTimerTask(Action act, int interval, CancellationToken cancellationToken)
		{
			return Task.Run(() =>
			{
				Timer timer = null;
				timer = new Timer(_ =>
				{
					timer.Change(Timeout.Infinite, Timeout.Infinite);
					try
					{
						act?.Invoke();
					}
					finally
					{
						timer.Change(interval, interval);
					}
				}, null, Timeout.Infinite, Timeout.Infinite);
				timer.Change(0, interval);

			}, cancellationToken);
		}
	}
}
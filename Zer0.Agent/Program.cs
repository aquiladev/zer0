using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

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
			var task = TrackServer(new CancellationToken());

			while (true)
			{
				ICommand value;
				if (_queue.TryDequeue(out value))
				{
					value.Execute();
					Console.WriteLine($"{DateTime.Now} {value.Name}");
				}
				else
				{
					Console.WriteLine($"{DateTime.Now} -");
				}
				Thread.Sleep(LoopInterval);
			}
		}

		private Task TrackServer(CancellationToken cancellationToken)
		{
			return Task.Run(() =>
			{
				Timer _timer = null;
				_timer = new Timer(_ =>
				{
					_timer.Change(Timeout.Infinite, Timeout.Infinite);
					try
					{
						//Console.Out.WriteLine("Check server command " + DateTime.Now);
						_queue.Enqueue(new CheckServerCommand());
					}
					finally
					{
						_timer.Change(ServerTrackInterval, ServerTrackInterval);
					}
				}, null, Timeout.Infinite, Timeout.Infinite);
				_timer.Change(0, ServerTrackInterval);

			}, cancellationToken);
		}
	}
}
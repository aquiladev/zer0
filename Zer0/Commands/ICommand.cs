using System.Collections.Concurrent;

namespace Zer0.Commands
{
	public interface ICommand
	{
		string Name { get; }
		void Execute(ConcurrentQueue<ICommand> queue);
	}
}

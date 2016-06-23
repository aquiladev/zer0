namespace Zer0.Agent
{
	public interface ICommand
	{
		string Name { get; }
		void Execute();
	}
}

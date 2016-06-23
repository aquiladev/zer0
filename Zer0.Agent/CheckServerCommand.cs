using System.Net.Http;

namespace Zer0.Agent
{
	public class CheckServerCommand : ICommand
	{
		public string Name => "CheckServerCommand";
		public void Execute()
		{
			HttpClient client = new HttpClient();
			var response = client.GetAsync("http://localhost:19094/api/agent/commands/name").Result;
		}
	}
}

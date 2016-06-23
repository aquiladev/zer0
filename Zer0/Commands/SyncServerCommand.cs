using System;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;

namespace Zer0.Commands
{
	public class SyncServerCommand : ICommand
	{
		public string Name => "SyncServerCommand";

		public async void Execute(ConcurrentQueue<ICommand> queue)
		{
			var hostName = Dns.GetHostName();
			using (var client = new HttpClient())
			using (var response = await client.GetAsync($"http://localhost:19094/api/agent/commands/{hostName}"))
			{
				Console.Out.WriteLine("Sync with server");
				try
				{
					response.EnsureSuccessStatusCode();
					var content = await response.Content.ReadAsStringAsync();

					var metadata = JsonConvert.DeserializeObject<CommandMeta>(content);
					if (metadata == null)
					{
						return;
					}

					var commandType = CommandTypeFactory.GetType(metadata.Name);
					var command = JsonConvert.DeserializeObject(content, commandType);
					queue.Enqueue((ICommand)command);
				}
				catch (Exception ex)
				{
					Console.Out.WriteLine(ex.Message);
				}
			}
		}
	}
}

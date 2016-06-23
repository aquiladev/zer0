using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Zer0.Azure;
using Zer0.Commands;
using Zer0.Domain;

namespace Zer0.Api.Areas.Agent.Controllers
{
	[RoutePrefix("api/agent")]
	public class CommandsController : ApiController
	{
		private readonly ITableStorageRepository<CommandEntity> _commandRepository;

		public CommandsController(ITableStorageRepository<CommandEntity> commandRepository)
		{
			_commandRepository = commandRepository;
		}

		[Route("commands/{agentName}")]
		public async Task<ICommand> Get(string agentName)
		{
			var entities = await _commandRepository.GetByPartitionKeyAsync(agentName);
			var command = entities.FirstOrDefault();
			if (command == null)
			{
				return null;
			}
			return new StartResourceMonitorCommand();
		}
	}
}

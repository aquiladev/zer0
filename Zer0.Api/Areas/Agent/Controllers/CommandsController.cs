using System.Web.Http;

namespace Zer0.Areas.Agent.Controllers
{
	public class CommandsController : ApiController
	{
		public string Get(string agentName)
		{
			return "test";
		}
	}
}

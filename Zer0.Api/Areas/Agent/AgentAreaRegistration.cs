using System.Web.Mvc;

namespace Zer0.Areas.Agent
{
	public class AgentAreaRegistration : AreaRegistration
	{
		public override string AreaName => "Agent";

		public override void RegisterArea(AreaRegistrationContext context)
		{
			context.MapRoute(
				"Agent_DefaultApi",
				"api/agent/{controller}/{id}",
				new { id = UrlParameter.Optional }
			);
		}
	}
}
using System.Web.Mvc;

namespace Zer0.Api.Areas.Agent
{
	public class AgentAreaRegistration : AreaRegistration
	{
		public override string AreaName => "Agent";

		public override void RegisterArea(AreaRegistrationContext context)
		{
			context.MapRoute(
				"Agent_Default",
				"agent/{controller}/{action}/{id}",
				new { action = "Index", id = UrlParameter.Optional }
			);
		}
	}
}
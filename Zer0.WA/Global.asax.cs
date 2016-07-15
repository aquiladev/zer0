using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using LightInject;

namespace Zer0.Api
{
	public class WebApiApplication : System.Web.HttpApplication
	{
		private ServiceContainer _container;

		protected void Application_Start()
		{
			_container = new ServiceContainer();

			AreaRegistration.RegisterAllAreas();
			GlobalConfiguration.Configure(WebApiConfig.Register);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
			DiConfig.Register(_container, GlobalConfiguration.Configuration);
		}

		protected void Application_End()
		{
			_container.Dispose();
		}
	}
}

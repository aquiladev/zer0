using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Microsoft.TeamFoundation.Client;
using Microsoft.TeamFoundation.TestManagement.Client;
using Zer0.Api.Infrastructure;
using Zer0.Api.Models;

namespace Zer0.Api.Controllers
{
	public class SearchController : ApiController
	{
		private readonly ITestManagementTeamProject _project;

		public SearchController(TfsConnectionData connectionData)
		{
			var tfsCollection = new TfsTeamProjectCollection(connectionData.Uri,
				new System.Net.NetworkCredential(connectionData.UserName, connectionData.Password, connectionData.Domain));
			tfsCollection.EnsureAuthenticated();

			var testManagementService = tfsCollection.GetService<ITestManagementService>();
			_project = testManagementService.GetTeamProject(connectionData.ProjectName);
		}

		[HttpGet]
		public IEnumerable<TestRunItemModel> TestRuns(string q)
		{
			if (string.IsNullOrEmpty(q))
			{
				throw new ArgumentNullException();
			}

			return _project.TestRuns
				.Query("SELECT * FROM TestRun WHERE title = '" + q + "'") //TODO: unsafe concatenation
				.OrderByDescending(r => r.DateCreated)
				.Take(20)
				.Select(r => new TestRunItemModel
				{
					Id = r.Id,
					Title = r.Title
				});
		}
	}
}

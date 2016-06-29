using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI;
using Microsoft.TeamFoundation.Client;
using Microsoft.TeamFoundation.TestManagement.Client;
using Zer0.Api.Infrastructure;
using Zer0.Api.Models;

namespace Zer0.Api.Controllers
{
	[OutputCache(Location = OutputCacheLocation.Client, NoStore = true)]
	public class TestRunsController : ApiController
	{
		private readonly ITestManagementTeamProject _project;

		public TestRunsController(TfsConnectionData connectionData)
		{
			var tfsCollection = new TfsTeamProjectCollection(connectionData.Uri,
				new System.Net.NetworkCredential(connectionData.UserName, connectionData.Password, connectionData.Domain));
			tfsCollection.EnsureAuthenticated();

			var testManagementService = tfsCollection.GetService<ITestManagementService>();
			_project = testManagementService.GetTeamProject(connectionData.ProjectName);
		}

		public IEnumerable<TestRunModel> Get(string title)
		{
			if (string.IsNullOrEmpty(title))
			{
				throw new ArgumentNullException();
			}
			return _project.TestRuns
				.Query("SELECT * FROM TestRun WHERE title = '" + title + "'")
				.OrderByDescending(r => r.DateCreated)
				.Take(10)
				.Select(r => new TestRunModel
				{
					Id = r.Id,
					State = r.State,
					PostProcessState = r.PostProcessState,
					Type = r.Type,
					Statistics = r.Statistics,
					Iteration = r.Iteration,
					IsAutomated = r.IsAutomated,
					Title = r.Title,
					DateCreated = r.DateCreated,
					DateStarted = r.DateStarted,
					DateCompleted = r.DateCompleted,
					BuildUri = r.BuildUri,
					BuildNumber = r.BuildNumber,
					BuildConfigurationId = r.BuildConfigurationId,
					BuildDirectory = r.BuildDirectory,
					TestPlanId = r.TestPlanId,
					TestEnvironmentId = r.TestEnvironmentId,
					Controller = r.Controller,
					IsDirty = r.IsDirty,
					ErrorMessage = r.ErrorMessage,
					Owner = new UserModel
					{
						Id = r.Owner.TeamFoundationId,
						Name = r.Owner.DisplayName,
						UniqueName = r.Owner.UniqueName
					},
					LogEntries = r.TestMessageLogEntries
						.Select(x => new TestMessageLogEntryModel
						{
							Id = x.TestMessageLogId,
							EntryId = x.EntryId,
							User = new UserModel
							{
								Id = x.User.TeamFoundationId,
								Name = x.User.DisplayName,
								UniqueName = x.User.UniqueName
							},
							DateCreated = x.DateCreated,
							LogLevel = x.LogLevel,
							Message = x.Message
						}),
					Results = r.QueryResults(false)
						.OrderBy(x => x.DateStarted)
						.Select(x => new TestCaseResultModel
						{
							TestCaseId = x.TestCaseId,
							TestResultId = x.TestResultId,
							TestConfigurationId = x.TestConfigurationId,
							TestConfigurationName = x.TestConfigurationName,
							TestPointId = x.TestPointId,
							State = x.State,
							ResolutionStateId = x.ResolutionStateId,
							RunBy = new UserModel
							{
								Id = x.RunBy?.TeamFoundationId ?? Guid.Empty,
								Name = x.RunBy?.DisplayName,
								UniqueName = x.RunBy?.UniqueName
							},
							Priority = x.Priority,
							TestCaseTitle = x.TestCaseTitle,
							TestCaseArea = x.TestCaseArea,
							ComputerName = x.ComputerName,
							ResetCount = x.ResetCount,
							FailureType = x.FailureType,
							Implementation = x.Implementation,
							IsFinished = x.IsFinished,
							Outcome = x.Outcome,
							ErrorMessage = x.ErrorMessage,
							DateCreated = x.DateCreated,
							DateStarted = x.DateStarted,
							DateCompleted = x.DateCompleted,
							Duration = x.Duration
						})
				});
		}
	}
}

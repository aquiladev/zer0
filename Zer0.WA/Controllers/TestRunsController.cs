﻿using System;
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

		public TestRunModel Get(int id)
		{
			if (id == 0)
			{
				throw new ArgumentNullException();
			}

			var run = _project.TestRuns.Find(id);
			return new TestRunModel
			{
				Id = run.Id,
				State = run.State,
				PostProcessState = run.PostProcessState,
				Type = run.Type,
				Statistics = run.Statistics,
				Iteration = run.Iteration,
				IsAutomated = run.IsAutomated,
				Title = run.Title,
				DateCreated = run.DateCreated,
				DateStarted = run.DateStarted,
				DateCompleted = run.DateCompleted,
				BuildUri = run.BuildUri,
				BuildNumber = run.BuildNumber,
				BuildConfigurationId = run.BuildConfigurationId,
				BuildDirectory = run.BuildDirectory,
				TestPlanId = run.TestPlanId,
				TestEnvironmentId = run.TestEnvironmentId,
				Controller = run.Controller,
				IsDirty = run.IsDirty,
				ErrorMessage = run.ErrorMessage,
				Owner = new UserModel
				{
					Id = run.Owner.TeamFoundationId,
					Name = run.Owner.DisplayName,
					UniqueName = run.Owner.UniqueName
				},
				LogEntries = run.TestMessageLogEntries
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
				Results = run.QueryResults(false)
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
			};
		}
	}
}

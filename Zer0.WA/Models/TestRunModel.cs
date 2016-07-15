using System;
using System.Collections.Generic;
using Microsoft.TeamFoundation.TestManagement.Client;

namespace Zer0.Api.Models
{
	public class TestRunModel
	{
		public int Id { get; set; }
		public TestRunState State { get; set; }
		public TestRunType Type { get; set; }
		public PostProcessState PostProcessState { get; set; }
		public ITestRunStatistics Statistics { get; set; }
		public IAttachmentCollection Attachments { get; set; }
		public string Iteration { get; set; }
		public bool IsAutomated { get; set; }
		public string Title { get; set; }
		public DateTime DateCreated { get; set; }
		public DateTime DateStarted { get; set; }
		public DateTime DateCompleted { get; set; }
		public Uri BuildUri { get; set; }
		public string BuildNumber { get; set; }
		public int BuildConfigurationId { get; set; }
		public string BuildDirectory { get; set; }
		public int TestPlanId { get; set; }
		public Guid TestEnvironmentId { get; set; }
		public string Controller { get; set; }
		public bool IsDirty { get; set; }
		public string ErrorMessage { get; set; }
		public UserModel Owner { get; set; }
		public IEnumerable<TestMessageLogEntryModel> LogEntries { get; set; }
		public IEnumerable<TestCaseResultModel> Results { get; set; }
	}
}
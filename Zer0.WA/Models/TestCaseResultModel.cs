using System;
using Microsoft.TeamFoundation.TestManagement.Client;

namespace Zer0.Api.Models
{
	public class TestCaseResultModel
	{
		public int TestCaseId { get; set; }
		public int TestResultId { get; set; }
		public int TestConfigurationId { get; set; }
		public string TestConfigurationName { get; set; }
		public int TestPointId { get; set; }
		public TestResultState State { get; set; }
		public int ResolutionStateId { get; set; }
		public UserModel RunBy { get; set; }
		public int Priority { get; set; }
		public string TestCaseTitle { get; set; }
		public string TestCaseArea { get; set; }
		public string ComputerName { get; set; }
		public int ResetCount { get; set; }
		public FailureType FailureType { get; set; }
		public ITestImplementation Implementation { get; set; }
		public bool IsFinished { get; set; }
		public TestOutcome Outcome { get; set; }
		public string ErrorMessage { get; set; }
		public DateTime DateCreated { get; set; }
		public DateTime DateStarted { get; set; }
		public DateTime DateCompleted { get; set; }
		public TimeSpan Duration { get; set; }
	}
}
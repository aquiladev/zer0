using System;
using Microsoft.TeamFoundation.TestManagement.Client;

namespace Zer0.Api.Models
{
	public class TestMessageLogEntryModel
	{
		public int Id { get; set; }
		public int EntryId { get; set; }
		public UserModel User { get; set; }
		public DateTime DateCreated { get; set; }
		public TestMessageLogEntryLevel LogLevel { get; set; }
		public string Message { get; set; }
	}
}
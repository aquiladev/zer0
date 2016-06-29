using System;

namespace Zer0.Api.Infrastructure
{
	public class TfsConnectionData
	{
		public TfsConnectionData(string uri, string userName, string password, string domain, string projectName)
		{
			Uri = new Uri(uri);
			UserName = userName;
			Password = password;
			Domain = domain;
			ProjectName = projectName;
		}

		public Uri Uri { get; protected set; }
		public string UserName { get; protected set; }
		public string Password { get; protected set; }
		public string Domain { get; protected set; }
		public string ProjectName { get; protected set; }
	}
}
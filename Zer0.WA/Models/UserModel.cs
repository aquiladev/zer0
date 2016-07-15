using System;

namespace Zer0.Api.Models
{
	public class UserModel
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string UniqueName { get; set; }
	}
}
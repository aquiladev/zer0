using System.Collections.Generic;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI;
using Zer0.Api.Models;

namespace Zer0.Api.Controllers
{
	public class CommentsController : ApiController
	{
		private static readonly IList<CommentModel> Comments;

		static CommentsController()
		{
			Comments = new List<CommentModel>
			{
				new CommentModel
				{
					Author = "Daniel Lo Nigro",
					Text = "Hello ReactJS.NET World!"
				},
				new CommentModel
				{
					Author = "Pete Hunt",
					Text = "This is one comment"
				},
				new CommentModel
				{
					Author = "Jordan Walke",
					Text = "This is *another* comment"
				},
			};
		}

		[OutputCache(Location = OutputCacheLocation.None)]
		public IEnumerable<CommentModel> Get()
		{
			return Comments;
		}

		public void Post(CommentModel comment)
		{
			if (comment == null)
			{
				return;
			}

			Comments.Add(comment);
		}
	}
}

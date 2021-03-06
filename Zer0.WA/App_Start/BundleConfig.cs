﻿using System.Web.Optimization;

namespace Zer0.Api
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
				"~/Scripts/jquery-{version}.js"));

			// Use the development version of Modernizr to develop with and learn from. Then, when you're
			// ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
				"~/Scripts/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
				"~/Scripts/bootstrap.js",
				"~/Scripts/respond.js"));

			bundles.Add(new ScriptBundle("~/bundles/tools").Include(
				"~/Scripts/moment.js",
				"~/Scripts/math.js",
				"~/Scripts/cytoscape.js"));

			bundles.Add(new StyleBundle("~/content/css").Include(
				"~/Content/bootstrap.css",
				"~/Content/site.css"));
		}
	}
}

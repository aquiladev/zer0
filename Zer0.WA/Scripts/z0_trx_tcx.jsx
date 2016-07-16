var TestCasesPerTestRuns = React.createClass({
	componentDidMount: function () {
		this.renderChart();
	},
	componentDidUpdate: function () {
		this.renderChart();
	},
	parse: function (data) {
		var categories = [];
		var totals = [];
		var failures = [];

		for (var i = 0; i < data.length; i++) {
			var count = 0;
			var run = data[i];
			categories.push(run.id);

			for (var j = 0; j < run.results.length; j++) {
				var testCase = run.results[j];
				if (testCase.outcome !== "Failed") {
					continue;
				}

				count += 1;
			}
			totals.push(run.results.length);
			failures.push(count);
		}

		return {
			categories: categories,
			series: [
				{
					name: "Totals",
					data: totals,
					color: "#4585f2"
				},
				{
					name: "Failures",
					data: failures,
					color: "#ea2117"
				}
			]
		};
	},
	renderChart: function () {
		var data = this.parse(this.props.data);
		$('.runsFailuresChart').highcharts({
			chart: {
				type: 'line',
				height: 200
			},
			title: {
				text: "",
				style: {
					display: "none"
				}
			},
			subtitle: {
				text: "",
				style: {
					display: "none"
				}
			},
			xAxis: {
				categories: data.categories,
				labels: {
					rotation: -30,
					style: {
						fontSize: '10px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			},
			yAxis: {
				title: {
					text: 'Test Cases'
				}
			},
			legend: {
				layout: "vertical",
				align: "right",
				verticalAlign: "middle",
				borderWidth: 0
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true
					},
					enableMouseTracking: false
				},
				series: {
					animation: false
				}
			},
			series: data.series
		});
	},
	render: function () {
		return (
			<div className="testRunsFailures">
				<h3>Test runs failures</h3>
				<div className="runsFailuresChart"></div>
			</div>
		);
	}
});
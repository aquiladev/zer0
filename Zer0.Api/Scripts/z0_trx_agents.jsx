var TestAgentsPerTestRun = React.createClass({
	componentDidMount: function() {
		this.renderChart();
	},
	componentDidUpdate: function() {
		this.renderChart();
	},
	parse: function (runs) {
		var categories = [];
		var agents = [];
		for (var i = 0; i < runs.length; i++) {
			categories.push(runs[i].id);

			var results = runs[i].results;
			var runAgents = { count: 0 };
			for (var j = 0; j < results.length; j++) {
				var agentName = results[j].computerName;
				if (!runAgents[agentName]) {
					runAgents[agentName] = "1";
					runAgents.count += 1;
				}
			}

			agents.push(runAgents.count);
		}

		return {
			categories: categories,
			series: [{ data: agents }]
		};
	},
	renderChart: function () {
		var data = this.parse(this.props.data);
		$(".agentsPerTestRunChart").highcharts({
			chart: {
				type: "column",
				height: 250
			},
			title: {
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
					text: "Test agent amount"
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						color: (Highcharts.theme && Highcharts.theme.textColor) || "gray"
					}
				}
			},
			legend: {
				enabled: false
			},
			tooltip: {
				headerFormat: "<b>{point.x}</b><br/>",
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
			},
			plotOptions: {
				column: {
					stacking: "normal",
					animation: false,
					maxPointWidth: 50
				}
			},
			series: data.series
		});
	},
	render: function () {
		return (
			<div className="testAgentsPerTestRun">
				<h3>Agents per test run</h3>
				<div className="agentsPerTestRunChart"></div>
			</div>
		);
	}
});
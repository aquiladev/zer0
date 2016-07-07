var TestCasesPerAgent = React.createClass({
	componentDidMount: function() {
		this.renderChart();
	},
	componentDidUpdate: function() {
		this.renderChart();
	},
	getAmounts: function (outcome, agents) {
		var amounts = [];
		var keys = Object.keys(agents);
		for (var x in keys) {
			if (keys.hasOwnProperty(x)) {
				var item = keys[x];
				var amount = agents[item][outcome];
				if (amount) {
					amounts.push(amount);
				} else {
					amounts.push(0);
				}
			}
		}
		return amounts;
	},
	parse: function (results) {
		var agents = {};
		var outcomes = {};
		for (var i = 0; i < results.length; i++) {
			var agentName = results[i].computerName;
			if (!agents[agentName]) {
				agents[agentName] = [];
			}
			var agent = agents[agentName];
			var outcome = results[i].outcome;
			if (!outcomes[outcome]) {
				outcomes[outcome] = [];
			}
			if (!agent[outcome]) {
				agent[outcome] = 0;
			}
			agent[outcome] += 1;
		}

		var keys = Object.keys(outcomes);
		for (var x in keys) {
			if (keys.hasOwnProperty(x)) {
				var item = keys[x];
				outcomes[item] = this.getAmounts(item, agents);
			}
		}

		return {
			agents: agents,
			outcomes: outcomes
		}
	},
	getCategories: function(data) {
		var categories = [];
		var keys = Object.keys(data.agents);
		for (var x in keys) {
			if (keys.hasOwnProperty(x)) {
				var item = keys[x];
				categories.push(item);
			}
		}

		return categories;
	},
	getSeries: function (data) {
		var series = [];
		var keys = Object.keys(data.outcomes);
		for (var x in keys) {
			if (keys.hasOwnProperty(x)) {
				var item = keys[x];
				series.push({
					name: item,
					data: data.outcomes[item],
					color: item === "Failed" ? "#ea2117" :
						item === "Passed" ? "#90ed7d" : "",
					index: item === "Failed" ? 1 :
						item === "Passed" ? 0 : 2
				});
			}
		}

		return series;
	},
	renderChart: function () {
		var data = this.parse(this.props.data.results);
		var categories = this.getCategories(data);
		var series = this.getSeries(data);

		$(".casesPerAgentChart").highcharts({
			chart: {
				type: "column"
			},
			title: {
				text: "",
				style: {
					display: "none"
				}
			},
			xAxis: {
				categories: categories,
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
					text: "Test case amount"
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
					dataLabels: {
						enabled: true,
						color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || "white",
						style: {
							textShadow: "0 0 3px black"
						}
					},
					animation: false
				}
			},
			series: series
		});
	},
	render: function () {
		return (
			<div className="testCasesPerAgent">
				<h3>Amount of test cases per agent</h3>
				<div className="casesPerAgentChart"></div>
			</div>
		);
	}
});
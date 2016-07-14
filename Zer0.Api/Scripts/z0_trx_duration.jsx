var TestRunsDuration = React.createClass({
	componentDidMount: function () {
		this.renderChart();
	},
	componentDidUpdate: function () {
		this.renderChart();
	},
	parse: function (data) {
		var categories = [];
		var durations = [];
		var calcDurations = [];

		for (var i = 0; i < data.length; i++) {
			var run = data[i];
			categories.push(run.id);

			var duration = this.getDuration(run.dateStarted, run.dateCompleted).asMilliseconds();
			durations.push(duration);

			var startingDate = this.getStartingDate(run.id, run.logEntries);
			var completedDate = this.getCompletedDate(run.id, run.logEntries);
			var calcDuration = this.getDuration(startingDate, completedDate).asMilliseconds();
			calcDurations.push(calcDuration);
		}

		var series = [];
		series.push({
			name: "Duration",
			data: durations,
			color: "#ea2117"
		});

		series.push({
			name: "Calculated duration",
			data: calcDurations,
			color: "#4585f2"
		});

		var avgDuration = math.mean(durations);
		series.push({
			type: "line",
			name: "Average duration",
			data: Array.apply(null, Array(categories.length)).map(function () { return avgDuration }),
			marker: {
				lineWidth: 0,
				radius: 0
			},
			color: "#ea2117",
			lineWidth: 2,
			dashStyle: "dot"
		});

		var avgCalcDuration = math.mean(calcDurations);
		series.push({
			type: "line",
			name: "Average calculated duration",
			data: Array.apply(null, Array(categories.length)).map(function () { return avgCalcDuration }),
			marker: {
				lineWidth: 0,
				radius: 0
			},
			color: "#4585f2",
			lineWidth: 2,
			dashStyle: "dot"
		});

		return {
			categories: categories,
			series: series
		};
	},
	getStartingDate: function (runId, logs) {
		var message = "Starting test run [" + runId + "].";
		for (var i = 0; i < logs.length; i++) {
			if (logs[i].message === message) {
				return logs[i].dateCreated;
			}
		}
		return undefined;
	},
	getCompletedDate: function (runId, logs) {
		var message = "Test run [" + runId + "] completed.";
		for (var i = logs.length - 1; i > 0; i--) {
			if (logs[i].message === message) {
				return logs[i].dateCreated;
			}
		}
		return undefined;
	},
	getDuration: function (startDate, completeDate) {
		var diff = moment(completeDate).diff(moment(startDate));
		return moment.duration(diff);
	},
	renderChart: function () {
		var data = this.parse(this.props.data);
		$(".runsDurationChart")
			.highcharts({
				chart: {
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
				scrollbar: {
					enabled: true
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
						text: "Duration"
					},
					labels: {
						formatter: function () {
							return moment.utc(this.value).format("HH:mm:ss");
						}
					}
				},
				plotOptions: {
					series: {
						animation: false
					}
				},
				legend: {
					layout: "vertical",
					align: "right",
					verticalAlign: "middle",
					borderWidth: 0
				},
				tooltip: {
					formatter: function () {
						return "<b>" + this.x + "</b><br/>" +
							this.series.name + ": " + moment.utc(this.point.y).format("HH:mm:ss.SSS");
					}
				},
				series: data.series
			});
	},
	render: function () {
		return (
			<div className="testRunsDuration">
				<h3>Test runs duration</h3>
				<div className="runsDurationChart"></div>
			</div>
		);
	}
});
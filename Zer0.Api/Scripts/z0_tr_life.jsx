var TestRunLife = React.createClass({
	componentDidMount: function() {
		this.renderChart();
	},
	componentDidUpdate: function() {
		this.renderChart();
	},
	trimTokens: function(str) {
		var outstr = "",
			start = -1,
			end;
		while ((end = str.indexOf("[", ++start)) > -1) {
			outstr += str.slice(start, end);
			start = end;
			if ((end = str.indexOf("]", start)) > -1) {
				outstr += "";
				start = end;
			}
		}
		return outstr + str.slice(start);
	},
	getTime: function (value) {
		return moment(value)
			.toDate()
			.getTime();
	},
	parse: function (logs) {
		var data = [];
		var groups = {};
		for (var i = 0; i < logs.length; i++) {
			var topic = this.trimTokens(logs[i].message);
			if (!groups[topic]) {
				groups[topic] = [];
			}
			var dateComplete = "";
			if (i < logs.length - 1) {
				dateComplete = logs[i + 1].dateCreated;
			} else {
				dateComplete = this.props.data.dateCompleted;
			}
			groups[topic].push({
				x: 0,
				low: this.getTime(logs[i].dateCreated),
				high: this.getTime(dateComplete),
				id: logs[i].id,
				logLevel: logs[i].logLevel,
				message: logs[i].message
			});
		}

		var keys = Object.keys(groups);
		for (var x in keys) {
			if (keys.hasOwnProperty(x)) {
				var item = keys[x];
				data.push({
					name: item,
					borderWidth: 0,
					data: groups[item]
				});
			}
		}

		return data;
	},
	renderChart: function() {
		var data = this.parse(this.props.data.logEntries);
		$(".lifeChart")
			.highcharts({
				chart: {
					type: "columnrange",
					inverted: true,
					height: 150
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
					categories: ["Stage"]
				},
				yAxis: {
					type: "datetime",
					title: {
						text: "Time"
					},
					labels: {
						rotation: -30,
						style: {
							fontSize: '10px',
							fontFamily: 'Verdana, sans-serif'
						}
					}
				},
				plotOptions: {
					columnrange: {
						grouping: false,
						animation: false
					}
				},
				legend: {
					enabled: false
				},
				tooltip: {
					formatter: function () {
						return "<b>" + this.point.options.logLevel + ": " + this.point.options.message + "</b><br/>"
							+ "Started: " + moment(this.point.low).format("LTS") + "<br/>"
							+ "Completed: " + moment(this.point.high).format("LTS");
					}
				},
				series: data
			});
	},
	render: function() {
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});
		return (
			<div className="testRunLife">
				<h3>Test run life</h3>
				<div className="lifeChart"></div>
			</div>
		);
	}
});
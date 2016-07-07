var TestCasesTimeline = React.createClass({
	componentDidMount: function () {
		this.renderChart();
	},
	componentDidUpdate: function () {
		this.renderChart();
	},
	getTime: function (value) {
		return moment(value)
			.toDate()
			.getTime();
	},
	parse: function (data) {
		var self = this;
		return data.results.map(function (r, i) {
			var item = {
				x: i,
				id: r.testCaseId,
				title: r.testCaseTitle,
				duration: r.duration,
				color: r.outcome === "Failed" ? "#ea2117" : "#90ed7d"
			};
			var dateStarted = self.getTime(r.dateStarted);
			if (dateStarted > 0) {
				item.low = dateStarted;
				item.high = self.getTime(r.dateCompleted);
			} else {
				item.low = self.getTime(data.dateStarted);
				item.high = self.getTime(data.dateCompleted);
				item.color = "#cdcdcd";
			}
			return item;
		});
	},
	renderChart: function () {
		var data = this.parse(this.props.data);
		//console.log(data);
		var height = +(data.length * 2.5) + 100;
		$(".timelineChart")
			.highcharts({
				chart: {
					type: "columnrange",
					inverted: true,
					height: height
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
					categories: ["Test Case"]
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
						return "<b>" + this.point.options.id + " - " + this.point.options.title + "</b><br/>"
							+ "Started: " + moment(this.point.low).format("LTS") + "<br/>"
							+ "Duration: " + this.point.options.duration;
					}
				},
				series: [
					{
						name: "Test Case",
						borderWidth: 0,
						data: data
					}
				]
			});
	},
	render: function () {
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});
		return (
			<div className="testRunTimeline">
				<h3>Test run timeline</h3>
				<div className="timelineChart"></div>
			</div>
		);
	}
});
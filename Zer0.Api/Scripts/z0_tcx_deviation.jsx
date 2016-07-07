var TestCasesDeviation = React.createClass({
	getDuration: function (startDate, completeDate) {
		var diff = moment(completeDate).diff(moment(startDate));
		return moment.duration(diff);
	},
	parse: function (data) {
		var stat = {};
		for (var i = 0; i < data.length; i++) {
			var run = data[i];
			for (var j = 0; j < run.results.length; j++) {
				var item = run.results[j];

				if (!stat[item.testCaseId]) {
					stat[item.testCaseId] = {
						id: item.testCaseId,
						title: item.testCaseTitle,
						durations: []
					};
				}
				var duration = this.getDuration(item.dateStarted, item.dateCompleted).asMilliseconds();
				stat[item.testCaseId].durations.push(duration);
			}
		}

		var cases = [];
		var keys = Object.keys(stat);
		for (var x in keys) {
			if (keys.hasOwnProperty(x)) {
				var propName = keys[x];
				var prop = stat[propName];
				prop.std = math.std(prop.durations);
				prop.mean = math.mean(prop.durations);
				prop.deviation = ~~((prop.std / prop.mean) * 100);
				cases.push(prop);
			}
		}

		cases.sort(function (a, b) {
			if (a.deviation > b.deviation) {
				return -1;
			}
			if (a.deviation < b.deviation) {
				return 1;
			}
			return 0;
		});

		return cases;
	},
	render: function () {
		var cases = this.parse(this.props.data);
		var displayCount = Math.min(cases.length, 20);
		var rows = cases.slice(0, displayCount)
			.map(function (r, i) {
				return (
					<tr key={i}>
						<td>{i}</td>
						<td>{r.id}</td>
						<td className="title">{r.title}</td>
						<td>{r.deviation}%</td>
					</tr>
				);
			});
		return (
			<div className="testCasesDeviation">
				<h3>Test cases deviation</h3>
				<table>
						<thead>
							<tr>
								<th>#</th>
								<th>Id</th>
								<th>Title</th>
								<th>Deviation</th>
							</tr>
						</thead>
						<tbody>{rows}</tbody>
				</table>
			</div>
		);
	}
});
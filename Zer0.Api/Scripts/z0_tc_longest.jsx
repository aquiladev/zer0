var TestCasesLongest = React.createClass({
	getDuration: function (startDate, completeDate) {
		var diff = moment(completeDate).diff(moment(startDate));
		return moment.duration(diff);
	},
	parse: function (results) {
		var self = this;
		var data = results.map(function (r) {
			return {
				id: r.testCaseId,
				title: r.testCaseTitle,
				duration: self.getDuration(r.dateStarted, r.dateCompleted).asMilliseconds()
			};
		});

		data.sort(function (a, b) {
			if (a.duration > b.duration) {
				return -1;
			}
			if (a.duration < b.duration) {
				return 1;
			}
			return 0;
		});
		return data;
	},
	render: function () {
		var cases = this.parse(this.props.data.results);
		var displayCount = Math.min(cases.length, 20);
		var rows = cases.slice(0, displayCount)
			.map(function (r, i) {
				return (
					<tr key={i}>
						<td>{i}</td>
						<td>{r.id}</td>
						<td className="title">{r.title}</td>
						<td>{moment.utc(r.duration).format("HH:mm:ss.SSS")}</td>
					</tr>
				);
			});
		return (
			<div className="testCasesLongest">
				<h3>Longest test cases</h3>
				<div className="testCasesLongestList">
					<table>
						<thead>
							<tr>
								<th>#</th>
								<th>Id</th>
								<th>Title</th>
								<th>Duration</th>
							</tr>
						</thead>
						<tbody>{rows}</tbody>
					</table>
				</div>
			</div>
		);
	}
});
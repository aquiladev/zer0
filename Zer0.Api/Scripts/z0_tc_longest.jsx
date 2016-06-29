var TestCasesLongest = React.createClass({
	getDuration: function (startDate, completeDate) {
		var diff = moment(completeDate).diff(moment(startDate));
		return moment.duration(diff);
	},
	getData: function () {
		var self = this;
		var data = this.props.data.results.map(function (r, i) {
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
			// a must be equal to b
			return 0;
		});
		return data;
	},
	render: function () {
		var data = this.getData();
		var count = Math.min(data.length, 20);
		var rows = data.slice(0, count)
			.map(function (r, i) {
				return (
					<tr key={i}>
						<td>{r.id}: {r.title}</td>
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
								<th>Test case</th>
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
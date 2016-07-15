var TestRunDuration = React.createClass({
	getStartingDate: function () {
		var message = "Starting test run [" + this.props.data.id + "].";
		var logs = this.props.data.logEntries;
		for (var i = 0; i < logs.length; i++) {
			if (logs[i].message === message) {
				return logs[i].dateCreated;
			}
		}
		return "";
	},
	getCompletedDate: function() {
		var message = "Test run [" + this.props.data.id + "] completed.";
		var logs = this.props.data.logEntries;
		for (var i = logs.length - 1; i > 0; i--) {
			if (logs[i].message === message) {
				return logs[i].dateCreated;
			}
		}
		return "";
	},
	getDuration: function (startDate, completeDate) {
		var diff = moment(completeDate).diff(moment(startDate));
		return moment.duration(diff);
	},
	render: function () {
		var startingDate = this.getStartingDate();
		var completedDate = this.getCompletedDate();
		var duration = this.getDuration(startingDate, completedDate);
		return (
			<div className="testRunDuration">
				<h3>Test cases execution duration</h3>
				<p>The duration calculated based on test run log.</p>
				Duration: <b>{duration.humanize()}</b>
			</div>
		);
	}
});
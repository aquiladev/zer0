var TestRunInfo = React.createClass({
	getDuration: function () {
		var diff = moment(this.props.data.dateCompleted).diff(moment(this.props.data.dateStarted));
		return moment.duration(diff).humanize();
	},
	render: function () {
		return (
			<div className="testRunInfo">
				<h3>Test run info</h3>
				<table>
					<tbody>
						<tr>
							<td>
								<table>
									<tbody>
										<tr>
											<td>ID: </td>
											<td className="infoValue">{this.props.data.id}</td>
										</tr>
										<tr>
											<td>Title: </td>
											<td className="infoValue">{this.props.data.title}</td>
										</tr>
										<tr>
											<td>Owner: </td>
											<td className="infoValue">{this.props.data.owner.name}</td>
										</tr>
										<tr>
											<td>ProcessState: </td>
											<td className="infoValue">{this.props.data.postProcessState}</td>
										</tr>
										<tr>
											<td>State: </td>
											<td className="infoValue">{this.props.data.state}</td>
										</tr>
									</tbody>
								</table>
							</td>
							<td>
								<table>
									<tbody>
										<tr>
											<td>Duration: </td>
											<td className="infoValue">{this.getDuration()}</td>
										</tr>
										<tr>
											<td>Date started: </td>
											<td className="infoValue">{moment(this.props.data.dateStarted).format()}</td>
										</tr>
										<tr>
											<td>Date completed: </td>
											<td className="infoValue">{moment(this.props.data.dateCompleted).format()}</td>
										</tr>
										<tr>
											<td>Test controller: </td>
											<td className="infoValue">{this.props.data.controller}</td>
										</tr>
										<tr>
											<td>Build: </td>
											<td className="infoValue">{this.props.data.buildNumber}</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
});
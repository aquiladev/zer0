var TestRunListControlPanel = React.createClass({
	onSelect: function (event) {
		event.stopPropagation();
		this.props.onSelect(event.target.checked);
	},
	render: function () {
		return (
			<div className="cP">
				<div className="cP-ch cP-c">
					<div className="cP-chC cP-c">
						<span className="">
							<input type="checkbox" onClick={this.onSelect} />
						</span>
					</div>
				</div>
			</div>
		);
	}
});

var TestRunItem = React.createClass({
	onClick: function () {
		this.props.onClick(this.props.data.id);
	},
	onSelect: function (event) {
		event.stopPropagation();
		this.props.onSelect(this.props.data.id, event.target.checked);
	},
	getStateClass(state) {
		var value;
		if (state === "InProgress") {
			value = "in-progress";
		} else if (state === "Completed") {
			value = "completed";
		} else if (state === "Waiting") {
			value = "waiting";
		} else {
			value = "need-attention";
		}

		return value;
	},
	render: function () {
		var rootClass = "testRunItem" + (this.props.active ? " active" : "");
		var stateClass = "testRunItemState " + this.getStateClass(this.props.data.state);
		return (
			<div className={rootClass} id={this.props.data.id} onClick={this.onClick}>
				<table>
					<tbody>
						<tr>
							<td><input type="checkbox" onClick={this.onSelect} checked={this.props.checked} /></td>
							<td><div className={stateClass}></div></td>
							<td>{this.props.data.id}: {this.props.data.title}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
});

var TestRunList = React.createClass({
	onClickItem: function (runId) {
		if (this.state.selected.length) {
			this.onSelectItem(runId, true);
		} else {
			this.setState({
				active: runId
			});
			this.props.onTestRunSelect([runId]);
		}
	},
	onSelectItem: function (runId, checked) {
		var list = [];
		if (checked) {
			if (this.state.selected.indexOf(runId) > -1) {
				return;
			}
			list = this.state.selected.concat([runId]);
			this.setState({
				selected: list,
				active: 0
			});
		} else {
			var index = this.state.selected.indexOf(runId);
			if (index > -1) {
				list = this.state.selected.slice();
				list.splice(index, 1);
				this.setState({
					selected: list,
					active: 0
				});
			}
		}
		this.props.onTestRunSelect(list);
	},
	onSelect: function (checked) {
		var list = [];
		if (checked) {
			list = this.props.data.map(function (r) { return r.id; });
		}
		this.setState({
			selected: list,
			active: 0
		});
		this.props.onTestRunSelect(list);
	},
	getInitialState: function () {
		return {
			selected: [],
			active: 0
		}
	},
	render: function () {
		var self = this;
		var nodes = this.props.data.map(function (r, i) {
			return (
				<TestRunItem data={r}
							 key={i}
							 onClick={self.onClickItem}
							 onSelect={self.onSelectItem}
							 active={r.id === self.state.active}
							 checked={self.state.selected.indexOf(r.id) > -1} />
			);
		});
		return (
			<div className="testRunList">
				<TestRunListControlPanel onSelect={this.onSelect} />
				<div className="testRunListItems">
					{nodes}
				</div>
			</div>
		);
	}
});

var TestRunDashboard = React.createClass({
	render: function () {
		var content = [];
		if (!this.props.data) {
			return (
				<div className="testRunDashboard" />
			);
		}
		if (this.props.data.length === 1) {
			var run = this.props.data[0];
			content.push(<TestRunInfo data={run} key="0" />);
			content.push(<TestRunDuration data={run} key="1" />);
			content.push(<TestRunLife data={run} key="2" />);
			content.push(<TestCasesTimeline data={run} key="3" />);
			content.push(<TestCasesPerAgent data={run} key="4" />);
			content.push(<TestCasesLongest data={run} key="5" />);
		} else if (this.props.data.length > 1) {
			content.push(<TestRunsDuration data={this.props.data} key="0" />);
			content.push(<TestAgentsPerTestRun data={this.props.data} key="1" />);
			//if (this.props.data.length === 2) {
			//	content.push(<TestRunsSequenceExecution data={this.props.data} key="2" />);
			//}
			content.push(<TestCasesFailures data={this.props.data} key="3" />);
			content.push(<TestCasesDeviation data={this.props.data} key="4" />);
		}
		return (
			<div className="testRunDashboard">
				{content}
			</div>
		);
	}
});

var TestRunBox = React.createClass({
	search: function (queryText) {
		var xhr = new XMLHttpRequest();
		xhr.open("get", this.props.url + "?title=" + queryText, true);
		xhr.onload = function () {
			var data = JSON.parse(xhr.responseText);
			this.setState({ data: data });
		}.bind(this);
		xhr.send();

		this.setState({
			query: queryText
		});
	},
	getRuns: function (selected) {
		return this.state.data.filter(function (r) {
			return selected.indexOf(r.id) > -1;
		});
	},
	testRunSelect: function (selected) {
		this.setState({
			selected: selected,
			runs: this.getRuns(selected)
		});
	},
	getInitialState: function () {
		return {
			query: "",
			data: [],
			selected: [],
			runs: []
		}
	},
	render: function () {
		return (
			<div className="testRunBox">
				<SearchBox query={this.state.query} onSearch={this.search} placeholder="Title" />
				<div className="row">
					<div className="col-xs-3">
						<TestRunList data={this.state.data} onTestRunSelect={this.testRunSelect} />
					</div>
					<div className="col-xs-9">
						<TestRunDashboard data={this.state.runs} />
					</div>
				</div>
			</div>
		);
	}
});

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

ReactDOM.render((
	<Router>
		<Route path="/" component={() => (<TestRunBox url="/api/testruns" />)}></Route>
	</Router>
), document.getElementById("content"));
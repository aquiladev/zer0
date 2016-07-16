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
	onClick: function() {
		this.props.onClick(this.props.data.id);
	},
	onSelect: function(event) {
		event.stopPropagation();
		this.props.onSelect(this.props.data.id, event.target.checked);
	},
	getStateClass(item) {
		var value;
		if (!item.data) {
			value = "loading-data";
		} else if (item.data.state === "InProgress") {
			value = "in-progress";
		} else if (item.data.state === "Completed") {
			value = "completed";
		} else if (item.data.state === "Waiting") {
			value = "waiting";
		} else {
			value = "need-attention";
		}

		return value;
	},
	render: function() {
		var rootClass = "testRunItem" + (this.props.data.data ? " selectable" : "") + (this.props.active ? " active" : "");
		var stateClass = "testRunItemState " + this.getStateClass(this.props.data);
		var checkbox = "";
		if (this.props.data.data) {
			checkbox = <input type="checkbox" onClick={this.onSelect} checked={this.props.checked } />;
		}
		return (
			<div className={rootClass} id={this.props.data.id} onClick={this.onClick}>
				<table>
					<tbody>
						<tr>
							<td><div className="testRunItemSelect">{checkbox}</div></td>
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
			content.push(<TestCasesPerTestRuns data={this.props.data} key="1" />);
			content.push(<TestAgentsPerTestRuns data={this.props.data} key="2" />);
			//if (this.props.data.length === 2) {
			//	content.push(<TestRunsSequenceExecution data={this.props.data} key="3" />);
			//}
			content.push(<TestCasesFailures data={this.props.data} key="4" />);
			content.push(<TestCasesDeviation data={this.props.data} key="5" />);
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
		xhr.open("get", this.props.searchUrl + "?q=" + encodeURIComponent(queryText), true);
		xhr.onload = function () {
			var data = JSON.parse(xhr.responseText);
			this.setState({ items: data });
			this.postLoad();
		}.bind(this);
		xhr.send();

		this.setState({
			query: queryText
		});
	},
	postLoad: function () {
		var self = this;
		window.setTimeout(function () {
			for (var i = 0; i < self.state.items.length; i++) {
				var item = self.state.items[i];
				if (item.data) {
					continue;
				}
				self.loadRun(item.id, i);
			}
		}, 1);
	},
	loadRun: function (id, index) {
		var xhr = new XMLHttpRequest();
		xhr.open("get", this.props.url + "?id=" + id, true);
		xhr.onload = function () {
			var data = JSON.parse(xhr.responseText);
			var items = this.state.items.slice();
			items[index].data = data;
			this.setState({ items: items });
		}.bind(this);
		xhr.send();
	},
	getRuns: function (selected) {
		var selectedRuns = this.state.items
			.filter(function(r) {
				return selected.indexOf(r.id) > -1 && r.data;
			})
			.map(function(r) { return r.data; });

		return selectedRuns.sort(function (a, b) {
			if (a.id > b.id) {
				return 1;
			}
			if (a.id < b.id) {
				return -1;
			}
			return 0;
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
			items: [],
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
						<TestRunList data={this.state.items} onTestRunSelect={this.testRunSelect} />
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
		<Route path="/" component={() => (<TestRunBox url="/api/testruns" searchUrl="/api/search/testruns" />)}></Route>
	</Router>
), document.getElementById("content"));
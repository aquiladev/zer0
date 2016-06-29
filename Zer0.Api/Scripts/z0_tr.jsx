var TestRun = React.createClass({
	onClick: function () {
		this.props.onSelect(this.props.data);
	},
	render: function () {
		var classModel = 'testRun' + (this.props.selected ? ' selected': '');
		return (
			<div className={classModel} id={this.props.data.id} onClick={this.onClick}>
				{this.props.data.id}: {this.props.data.title}
			</div>
		);
	}
});

var TestRunList = React.createClass({
	onSelectItem: function(data) {
		this.setState({
			selectedRun: data
		});
		this.props.onTestRunSelect(data);
	},
	getInitialState: function () {
		return {
			selectedRun: {}
		}
	},
	render: function () {
		var handler = this.onSelectItem;
		var state = this.state;
		var testRunNodes = this.props.data.map(function (testRun, i) {
			return (
				<TestRun data={testRun} key={i} onSelect={handler} selected={testRun.id === state.selectedRun.id} />
			);
		});
		return (
			<div className="testRunList">
				{testRunNodes}
			</div>
		);
	}
});

var TestRunDashboard = React.createClass({
	render: function () {
		if (this.props.data && this.props.data.id) {
			return (
				<div className="testRunDashboard">
					<TestRunInfo data={this.props.data} />
					<TestRunDuration data={this.props.data} />
					<TestRunLife data={this.props.data} />
					<TestCasesTimeline data={this.props.data} />
					<TestCasesPerAgent data={this.props.data} />
					<TestCasesLongest data={this.props.data} />
				</div>
			);
		} else {
			return (
				<div className="testRunDashboard" />
			);
		}
	}
});

var TestRunBox = React.createClass({
	search: function(queryText) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', this.props.url + "?title=" + queryText, true);
		xhr.onload = function() {
			var data = JSON.parse(xhr.responseText);
			this.setState({ data: data });
		}.bind(this);
		xhr.send();

		this.setState({
			query: queryText
		});
	},
	testRunSelect: function(run) {
		this.setState({
			selectedRun: run
		});
	},
	getInitialState: function() {
		return {
			query: '',
			data: [],
			selectedRun: {}
		}
	},
	render: function() {
		return (
			<div className="testRunBox">
				<SearchBox query={this.state.query} onSearch={this.search} placeholder="Title" />
				<div className="row">
					<div className="col-xs-3">
						<TestRunList data={this.state.data} onTestRunSelect={this.testRunSelect} />
					</div>
					<div className="col-xs-9">
						<TestRunDashboard data={this.state.selectedRun} />
					</div>
				</div>
			</div>
		);
	}
});

ReactDOM.render(
	<TestRunBox url="/api/testruns" />,
	document.getElementById('content')
);
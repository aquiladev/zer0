var TestCasesFailures = React.createClass({
	expand: function (e) {
		var row = $(e.target).parents("tr");
		console.log(row);
		$(".testCasesFailures .details").hide();
		if ($(e.target).hasClass("collapse")) {
			$(e.target).removeClass("collapse");
		} else {
			$('.testCasesFailures .collapse').removeClass("collapse");
			$("#" + row.attr("id") + "_d").show();
			$(e.target).addClass("collapse");
		}
	},
	parse: function (data) {
		var stat = {};
		for (var i = 0; i < data.length; i++) {
			var run = data[i];
			for (var j = 0; j < run.results.length; j++) {
				var testCase = run.results[j];
				if (testCase.outcome !== "Failed") {
					continue;
				}

				if (!stat[testCase.testCaseId]) {
					stat[testCase.testCaseId] = {
						id: testCase.testCaseId,
						title: testCase.testCaseTitle,
						errors: [],
						count: 0
					};
				}
				var msgIndex = testCase.errorMessage.indexOf("Message:");
				var error = msgIndex > -1
					? testCase.errorMessage.substr(msgIndex)
					: testCase.errorMessage;
				stat[testCase.testCaseId].errors.push(error);
				stat[testCase.testCaseId].count += 1;
			}
		}

		var cases = [];
		var keys = Object.keys(stat);
		for (var x in keys) {
			if (keys.hasOwnProperty(x)) {
				var propName = keys[x];
				var prop = stat[propName];
				cases.push(prop);
			}
		}

		cases.sort(function (a, b) {
			if (a.count > b.count) {
				return -1;
			}
			if (a.count < b.count) {
				return 1;
			}
			return 0;
		});

		return cases;
	},
	render: function () {
		var cases = this.parse(this.props.data);
		var rows = [];
		for (var i = 0; i < cases.length; i++) {
			rows.push(<tr id={"cf_" + i} className="row" key={i}>
				<td className="expander">
					<div className="expand" tabindex="0" title="Expand this row" onClick={this.expand}></div>
				</td>
				<td>{i}</td>
				<td>{cases[i].id}</td>
				<td className="title">{cases[i].title}</td>
				<td>{cases[i].count}</td>
			</tr>);
			var errs = cases[i].errors.map(function (m, j) {
				return (
					<div key={ i + '_d_' + j }>{m}</div>
				);
			});
			rows.push(<tr className="details" id={"cf_" + i + "_d"} key={ i + '_d' }>
				<td></td>
				<td></td>
				<td colSpan="3" className="content">{errs}</td>
			</tr>);
		}
		return (
			<div className="testCasesFailures">
				<h3>Test cases failures</h3>
				<table>
						<thead>
							<tr>
								<th></th>
								<th>#</th>
								<th>Id</th>
								<th>Title</th>
								<th>Number of failures</th>
							</tr>
						</thead>
						<tbody>{rows}</tbody>
				</table>
			</div>
		);
	}
});
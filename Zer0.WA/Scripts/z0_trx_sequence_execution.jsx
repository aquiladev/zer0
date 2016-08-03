var TestRunsSequenceExecution = React.createClass({
	componentDidMount: function() {
		this.renderChart();
	},
	componentDidUpdate: function() {
		this.renderChart();
	},
	parse: function(cases, runId, yShift) {
		var graph = {
			nodes: [],
			edges: []
		};
		yShift = yShift || 0;

		var sourceId;
		for (var i = 0; i < cases.length; i++) {
			var id = runId + "" + cases[i].testCaseId;
			graph.nodes.push({
				data: {
					id: id,
					title: cases[i].testCaseId,
					color: cases[i].outcome === "Failed" ? "#ea2117" : cases[i].outcome === "Passed" ? "#30983f" : "#61bffc",
					position: { x: 80 * i, y: 100 + yShift }
				}
			});

			if (sourceId) {
				graph.edges.push({
					data: {
						id: i + yShift,
						weight: 1,
						source: sourceId,
						target: id
					}
				});
			}
			sourceId = id;
		}

		return graph;
	},
	merge: function(f, s) {
		var nodes = f.nodes.concat(s.nodes);
		var edges = f.edges.concat(s.edges);

		return {
			nodes:nodes,
			edges:edges
		};
	},
	renderChart: function () {
		console.log("render cy");
		var g1 = this.parse(this.props.data[0].results, this.props.data[0].id);
		console.log(g1.nodes.map(function (i) { return i.data.title }));
		
		var g2 = this.parse(this.props.data[1].results, this.props.data[1].id, 100);
		var g = this.merge(g1, g2);

		var positions = {};
		for (var i = 0; i < g.nodes.length; i++) {
			var data = g.nodes[i].data;
			positions[data.id] = data.position;
		}

		var cy = cytoscape({
			container: document.getElementById('cy'),
			boxSelectionEnabled: false,
			autounselectify: false,
			style: cytoscape.stylesheet()
				.selector('node')
				.css({
					'content': 'data(title)',
					'background-color': 'data(color)',
				})
				.selector('edge')
				.css({
					'target-arrow-shape': 'triangle',
					'width': 2,
					'line-color': '#ddd',
					'target-arrow-color': '#ddd',
					'curve-style': 'bezier'
				})
				.selector('.highlighted')
				.css({
					'background-color': '#61bffc',
					'line-color': '#61bffc',
					'target-arrow-color': '#61bffc',
					'transition-property': 'background-color, line-color, target-arrow-color',
					'transition-duration': '0.5s'
				}),
			elements: g,
			layout: {
				name: 'preset',
				directed: true,
				positions: positions,
				padding: 10
			}
		});
	},
	render: function () {
		return (
			<div className="restRunsSequenceExecution">
				<h3>Sequence execution</h3>
				<div id="cy" style={{height: 400}}></div>
			</div>
		);
	}
});
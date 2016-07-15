var SearchBox = React.createClass({
	onKeyPress: function (e) {
		if (!e) e = window.event;
		var keyCode = e.keyCode || e.which;
		if (keyCode === 13) {
			this.onSearch();
		}
	},
	onSearch: function () {
		var query = this.refs.searchInput.value;
		this.props.onSearch(query);
	},
	render: function () {
		return (
			<div className="sb">
				<div className="sbq">
					<div className="sbt">
						<fieldset className="sbqff">
							<div className="sbqfqw">
								<input type="text" ref="searchInput" placeholder={this.props.placeholder} onKeyPress={this.onKeyPress} />
							</div>
						</fieldset>
						<div className="sb_R">
							<button className="sbqfb" aria-label="Search" name="" onClick={this.onSearch}>
								<span className="sbqfi"></span>
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});